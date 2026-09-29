import {
  ForecastPoint, ModelForecast, ModelId, ModelWeight, WeatherCondition, ExtremeRiskType
} from '../types';
import { TIME_SLOTS, BASE_TEMPERATURES, BASE_RAIN_PROB } from '../data/constants';

// ─── Deterministic pseudo-random ────────────────────────────────────────────

function seededRandom(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  }
  // Return 0-1 range
  return ((hash & 0x7fffffff) % 10000) / 10000;
}

function seededGaussian(seed: string, mean: number, stdDev: number): number {
  const u1 = seededRandom(seed + 'a');
  const u2 = seededRandom(seed + 'b');
  const z = Math.sqrt(-2 * Math.log(Math.max(u1, 0.001))) * Math.cos(2 * Math.PI * u2);
  return mean + z * stdDev;
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

// ─── Time-of-day temperature pattern ────────────────────────────────────────

const TIME_TEMP_OFFSETS: Record<string, number> = {
  '06:00 AM': -4,
  '09:00 AM': -1,
  '12:00 PM': 2,
  '03:00 PM': 3,
  '06:00 PM': 0,
  '09:00 PM': -2,
};

const TIME_RAIN_MULTIPLIERS: Record<string, number> = {
  '06:00 AM': 0.7,
  '09:00 AM': 0.8,
  '12:00 PM': 1.0,
  '03:00 PM': 1.3,
  '06:00 PM': 1.1,
  '09:00 PM': 0.9,
};

// ─── Condition mapping ──────────────────────────────────────────────────────

function getCondition(rainProb: number, rainfall: number, temp: number, windSpeed: number): WeatherCondition {
  if (rainfall > 30 || rainProb > 80) return 'Heavy Rain';
  if (rainfall > 15 || rainProb > 65) return 'Rain';
  if (rainfall > 5 || rainProb > 45) return 'Light Rain';
  if (rainProb > 30) return 'Cloudy';
  if (windSpeed > 35) return 'Windy';
  if (temp > 38) return 'Hot';
  if (rainProb > 15) return 'Partly Cloudy';
  if (rainProb > 8) return 'Haze';
  return 'Clear';
}

function getExtremeRisk(rainfall: number, temp: number, windSpeed: number): ExtremeRiskType | undefined {
  if (rainfall > 40) return 'heavy_rainfall';
  if (temp > 38) return 'heat_wave';
  if (windSpeed > 40) return 'high_wind';
  return undefined;
}

// ─── Generate forecast for a single model ───────────────────────────────────

function generateModelForecast(
  modelId: ModelId,
  region: string,
  month: string,
  days: number,
  modelBias: { tempBias: number; rainBias: number; windBias: number }
): ForecastPoint[] {
  const baseTemp = BASE_TEMPERATURES[region]?.[month] ?? 28;
  const baseRain = BASE_RAIN_PROB[region]?.[month] ?? 30;
  const points: ForecastPoint[] = [];

  for (let day = 1; day <= days; day++) {
    // Add day-level variation
    const daySeed = `${modelId}-${region}-${month}-day${day}`;
    const dayTempVar = seededGaussian(daySeed + 'temp', 0, 1.5);
    const dayRainVar = seededGaussian(daySeed + 'rain', 0, 8);

    // Lead time increases uncertainty
    const leadUncertainty = 1 + (day - 1) * 0.08;

    // Create a "heavy rain event" on specific days for monsoon months
    const isRainyMonth = ['June', 'July', 'August', 'September'].includes(month);
    const isHeavyRainDay = isRainyMonth && (day === 4 || day === 5);
    const heavyRainBoost = isHeavyRainDay ? 25 : 0;

    // Create a "heat event" on day 7 for hot months
    const isHotMonth = ['April', 'May'].includes(month);
    const isHeatDay = isHotMonth && (day === 7 || day === 8);
    const heatBoost = isHeatDay ? 4 : 0;

    for (const time of TIME_SLOTS) {
      const timeSeed = `${modelId}-${region}-${month}-d${day}-${time}`;
      const tempOffset = TIME_TEMP_OFFSETS[time] ?? 0;
      const rainMult = TIME_RAIN_MULTIPLIERS[time] ?? 1.0;

      // Temperature
      let temperature = baseTemp + tempOffset + dayTempVar + modelBias.tempBias + heatBoost;
      temperature += seededGaussian(timeSeed + 'T', 0, 0.8 * leadUncertainty);
      temperature = Math.round(clamp(temperature, 8, 48));

      // Precipitation probability
      let precipProb = (baseRain + dayRainVar + heavyRainBoost) * rainMult + modelBias.rainBias;
      precipProb += seededGaussian(timeSeed + 'P', 0, 5 * leadUncertainty);
      precipProb = Math.round(clamp(precipProb, 0, 98));

      // Rainfall
      let rainfall = precipProb > 20 ? (precipProb / 100) * (15 + seededGaussian(timeSeed + 'R', 0, 5)) : 0;
      rainfall += modelBias.rainBias * 0.3;
      if (isHeavyRainDay && time === '03:00 PM') rainfall += 20 + seededGaussian(timeSeed + 'HR', 0, 8);
      rainfall = Math.round(clamp(rainfall, 0, 120) * 10) / 10;

      // Wind
      let windSpeed = 8 + seededGaussian(timeSeed + 'W', 0, 4 * leadUncertainty) + modelBias.windBias;
      if (isHeavyRainDay) windSpeed += 5;
      if (day === 8 && time === '06:00 PM') windSpeed += 20;
      windSpeed = Math.round(clamp(windSpeed, 2, 65));

      // Humidity
      const humidity = Math.round(clamp(40 + precipProb * 0.5 + seededGaussian(timeSeed + 'H', 0, 5), 20, 98));

      const condition = getCondition(precipProb, rainfall, temperature, windSpeed);
      const extremeRisk = getExtremeRisk(rainfall, temperature, windSpeed);

      const dateObj = new Date();
      dateObj.setDate(dateObj.getDate() + day - 1);
      const dateStr = dateObj.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });

      points.push({
        date: dateStr,
        day,
        time,
        temperature,
        precipitationProbability: precipProb,
        rainfall,
        windSpeed,
        condition,
        extremeRisk,
        humidity,
      });
    }
  }

  return points;
}

