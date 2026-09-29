import { useState, useCallback, useEffect, useRef } from 'react';
import {
  AppState, Location, ModelId, ForecastUpdate, ModelWeight
} from '../types';
import { LOCATIONS, WEATHER_REGIMES } from '../data/constants';
import { calculateWeights, calculateLeadTimeWeights, getWeightExplanation } from '../services/weightEngine';
import { getModelPerformance } from '../services/weightEngine';
import { generateModelForecasts, blendForecasts } from '../services/forecastService';
import { extractAlerts } from '../services/alertService';
import { calculateConfidence, calculateModelAgreement } from '../services/confidenceService';

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function generateUpdateId(): string {
  return `update-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export function useForecastState() {
  const [state, setState] = useState<AppState>(() => buildInitialState());
  const updateCountRef = useRef(0);

  function buildInitialState(): AppState {
    const location = LOCATIONS[0]; // Pune
    const month = 'September';
    const weatherRegime = WEATHER_REGIMES[location.id]?.[month] ?? 'Clear';
    const weights = calculateWeights(location.id, month, '1-3', weatherRegime);
    const leadTimeWeights = calculateLeadTimeWeights(location.id, month, weatherRegime);
    const modelForecasts = generateModelForecasts(location.id, month, 10);
    const blended = blendForecasts(modelForecasts, weights);
    const performance = getModelPerformance(location.id, month);

    // Calculate model agreement
    const modelTemps = modelForecasts.map(mf => {
      const dayTemps: number[] = [];
      for (let d = 1; d <= 10; d++) {
        const dayPts = mf.points.filter(p => p.day === d);
        dayTemps.push(dayPts.reduce((s, p) => s + p.temperature, 0) / dayPts.length);
      }
      return dayTemps;
    });
    const agreement = calculateModelAgreement(modelTemps);
    const confidence = calculateConfidence(blended, agreement);
    const alerts = extractAlerts(blended, location.fullName);

    const now = new Date();

    return {
      selectedLocation: location,
      selectedMonth: month,
      forecastDuration: 10,
      forecastInterval: '3 Hours',
      selectedModel: 'blended',
      currentWeights: weights,
      leadTimeWeights,
      forecastData: blended,
      modelForecasts,
      modelPerformance: performance,
      weightContext: {
        region: location.id,
        month,
        leadTimeBand: '1-3',
        weatherRegime,
      },
      confidence,
      alerts,
      lastUpdated: formatTime(now),
      updateHistory: [
        {
          id: generateUpdateId(),
          timestamp: formatTime(now),
          message: 'Initial forecast generated for Pune, Maharashtra.',
          type: 'forecast',
        },
        {
          id: generateUpdateId(),
          timestamp: formatTime(new Date(now.getTime() - 17 * 60000)),
          message: 'AI Model B rainfall signal strengthened for western Maharashtra.',
          type: 'data',
        },
        {
          id: generateUpdateId(),
          timestamp: formatTime(new Date(now.getTime() - 40 * 60000)),
          message: 'Model weights recalculated based on latest observations.',
          type: 'weight',
        },
        {
          id: generateUpdateId(),
          timestamp: formatTime(new Date(now.getTime() - 55 * 60000)),
          message: 'New observational data integrated from IMD stations.',
          type: 'data',
        },
      ],
      isLoading: false,
      isLive: true,
    };
  }

  const recalculate = useCallback((location: Location, month: string) => {
    const weatherRegime = WEATHER_REGIMES[location.id]?.[month] ?? 'Clear';
    const weights = calculateWeights(location.id, month, '1-3', weatherRegime);
    const leadTimeWeights = calculateLeadTimeWeights(location.id, month, weatherRegime);
    const modelForecasts = generateModelForecasts(location.id, month, 10);
    const blended = blendForecasts(modelForecasts, weights);
    const performance = getModelPerformance(location.id, month);

    const modelTemps = modelForecasts.map(mf => {
      const dayTemps: number[] = [];
      for (let d = 1; d <= 10; d++) {
        const dayPts = mf.points.filter(p => p.day === d);
        dayTemps.push(dayPts.reduce((s, p) => s + p.temperature, 0) / dayPts.length);
      }
      return dayTemps;
    });
    const agreement = calculateModelAgreement(modelTemps);
    const confidence = calculateConfidence(blended, agreement);
    const alerts = extractAlerts(blended, location.fullName);

    return { weatherRegime, weights, leadTimeWeights, modelForecasts, blended, performance, confidence, alerts };
  }, []);

  const setLocation = useCallback((location: Location) => {
    setState(prev => {
      const result = recalculate(location, prev.selectedMonth);
      const now = formatTime(new Date());
      return {
        ...prev,
        selectedLocation: location,
        currentWeights: result.weights,
        leadTimeWeights: result.leadTimeWeights,
        forecastData: result.blended,
        modelForecasts: result.modelForecasts,
        modelPerformance: result.performance,
        weightContext: {
          region: location.id,
          month: prev.selectedMonth,
          leadTimeBand: '1-3',
          weatherRegime: result.weatherRegime,
        },
        confidence: result.confidence,
        alerts: result.alerts,
        lastUpdated: now,
        updateHistory: [
          {
            id: generateUpdateId(),
            timestamp: now,
            message: `Forecast regenerated for ${location.fullName}.`,
            type: 'forecast' as const,
          },
          ...prev.updateHistory.slice(0, 4),
        ],
      };
    });
  }, [recalculate]);

  const setMonth = useCallback((month: string) => {
    setState(prev => {
      const result = recalculate(prev.selectedLocation, month);
      const now = formatTime(new Date());
      return {
        ...prev,
        selectedMonth: month,
        currentWeights: result.weights,
        leadTimeWeights: result.leadTimeWeights,
        forecastData: result.blended,
        modelForecasts: result.modelForecasts,
        modelPerformance: result.performance,
        weightContext: {
          region: prev.selectedLocation.id,
          month,
          leadTimeBand: '1-3',
          weatherRegime: result.weatherRegime,
        },
        confidence: result.confidence,
        alerts: result.alerts,
        lastUpdated: now,
        updateHistory: [
          {
            id: generateUpdateId(),
            timestamp: now,
            message: `Performance and weights updated for ${month}.`,
            type: 'weight' as const,
          },
          ...prev.updateHistory.slice(0, 4),
        ],
      };
    });
  }, [recalculate]);

  const setSelectedModel = useCallback((modelId: ModelId | 'blended') => {
    setState(prev => ({ ...prev, selectedModel: modelId }));
  }, []);

  const generateForecast = useCallback(() => {
    setState(prev => ({ ...prev, isLoading: true }));

    // Simulate multi-step loading
    setTimeout(() => {
      setState(prev => {
        const result = recalculate(prev.selectedLocation, prev.selectedMonth);
        const now = formatTime(new Date());
        return {
          ...prev,
          isLoading: false,
          currentWeights: result.weights,
          leadTimeWeights: result.leadTimeWeights,
          forecastData: result.blended,
          modelForecasts: result.modelForecasts,
          modelPerformance: result.performance,
          weightContext: {
            region: prev.selectedLocation.id,
            month: prev.selectedMonth,
            leadTimeBand: '1-3',
            weatherRegime: result.weatherRegime,
          },
          confidence: result.confidence,
          alerts: result.alerts,
          lastUpdated: now,
          updateHistory: [
            {
              id: generateUpdateId(),
              timestamp: now,
              message: `Blended forecast generated successfully.`,
              type: 'forecast' as const,
            },
            ...prev.updateHistory.slice(0, 4),
          ],
        };
      });
    }, 2200);
  }, [recalculate]);

  const simulateUpdate = useCallback(() => {
    updateCountRef.current += 1;
    const count = updateCountRef.current;

    setState(prev => {
      // Small perturbations to weights
      const perturbedWeights: ModelWeight[] = prev.currentWeights.map((w, i) => {
        const perturbation = (count % 3 === 0 ? [-2, 3, -1] : count % 3 === 1 ? [1, -2, 1] : [-1, 1, 0])[i];
        return { ...w, weight: Math.max(10, w.weight + perturbation) };
      });
      // Normalize
      const total = perturbedWeights.reduce((s, w) => s + w.weight, 0);
      const normalizedWeights = perturbedWeights.map(w => ({
        ...w,
        weight: Math.round((w.weight / total) * 100),
      }));
      // Ensure sum is 100
      const diff = 100 - normalizedWeights.reduce((s, w) => s + w.weight, 0);
      normalizedWeights[0].weight += diff;

      const blended = blendForecasts(prev.modelForecasts, normalizedWeights);
      const alerts = extractAlerts(blended, prev.selectedLocation.fullName);

      const modelTemps = prev.modelForecasts.map(mf => {
        const dayTemps: number[] = [];
        for (let d = 1; d <= 10; d++) {
          const dayPts = mf.points.filter(p => p.day === d);
          dayTemps.push(dayPts.reduce((s, p) => s + p.temperature, 0) / dayPts.length);
        }
        return dayTemps;
      });
      const agreement = calculateModelAgreement(modelTemps);
      const confidence = calculateConfidence(blended, agreement);

      const now = formatTime(new Date());
      const updateMessages = [
        'Rainfall probability increased on Day 4.',
        'AI Model B detected stronger rainfall signals.',
        'NWP Model A temperature forecast adjusted.',
        'Wind speed estimates updated for Days 6–8.',
        'New observational data integrated.',
        'Model weights recalculated.',
        'Ensemble Model C skill score updated.',
      ];
      const msg = updateMessages[count % updateMessages.length];

      return {
        ...prev,
        currentWeights: normalizedWeights,
        forecastData: blended,
        confidence,
        alerts,
        lastUpdated: now,
        updateHistory: [
          {
            id: generateUpdateId(),
            timestamp: now,
            message: msg,
            type: (['data', 'weight', 'forecast', 'data'] as const)[count % 4],
          },
          {
            id: generateUpdateId(),
            timestamp: now,
            message: 'Blended forecast automatically updated.',
            type: 'forecast' as const,
          },
          ...prev.updateHistory.slice(0, 3),
        ],
      };
    });
  }, []);

  // Get currently displayed forecast (blended or individual model)
  const getDisplayedForecast = useCallback(() => {
    if (state.selectedModel === 'blended') {
      return state.forecastData;
    }
    const modelForecast = state.modelForecasts.find(mf => mf.modelId === state.selectedModel);
    return modelForecast?.points ?? state.forecastData;
  }, [state.selectedModel, state.forecastData, state.modelForecasts]);

  return {
    state,
    setLocation,
    setMonth,
    setSelectedModel,
    generateForecast,
    simulateUpdate,
    getDisplayedForecast,
  };
}
