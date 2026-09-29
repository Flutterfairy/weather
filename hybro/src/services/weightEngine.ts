import {
  ModelId, ModelWeight, ModelPerformance, WeightContext,
  WeightFactorScores, LeadTimeWeights
} from '../types';

// ─── Base Performance Data ──────────────────────────────────────────────────
// Month×Region×Model performance matrix (demonstration values)

interface PerformanceEntry {
  rain: number; temp: number; wind: number; extreme: number;
}

type PerfMatrix = Record<string, Record<string, Record<ModelId, PerformanceEntry>>>;

// Generates a deterministic pseudo-random offset from a seed string
function seededOffset(seed: string, range: number): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  }
  return ((hash % (range * 2)) - range) / 10;
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

// Base skill profiles for each model per weather-type context
const MODEL_PROFILES: Record<ModelId, { rain: number; temp: number; wind: number; extreme: number }> = {
  nwp_a:      { rain: 88, temp: 91, wind: 84, extreme: 82 },
  ai_b:       { rain: 84, temp: 89, wind: 86, extreme: 90 },
  ensemble_c: { rain: 86, temp: 88, wind: 89, extreme: 87 },
};

// Regional adjustments — some models perform better in certain regions
const REGIONAL_ADJUSTMENTS: Record<string, Record<ModelId, number>> = {
  pune:      { nwp_a: 1.02, ai_b: 0.98, ensemble_c: 0.97 },
  mumbai:    { nwp_a: 0.95, ai_b: 1.05, ensemble_c: 0.98 },
  nagpur:    { nwp_a: 0.97, ai_b: 0.96, ensemble_c: 1.06 },
  nashik:    { nwp_a: 1.00, ai_b: 1.01, ensemble_c: 1.00 },
  bengaluru: { nwp_a: 0.98, ai_b: 1.03, ensemble_c: 1.00 },
  delhi:     { nwp_a: 1.03, ai_b: 0.97, ensemble_c: 1.01 },
};

// Monthly adjustments — models have seasonal strengths
const MONTHLY_ADJUSTMENTS: Record<string, Record<ModelId, number>> = {
  January:   { nwp_a: 1.04, ai_b: 0.96, ensemble_c: 1.00 },
  February:  { nwp_a: 1.03, ai_b: 0.97, ensemble_c: 1.00 },
  March:     { nwp_a: 1.02, ai_b: 0.98, ensemble_c: 1.00 },
  April:     { nwp_a: 1.00, ai_b: 1.01, ensemble_c: 1.00 },
  May:       { nwp_a: 0.98, ai_b: 1.03, ensemble_c: 1.00 },
  June:      { nwp_a: 1.02, ai_b: 1.00, ensemble_c: 0.98 },
  July:      { nwp_a: 1.04, ai_b: 0.98, ensemble_c: 0.99 },
  August:    { nwp_a: 1.03, ai_b: 0.99, ensemble_c: 0.99 },
  September: { nwp_a: 1.05, ai_b: 0.97, ensemble_c: 0.97 },
  October:   { nwp_a: 1.00, ai_b: 1.02, ensemble_c: 0.99 },
  November:  { nwp_a: 0.99, ai_b: 1.01, ensemble_c: 1.01 },
  December:  { nwp_a: 1.02, ai_b: 0.98, ensemble_c: 1.01 },
};

