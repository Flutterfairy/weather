import { WeatherAlert, ForecastPoint, ExtremeRiskType, AlertSeverity, AlertConfidence } from '../types';

/**
 * Extract weather alerts from forecast data.
 */
export function extractAlerts(
  forecastData: ForecastPoint[],
  location: string
): WeatherAlert[] {
  const alerts: WeatherAlert[] = [];
  let alertId = 0;

  // Find heavy rainfall events
  const heavyRainPoints = forecastData.filter(p => p.rainfall > 35);
  if (heavyRainPoints.length > 0) {
    const worst = heavyRainPoints.reduce((a, b) => a.rainfall > b.rainfall ? a : b);
    alerts.push({
      id: `alert-${++alertId}`,
      type: 'heavy_rainfall',
      label: 'Heavy Rainfall Risk',
      location,
      day: worst.day,
      date: worst.date,
      time: worst.time,
      value: `${worst.rainfall}`,
      unit: 'mm',
      confidence: worst.day <= 3 ? 'High' : worst.day <= 6 ? 'Medium' : 'Low',
      severity: worst.rainfall > 60 ? 'High' : worst.rainfall > 40 ? 'Moderate' : 'Low',
      description: `Heavy rainfall expected with ${worst.rainfall} mm accumulation. ${worst.day <= 3 ? 'Near-term models show strong agreement.' : 'Extended range uncertainty is higher.'}`,
    });
  }

  // Find heat events
  const heatPoints = forecastData.filter(p => p.temperature > 37);
  if (heatPoints.length > 0) {
    const worst = heatPoints.reduce((a, b) => a.temperature > b.temperature ? a : b);
    alerts.push({
      id: `alert-${++alertId}`,
      type: 'heat_wave',
      label: 'Heat Wave Risk',
      location,
      day: worst.day,
      date: worst.date,
      time: worst.time,
      value: `${worst.temperature}`,
      unit: '°C',
      confidence: worst.day <= 4 ? 'High' : 'Medium',
      severity: worst.temperature > 42 ? 'High' : worst.temperature > 39 ? 'Moderate' : 'Low',
      description: `Elevated temperatures expected, reaching ${worst.temperature}°C. ${worst.temperature > 40 ? 'Dangerously high temperatures.' : 'Above-normal temperatures.'}`,
    });
  }

  // Find high wind events
  const windPoints = forecastData.filter(p => p.windSpeed > 35);
  if (windPoints.length > 0) {
    const worst = windPoints.reduce((a, b) => a.windSpeed > b.windSpeed ? a : b);
    alerts.push({
      id: `alert-${++alertId}`,
      type: 'high_wind',
      label: 'High Wind Risk',
      location,
      day: worst.day,
      date: worst.date,
      time: worst.time,
      value: `${worst.windSpeed}`,
      unit: 'km/h',
      confidence: worst.day <= 5 ? 'Medium' : 'Low',
      severity: worst.windSpeed > 55 ? 'High' : worst.windSpeed > 40 ? 'Moderate' : 'Low',
      description: `Strong winds expected at ${worst.windSpeed} km/h. Exercise caution in exposed areas.`,
    });
  }

  return alerts;
}

/**
 * Get the number of active high-confidence alerts.
 */
export function getHighConfidenceAlertCount(alerts: WeatherAlert[]): number {
  return alerts.filter(a => a.confidence === 'High').length;
}
