// ─── Core Model Types ───────────────────────────────────────────────────────

export type ModelId = 'nwp_a' | 'ai_b' | 'ensemble_c';

export interface Model {
  id: ModelId;
  name: string;
  shortName: string;
  type: string;
  description: string;
  color: string;
}

// ─── Forecast Types ─────────────────────────────────────────────────────────

export interface ForecastPoint {
  date: string;
  day: number;
  time: string;
  temperature: number;
  precipitationProbability: number;
  rainfall: number;
  windSpeed: number;
  condition: WeatherCondition;
  extremeRisk?: ExtremeRiskType;
  humidity: number;
}

export type WeatherCondition =
  | 'Clear'
  | 'Partly Cloudy'
  | 'Cloudy'
  | 'Light Rain'
  | 'Rain'
  | 'Heavy Rain'
  | 'Thunderstorm'
  | 'Haze'
  | 'Hot'
  | 'Windy';

export type ExtremeRiskType = 'heavy_rainfall' | 'heat_wave' | 'high_wind' | 'thunderstorm';

export interface ModelForecast {
  modelId: ModelId;
  points: ForecastPoint[];
}

// ─── Performance Types ──────────────────────────────────────────────────────

export interface ModelPerformance {
  modelId: ModelId;
  month: string;
  region: string;
  rainfallAccuracy: number;
  temperatureAccuracy: number;
  windAccuracy: number;
  extremeEventDetection: number;
  overallSkill: number;
}

// ─── Weight Types ───────────────────────────────────────────────────────────

export interface ModelWeight {
  modelId: ModelId;
  weight: number;
}

export interface WeightContext {
  region: string;
  month: string;
  leadTimeBand: string;
  weatherRegime: string;
}

export interface WeightFactorScores {
  historical: number;
  monthly: number;
  regional: number;
  leadTime: number;
  weatherRegime: number;
  recent: number;
}

export interface LeadTimeWeights {
  band: string;
  days: string;
  weights: ModelWeight[];
}

// ─── Alert Types ────────────────────────────────────────────────────────────

export type AlertSeverity = 'Low' | 'Moderate' | 'High';
export type AlertConfidence = 'Low' | 'Medium' | 'High';

export interface WeatherAlert {
  id: string;
  type: ExtremeRiskType;
  label: string;
  location: string;
  day: number;
  date: string;
  time: string;
  value: string;
  unit: string;
  confidence: AlertConfidence;
  severity: AlertSeverity;
  description: string;
}

// ─── Location Types ─────────────────────────────────────────────────────────

export interface Location {
  id: string;
  name: string;
  state: string;
  fullName: string;
  lat: number;
  lng: number;
}

// ─── Confidence Types ───────────────────────────────────────────────────────

export type ConfidenceLevel = 'High' | 'Medium' | 'Moderate' | 'Low';

export interface ForecastConfidence {
  band: string;
  days: string;
  level: ConfidenceLevel;
  score: number;
  explanation: string;
}

// ─── Update Types ───────────────────────────────────────────────────────────

export interface ForecastUpdate {
  id: string;
  timestamp: string;
  message: string;
  type: 'data' | 'weight' | 'forecast' | 'alert';
}

// ─── Application State ─────────────────────────────────────────────────────

export interface AppState {
  selectedLocation: Location;
  selectedMonth: string;
  forecastDuration: number;
  forecastInterval: string;
  selectedModel: ModelId | 'blended';
  currentWeights: ModelWeight[];
  leadTimeWeights: LeadTimeWeights[];
  forecastData: ForecastPoint[];
  modelForecasts: ModelForecast[];
  modelPerformance: ModelPerformance[];
  weightContext: WeightContext;
  confidence: ForecastConfidence[];
  alerts: WeatherAlert[];
  lastUpdated: string;
  updateHistory: ForecastUpdate[];
  isLoading: boolean;
  isLive: boolean;
}