// Weather regime adjustments
const REGIME_ADJUSTMENTS: Record<string, Record<ModelId, number>> = {
  'Dry Winter Conditions':       { nwp_a: 1.01, ai_b: 0.99, ensemble_c: 1.01 },
  'Dry Warm Conditions':         { nwp_a: 1.00, ai_b: 1.00, ensemble_c: 1.00 },
  'Pre-Monsoon Heating':         { nwp_a: 0.99, ai_b: 1.02, ensemble_c: 1.00 },
  'Pre-Monsoon Thunderstorms':   { nwp_a: 0.98, ai_b: 1.04, ensemble_c: 0.99 },
  'Monsoon Onset':               { nwp_a: 1.03, ai_b: 0.98, ensemble_c: 0.99 },
  'Heavy Monsoon Onset':         { nwp_a: 1.04, ai_b: 0.97, ensemble_c: 0.98 },
  'Active Monsoon':              { nwp_a: 1.03, ai_b: 0.99, ensemble_c: 0.98 },
  'Extreme Monsoon Rainfall':    { nwp_a: 1.05, ai_b: 0.96, ensemble_c: 0.97 },
  'Heavy Rainfall Conditions':   { nwp_a: 1.05, ai_b: 0.97, ensemble_c: 0.97 },
  'Monsoon Rainfall':            { nwp_a: 1.03, ai_b: 0.99, ensemble_c: 0.98 },
  'Retreating Monsoon':          { nwp_a: 1.00, ai_b: 1.01, ensemble_c: 1.00 },
  'Post-Monsoon Dry':            { nwp_a: 0.99, ai_b: 1.01, ensemble_c: 1.01 },
  'Post-Monsoon Clear':          { nwp_a: 0.99, ai_b: 1.01, ensemble_c: 1.01 },
  'Dry Cold Conditions':         { nwp_a: 1.02, ai_b: 0.98, ensemble_c: 1.01 },
  'Dry Warming':                 { nwp_a: 1.00, ai_b: 1.00, ensemble_c: 1.00 },
  'Pre-Monsoon Heat':            { nwp_a: 0.99, ai_b: 1.02, ensemble_c: 1.00 },
  'Extreme Heat':                { nwp_a: 0.97, ai_b: 1.04, ensemble_c: 1.00 },
  'Pre-Monsoon Warming':         { nwp_a: 1.00, ai_b: 1.00, ensemble_c: 1.00 },
  'Southwest Monsoon':           { nwp_a: 1.02, ai_b: 0.99, ensemble_c: 0.99 },
  'Northeast Monsoon Onset':     { nwp_a: 0.98, ai_b: 1.02, ensemble_c: 1.01 },
  'Northeast Monsoon':           { nwp_a: 0.98, ai_b: 1.03, ensemble_c: 1.00 },
  'Dry Cool Conditions':         { nwp_a: 1.01, ai_b: 0.99, ensemble_c: 1.01 },
  'Extreme Winter Cold':         { nwp_a: 1.03, ai_b: 0.97, ensemble_c: 1.01 },
  'Winter Warming':              { nwp_a: 1.01, ai_b: 0.99, ensemble_c: 1.00 },
  'Pre-Summer Warming':          { nwp_a: 1.00, ai_b: 1.01, ensemble_c: 1.00 },
  'Summer Heat':                 { nwp_a: 0.98, ai_b: 1.03, ensemble_c: 1.00 },
  'Extreme Heat Wave':           { nwp_a: 0.96, ai_b: 1.05, ensemble_c: 1.00 },
  'Early Winter':                { nwp_a: 1.02, ai_b: 0.98, ensemble_c: 1.01 },
};

// Lead time decay — NWP decays faster than AI at longer horizons
const LEAD_TIME_FACTORS: Record<string, Record<ModelId, number>> = {
  '1-3':  { nwp_a: 1.05, ai_b: 0.98, ensemble_c: 0.97 },
  '3-5':  { nwp_a: 1.00, ai_b: 1.02, ensemble_c: 1.00 },
  '4-6':  { nwp_a: 0.97, ai_b: 1.03, ensemble_c: 1.01 },
  '6-10': { nwp_a: 0.93, ai_b: 1.05, ensemble_c: 1.04 },
  '7-10': { nwp_a: 0.91, ai_b: 1.06, ensemble_c: 1.05 },
};

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Get model performance for a given region and month.
 */
export function getModelPerformance(region: string, month: string): ModelPerformance[] {
  const models: ModelId[] = ['nwp_a', 'ai_b', 'ensemble_c'];
  return models.map(modelId => {
    const base = MODEL_PROFILES[modelId];
    const regAdj = REGIONAL_ADJUSTMENTS[region]?.[modelId] ?? 1.0;
    const monAdj = MONTHLY_ADJUSTMENTS[month]?.[modelId] ?? 1.0;
    const seed = `${region}-${month}-${modelId}`;
    const rain = clamp(Math.round(base.rain * regAdj * monAdj + seededOffset(seed + 'r', 30)), 70, 98);
    const temp = clamp(Math.round(base.temp * regAdj * monAdj + seededOffset(seed + 't', 25)), 72, 98);
    const wind = clamp(Math.round(base.wind * regAdj * monAdj + seededOffset(seed + 'w', 25)), 70, 97);
    const extreme = clamp(Math.round(base.extreme * regAdj * monAdj + seededOffset(seed + 'e', 25)), 68, 97);
    const overallSkill = Math.round((rain + temp + wind + extreme) / 4);
    return { modelId, month, region, rainfallAccuracy: rain, temperatureAccuracy: temp, windAccuracy: wind, extremeEventDetection: extreme, overallSkill };
  });
}

/**
 * Calculate dynamic model weights based on context.
 * weight(model) = score(model) / sum(scores)
 * score = historicalPerformance × monthlyFactor × regionalFactor × leadTimeFactor × weatherRegimeFactor × recentPerformanceFactor
 */