// ─── Model biases ───────────────────────────────────────────────────────────
// Each model produces slightly different raw forecasts

const MODEL_BIASES: Record<ModelId, { tempBias: number; rainBias: number; windBias: number }> = {
  nwp_a:      { tempBias: -0.3, rainBias: 2, windBias: 0.5 },
  ai_b:       { tempBias: 0.5, rainBias: -1, windBias: -0.5 },
  ensemble_c: { tempBias: 0.1, rainBias: 0.5, windBias: 1 },
};

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Generate individual model forecasts.
 */
export function generateModelForecasts(
  region: string,
  month: string,
  days: number = 10
): ModelForecast[] {
  const models: ModelId[] = ['nwp_a', 'ai_b', 'ensemble_c'];
  return models.map(modelId => ({
    modelId,
    points: generateModelForecast(modelId, region, month, days, MODEL_BIASES[modelId]),
  }));
}

/**
 * Blend forecasts using weighted combination.
 * blendedValue = Σ(weight_i × value_i) / Σ(weight_i)
 */
export function blendForecasts(
  modelForecasts: ModelForecast[],
  weights: ModelWeight[]
): ForecastPoint[] {
  if (modelForecasts.length === 0) return [];

  const numPoints = modelForecasts[0].points.length;
  const blended: ForecastPoint[] = [];

  const totalWeight = weights.reduce((s, w) => s + w.weight, 0) || 1;

  for (let i = 0; i < numPoints; i++) {
    let tempSum = 0, rainProbSum = 0, rainfallSum = 0, windSum = 0, humiditySum = 0;

    for (const mf of modelForecasts) {
      const w = (weights.find(w => w.modelId === mf.modelId)?.weight ?? 0) / totalWeight;
      const pt = mf.points[i];
      tempSum += pt.temperature * w;
      rainProbSum += pt.precipitationProbability * w;
      rainfallSum += pt.rainfall * w;
      windSum += pt.windSpeed * w;
      humiditySum += pt.humidity * w;
    }

    const temperature = Math.round(tempSum);
    const precipitationProbability = Math.round(rainProbSum);
    const rainfall = Math.round(rainfallSum * 10) / 10;
    const windSpeed = Math.round(windSum);
    const humidity = Math.round(humiditySum);
    const condition = getCondition(precipitationProbability, rainfall, temperature, windSpeed);
    const extremeRisk = getExtremeRisk(rainfall, temperature, windSpeed);

    const ref = modelForecasts[0].points[i];
    blended.push({
      date: ref.date,
      day: ref.day,
      time: ref.time,
      temperature,
      precipitationProbability,
      rainfall,
      windSpeed,
      condition,
      extremeRisk,
      humidity,
    });
  }

  return blended;
}

/**
 * Get the blending breakdown for a specific forecast point index.
 */
export function getBlendingBreakdown(
  modelForecasts: ModelForecast[],
  weights: ModelWeight[],
  pointIndex: number
): { modelId: ModelId; temp: number; rain: number; wind: number; weight: number }[] {
  return modelForecasts.map(mf => {
    const w = weights.find(w => w.modelId === mf.modelId)?.weight ?? 0;
    const pt = mf.points[pointIndex];
    return {
      modelId: mf.modelId,
      temp: pt.temperature,
      rain: pt.rainfall,
      wind: pt.windSpeed,
      weight: w,
    };
  });
}
