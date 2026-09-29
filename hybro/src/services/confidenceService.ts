import { ForecastConfidence, ConfidenceLevel, ForecastPoint } from '../types';

/**
 * Calculate forecast confidence based on model agreement, lead time, and conditions.
 */
export function calculateConfidence(
  forecastData: ForecastPoint[],
  modelAgreement: number[] // per-day agreement scores (0-100)
): ForecastConfidence[] {
  const bands = [
    { band: '1-3', days: 'Days 1–3', dayRange: [1, 3] },
    { band: '4-6', days: 'Days 4–6', dayRange: [4, 6] },
    { band: '7-10', days: 'Days 7–10', dayRange: [7, 10] },
  ];

  return bands.map(b => {
    // Base confidence decreases with lead time
    const leadTimePenalty = b.dayRange[0] <= 3 ? 0 : b.dayRange[0] <= 6 ? 15 : 28;

    // Get average model agreement for this band
    const bandAgreement = modelAgreement
      .slice(b.dayRange[0] - 1, b.dayRange[1])
      .reduce((s, v) => s + v, 0) / (b.dayRange[1] - b.dayRange[0] + 1);

    // Check weather volatility in this band
    const bandPoints = forecastData.filter(p => p.day >= b.dayRange[0] && p.day <= b.dayRange[1]);
    const volatility = bandPoints.length > 0
      ? bandPoints.reduce((s, p) => s + (p.precipitationProbability > 60 ? 5 : 0), 0) / bandPoints.length
      : 0;

    const score = Math.round(85 + bandAgreement * 0.1 - leadTimePenalty - volatility);
    const level = scoreToLevel(score);

    const explanations: Record<ConfidenceLevel, string> = {
      'High': 'Models show strong agreement with high historical accuracy for this range.',
      'Medium': 'Moderate model agreement with increasing forecast uncertainty.',
      'Moderate': 'Model divergence increases; confidence decreases at extended range.',
      'Low': 'Significant model disagreement; extended-range forecast uncertainty is high.',
    };

    return {
      band: b.band,
      days: b.days,
      level,
      score: clamp(score, 20, 98),
      explanation: explanations[level],
    };
  });
}

function scoreToLevel(score: number): ConfidenceLevel {
  if (score >= 80) return 'High';
  if (score >= 65) return 'Medium';
  if (score >= 50) return 'Moderate';
  return 'Low';
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

/**
 * Calculate model agreement scores for each day.
 * Based on standard deviation of model predictions.
 */
export function calculateModelAgreement(
  modelTemps: number[][], // [model][day] average temperatures
  days: number = 10
): number[] {
  const agreement: number[] = [];
  for (let d = 0; d < days; d++) {
    const temps = modelTemps.map(m => m[d] ?? 0);
    const mean = temps.reduce((s, t) => s + t, 0) / temps.length;
    const variance = temps.reduce((s, t) => s + (t - mean) ** 2, 0) / temps.length;
    const stdDev = Math.sqrt(variance);
    // Low stdDev → high agreement
    agreement.push(Math.round(clamp(100 - stdDev * 15, 40, 100)));
  }
  return agreement;
}
