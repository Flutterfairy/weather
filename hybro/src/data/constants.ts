import { Location, Model } from '../types';

// ─── Locations ──────────────────────────────────────────────────────────────

export const LOCATIONS: Location[] = [
  { id: 'pune', name: 'Pune', state: 'Maharashtra', fullName: 'Pune, Maharashtra', lat: 18.5204, lng: 73.8567 },
  { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra', fullName: 'Mumbai, Maharashtra', lat: 19.076, lng: 72.8777 },
  { id: 'nagpur', name: 'Nagpur', state: 'Maharashtra', fullName: 'Nagpur, Maharashtra', lat: 21.1458, lng: 79.0882 },
  { id: 'nashik', name: 'Nashik', state: 'Maharashtra', fullName: 'Nashik, Maharashtra', lat: 19.9975, lng: 73.7898 },
  { id: 'bengaluru', name: 'Bengaluru', state: 'Karnataka', fullName: 'Bengaluru, Karnataka', lat: 12.9716, lng: 77.5946 },
  { id: 'delhi', name: 'Delhi', state: 'India', fullName: 'Delhi, India', lat: 28.7041, lng: 77.1025 },
];

// ─── Models ─────────────────────────────────────────────────────────────────

export const MODELS: Model[] = [
  {
    id: 'nwp_a',
    name: 'NWP Model A',
    shortName: 'NWP A',
    type: 'Numerical Weather Prediction',
    description: 'Physics-based atmospheric simulation model',
    color: '#2563EB',
  },
  {
    id: 'ai_b',
    name: 'AI Model B',
    shortName: 'AI B',
    type: 'AI / Deep Learning',
    description: 'Neural network trained on historical patterns',
    color: '#0F9D9A',
  },
  {
    id: 'ensemble_c',
    name: 'Ensemble Model C',
    shortName: 'Ensemble C',
    type: 'Statistical Ensemble',
    description: 'Multi-member statistical ensemble approach',
    color: '#7C3AED',
  },
];

// ─── Months ─────────────────────────────────────────────────────────────────

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// ─── Time Slots ─────────────────────────────────────────────────────────────

export const TIME_SLOTS = ['06:00 AM', '09:00 AM', '12:00 PM', '03:00 PM', '06:00 PM', '09:00 PM'];

// ─── Weather Regimes ────────────────────────────────────────────────────────

export const WEATHER_REGIMES: Record<string, Record<string, string>> = {
  pune: {
    January: 'Dry Winter Conditions',
    February: 'Dry Winter Conditions',
    March: 'Pre-Monsoon Heating',
    April: 'Pre-Monsoon Heating',
    May: 'Pre-Monsoon Thunderstorms',
    June: 'Monsoon Onset',
    July: 'Active Monsoon',
    August: 'Active Monsoon',
    September: 'Heavy Rainfall Conditions',
    October: 'Retreating Monsoon',
    November: 'Post-Monsoon Dry',
    December: 'Dry Winter Conditions',
  },
  mumbai: {
    January: 'Dry Winter Conditions',
    February: 'Dry Warm Conditions',
    March: 'Pre-Monsoon Heating',
    April: 'Pre-Monsoon Heating',
    May: 'Pre-Monsoon Thunderstorms',
    June: 'Heavy Monsoon Onset',
    July: 'Extreme Monsoon Rainfall',
    August: 'Active Monsoon',
    September: 'Monsoon Rainfall',
    October: 'Retreating Monsoon',
    November: 'Post-Monsoon Dry',
    December: 'Dry Winter Conditions',
  },
  nagpur: {
    January: 'Dry Cold Conditions',
    February: 'Dry Warming',
    March: 'Pre-Monsoon Heat',
    April: 'Extreme Heat',
    May: 'Extreme Heat',
    June: 'Monsoon Onset',
    July: 'Active Monsoon',
    August: 'Active Monsoon',
    September: 'Monsoon Rainfall',
    October: 'Retreating Monsoon',
    November: 'Post-Monsoon Dry',
    December: 'Dry Cold Conditions',
  },
  nashik: {
    January: 'Dry Winter Conditions',
    February: 'Dry Warming',
    March: 'Pre-Monsoon Warming',
    April: 'Pre-Monsoon Heating',
    May: 'Pre-Monsoon Thunderstorms',
    June: 'Monsoon Onset',
    July: 'Active Monsoon',
    August: 'Active Monsoon',
    September: 'Heavy Rainfall Conditions',
    October: 'Retreating Monsoon',
    November: 'Post-Monsoon Dry',
    December: 'Dry Winter Conditions',
  },
  bengaluru: {
    January: 'Dry Cool Conditions',
    February: 'Dry Warming',
    March: 'Pre-Monsoon Heating',
    April: 'Pre-Monsoon Thunderstorms',
    May: 'Pre-Monsoon Thunderstorms',
    June: 'Southwest Monsoon',
    July: 'Southwest Monsoon',
    August: 'Southwest Monsoon',
    September: 'Active Monsoon',
    October: 'Northeast Monsoon Onset',
    November: 'Northeast Monsoon',
    December: 'Dry Cool Conditions',
  },
  delhi: {
    January: 'Extreme Winter Cold',
    February: 'Winter Warming',
    March: 'Pre-Summer Warming',
    April: 'Summer Heat',
    May: 'Extreme Heat Wave',
    June: 'Pre-Monsoon Thunderstorms',
    July: 'Active Monsoon',
    August: 'Active Monsoon',
    September: 'Retreating Monsoon',
    October: 'Post-Monsoon Clear',
    November: 'Early Winter',
    December: 'Extreme Winter Cold',
  },
};

// ─── Regional base temperatures by month ────────────────────────────────────

export const BASE_TEMPERATURES: Record<string, Record<string, number>> = {
  pune: {
    January: 22, February: 24, March: 28, April: 32, May: 34,
    June: 29, July: 26, August: 25, September: 26, October: 28,
    November: 26, December: 23,
  },
  mumbai: {
    January: 26, February: 27, March: 29, April: 31, May: 32,
    June: 30, July: 28, August: 28, September: 29, October: 30,
    November: 29, December: 27,
  },
  nagpur: {
    January: 20, February: 23, March: 28, April: 34, May: 38,
    June: 34, July: 29, August: 28, September: 29, October: 28,
    November: 24, December: 21,
  },
  nashik: {
    January: 21, February: 23, March: 27, April: 31, May: 33,
    June: 28, July: 25, August: 24, September: 25, October: 27,
    November: 24, December: 22,
  },
  bengaluru: {
    January: 22, February: 24, March: 27, April: 29, May: 28,
    June: 25, July: 24, August: 24, September: 24, October: 24,
    November: 23, December: 22,
  },
  delhi: {
    January: 14, February: 17, March: 23, April: 30, May: 35,
    June: 36, July: 32, August: 31, September: 30, October: 28,
    November: 22, December: 16,
  },
};

// ─── Monthly rain probability base ─────────────────────────────────────────

export const BASE_RAIN_PROB: Record<string, Record<string, number>> = {
  pune: {
    January: 5, February: 5, March: 8, April: 10, May: 15,
    June: 45, July: 65, August: 60, September: 55, October: 30,
    November: 10, December: 5,
  },
  mumbai: {
    January: 3, February: 3, March: 5, April: 5, May: 10,
    June: 70, July: 85, August: 75, September: 60, October: 25,
    November: 8, December: 3,
  },
  nagpur: {
    January: 5, February: 5, March: 5, April: 8, May: 10,
    June: 40, July: 60, August: 55, September: 45, October: 15,
    November: 5, December: 5,
  },
  nashik: {
    January: 5, February: 5, March: 8, April: 10, May: 12,
    June: 45, July: 60, August: 55, September: 50, October: 25,
    November: 8, December: 5,
  },
  bengaluru: {
    January: 5, February: 5, March: 10, April: 20, May: 30,
    June: 35, July: 35, August: 40, September: 45, October: 45,
    November: 30, December: 10,
  },
  delhi: {
    January: 5, February: 8, March: 8, April: 5, May: 10,
    June: 25, July: 55, August: 50, September: 35, October: 10,
    November: 5, December: 5,
  },
};