export function calculateWeights(
  region: string,
  month: string,
  leadTimeBand: string,
  weatherRegime: string
): ModelWeight[] {
  const models: ModelId[] = ['nwp_a', 'ai_b', 'ensemble_c'];
  const performances = getModelPerformance(region, month);

  const scores = models.map(modelId => {
    const perf = performances.find(p => p.modelId === modelId)!;
    const historical = perf.overallSkill / 100;
    const monthFactor = MONTHLY_ADJUSTMENTS[month]?.[modelId] ?? 1.0;
    const regFactor = REGIONAL_ADJUSTMENTS[region]?.[modelId] ?? 1.0;
    const ltFactor = LEAD_TIME_FACTORS[leadTimeBand]?.[modelId] ?? 1.0;
    const regimeFactor = REGIME_ADJUSTMENTS[weatherRegime]?.[modelId] ?? 1.0;
    // Recent performance adds small variation
    const recentSeed = `${region}-${month}-${modelId}-recent`;
    const recentFactor = 1.0 + seededOffset(recentSeed, 5) / 100;

    return {
      modelId,
      score: historical * monthFactor * regFactor * ltFactor * regimeFactor * recentFactor,
    };
  });

  const totalScore = scores.reduce((s, sc) => s + sc.score, 0) || 1;

  const rawWeights = scores.map(s => ({
    modelId: s.modelId,
    weight: Math.round((s.score / totalScore) * 100),
  }));

  // Correct rounding drift so sum is guaranteed to be exactly 100%
  const sum = rawWeights.reduce((acc, w) => acc + w.weight, 0);
  if (sum !== 100 && rawWeights.length > 0) {
    const diff = 100 - sum;
    let maxIdx = 0;
    for (let i = 1; i < rawWeights.length; i++) {
      if (rawWeights[i].weight > rawWeights[maxIdx].weight) maxIdx = i;
    }
    rawWeights[maxIdx].weight += diff;
  }

  return rawWeights;
}

/**
 * Calculate weights for each lead-time band to show adaptation over forecast horizon.
 */
export function calculateLeadTimeWeights(
  region: string,
  month: string,
  weatherRegime: string
): LeadTimeWeights[] {
  const bands = [
    { band: '1-3', days: 'Days 1–3' },
    { band: '4-6', days: 'Days 4–6' },
    { band: '7-10', days: 'Days 7–10' },
  ];

  return bands.map(b => ({
    ...b,
    weights: calculateWeights(region, month, b.band, weatherRegime),
  }));
}

/**
 * Get the factor breakdown for display.
 */
export function getWeightFactorScores(
  modelId: ModelId,
  region: string,
  month: string,
  leadTimeBand: string,
  weatherRegime: string
): WeightFactorScores {
  const perf = getModelPerformance(region, month).find(p => p.modelId === modelId)!;
  return {
    historical: perf.overallSkill,
    monthly: Math.round((MONTHLY_ADJUSTMENTS[month]?.[modelId] ?? 1.0) * 100 - 100 + 50),
    regional: Math.round((REGIONAL_ADJUSTMENTS[region]?.[modelId] ?? 1.0) * 100 - 100 + 50),
    leadTime: Math.round((LEAD_TIME_FACTORS[leadTimeBand]?.[modelId] ?? 1.0) * 100 - 100 + 50),
    weatherRegime: Math.round((REGIME_ADJUSTMENTS[weatherRegime]?.[modelId] ?? 1.0) * 100 - 100 + 50),
    recent: 50 + Math.round(seededOffset(`${region}-${month}-${modelId}-recent`, 5)),
  };
}

/**
 * Get a weight explanation string based on the context.
 */
export function getWeightExplanation(
  region: string,
  month: string,
  weatherRegime: string
): string {
  const models: ModelId[] = ['nwp_a', 'ai_b', 'ensemble_c'];
  const weights = calculateWeights(region, month, '1-3', weatherRegime);
  const best = weights.reduce((a, b) => a.weight > b.weight ? a : b);
  
  const modelNames: Record<ModelId, string> = {
    nwp_a: 'NWP Model A',
    ai_b: 'AI Model B',
    ensemble_c: 'Ensemble Model C',
  };

  const isRainy = weatherRegime.toLowerCase().includes('rain') || weatherRegime.toLowerCase().includes('monsoon');
  const isHot = weatherRegime.toLowerCase().includes('heat') || weatherRegime.toLowerCase().includes('hot');

  let reason = '';
  if (best.modelId === 'nwp_a') {
    reason = isRainy
      ? `${modelNames[best.modelId]} performs strongly for rainfall prediction in ${region.charAt(0).toUpperCase() + region.slice(1)} during ${month}, so its weight increases for near-term rainfall forecasting.`
      : `${modelNames[best.modelId]} demonstrates superior performance in ${region.charAt(0).toUpperCase() + region.slice(1)} during ${month} under ${weatherRegime.toLowerCase()}, earning the highest contribution.`;
  } else if (best.modelId === 'ai_b') {
    reason = isHot
      ? `During ${month}, ${modelNames[best.modelId]} has improved heat-event detection for ${region.charAt(0).toUpperCase() + region.slice(1)}, increasing its contribution to the blended forecast.`
      : `During ${month}, recent ${modelNames[best.modelId]} performance has improved, increasing its contribution to the blended forecast for ${region.charAt(0).toUpperCase() + region.slice(1)}.`;
  } else {
    reason = `${modelNames[best.modelId]} shows balanced performance across all metrics in ${region.charAt(0).toUpperCase() + region.slice(1)} during ${month}, providing reliable ensemble averaging.`;
  }

  return reason;
}
