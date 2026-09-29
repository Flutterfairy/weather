import React from 'react';
import { MapPin, Calendar, Clock, Play, Info, RefreshCw, Zap, Sparkles } from 'lucide-react';
import { Location } from '../types';
import { LOCATIONS, MONTHS } from '../data/constants';

interface ForecastControlsProps {
  selectedLocation: Location;
  selectedMonth: string;
  forecastDuration: number;
  forecastInterval: string;
  isLoading: boolean;
  onLocationChange: (loc: Location) => void;
  onMonthChange: (month: string) => void;
  onGenerate: () => void;
  onSimulateUpdate: () => void;
}

export default function ForecastControls({
  selectedLocation,
  selectedMonth,
  forecastDuration,
  forecastInterval,
  isLoading,
  onLocationChange,
  onMonthChange,
  onGenerate,
  onSimulateUpdate,
}: ForecastControlsProps) {
  const scenarios = [
    {
      label: '⛈️ Monsoon Storm',
      locId: 'mumbai',
      month: 'July',
      desc: 'High rain regime — tests NWP precipitation skill',
    },
    {
      label: '☀️ Summer Heatwave',
      locId: 'nagpur',
      month: 'May',
      desc: 'Extreme temperature regime — tests AI heatwave prediction',
    },
    {
      label: '❄️ Winter Regime',
      locId: 'pune',
      month: 'January',
      desc: 'Stable atmospheric conditions — tests ensemble baseline',
    },
    {
      label: '🌾 Post-Monsoon',
      locId: 'nashik',
      month: 'October',
      desc: 'Transition season with localized convective activity',
    },
  ];

  return (
    <div className="card" style={{ marginBottom: 16, padding: '14px 18px' }}>
      {/* Upper row: Selectors + Action Buttons */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
        gap: 12,
        alignItems: 'end',
      }}>
        {/* Location */}
        <div>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 11,
            fontWeight: 600,
            color: '#475569',
            marginBottom: 4,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}>
            <MapPin size={12} color="#2563EB" /> Target Region
          </label>
          <select
            value={selectedLocation.id}
            onChange={(e) => {
              const loc = LOCATIONS.find(l => l.id === e.target.value);
              if (loc) onLocationChange(loc);
            }}
            style={{
              width: '100%',
              padding: '7px 9px',
              fontSize: 13,
              fontWeight: 500,
              border: '1px solid #CBD5E1',
              borderRadius: 5,
              background: '#FFFFFF',
              color: '#0F172A',
              cursor: 'pointer',
              outline: 'none',
            }}
            aria-label="Select location"
          >
            {LOCATIONS.map(loc => (
              <option key={loc.id} value={loc.id}>{loc.fullName}</option>
            ))}
          </select>
        </div>

        {/* Month */}
        <div>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 11,
            fontWeight: 600,
            color: '#475569',
            marginBottom: 4,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}>
            <Calendar size={12} color="#0F9D9A" /> Season / Month
          </label>
          <select
            value={selectedMonth}
            onChange={(e) => onMonthChange(e.target.value)}
            style={{
              width: '100%',
              padding: '7px 9px',
              fontSize: 13,
              fontWeight: 500,
              border: '1px solid #CBD5E1',
              borderRadius: 5,
              background: '#FFFFFF',
              color: '#0F172A',
              cursor: 'pointer',
              outline: 'none',
            }}
            aria-label="Select month"
          >
            {MONTHS.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        {/* Duration */}
        <div>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 11,
            fontWeight: 600,
            color: '#475569',
            marginBottom: 4,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}>
            <Calendar size={12} color="#7C3AED" /> Lead Horizon
          </label>
          <select
            value={forecastDuration}
            disabled
            style={{
              width: '100%',
              padding: '7px 9px',
              fontSize: 13,
              fontWeight: 500,
              border: '1px solid #E2E8F0',
              borderRadius: 5,
              background: '#F8FAFC',
              color: '#334155',
              cursor: 'not-allowed',
            }}
            aria-label="Forecast duration"
          >
            <option value={10}>10 Days (Continuous)</option>
          </select>
        </div>

        {/* Interval */}
        <div>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 11,
            fontWeight: 600,
            color: '#475569',
            marginBottom: 4,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}>
            <Clock size={12} color="#D97706" /> Temporal Step
          </label>
          <select
            value={forecastInterval}
            disabled
            style={{
              width: '100%',
              padding: '7px 9px',
              fontSize: 13,
              fontWeight: 500,
              border: '1px solid #E2E8F0',
              borderRadius: 5,
              background: '#F8FAFC',
              color: '#334155',
              cursor: 'not-allowed',
            }}
            aria-label="Forecast interval"
          >
            <option value="3 Hours">3 Hours (60 steps)</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: 8,
          gridColumn: 'span 1',
        }}>
          <button
            onClick={onGenerate}
            disabled={isLoading}
            style={{
              flex: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              padding: '8px 14px',
              fontSize: 12,
              fontWeight: 600,
              color: '#FFFFFF',
              background: isLoading ? '#93C5FD' : '#2563EB',
              border: 'none',
              borderRadius: 5,
              cursor: isLoading ? 'wait' : 'pointer',
              transition: 'all 0.15s',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 5px rgba(37, 99, 235, 0.25)',
            }}
            aria-label="Generate blended forecast"
          >
            <Play size={13} fill="currentColor" />
            {isLoading ? 'Synthesizing...' : 'Blend Forecast'}
          </button>
          <button
            onClick={onSimulateUpdate}
            disabled={isLoading}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              padding: '8px 10px',
              fontSize: 11,
              fontWeight: 600,
              color: '#0F9D9A',
              background: '#F0FDFA',
              border: '1px solid #99F6E4',
              borderRadius: 5,
              cursor: 'pointer',
              transition: 'all 0.15s',
              whiteSpace: 'nowrap',
            }}
            title="Simulate incoming satellite & radar observations"
            aria-label="Simulate forecast update"
          >
            <RefreshCw size={11} />
            Simulate
          </button>
        </div>
      </div>

      {/* Interactive Scenario Presets */}
      <div style={{
        marginTop: 12,
        paddingTop: 10,
        borderTop: '1px solid #F1F5F9',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          fontSize: 11,
          fontWeight: 600,
          color: '#64748B',
          marginRight: 4,
        }}>
          <Zap size={12} color="#D97706" /> Quick Scenarios:
        </div>
        {scenarios.map((sc, i) => (
          <button
            key={i}
            onClick={() => {
              const loc = LOCATIONS.find(l => l.id === sc.locId);
              if (loc) onLocationChange(loc);
              onMonthChange(sc.month);
              setTimeout(() => onGenerate(), 50);
            }}
            style={{
              fontSize: 11,
              fontWeight: 500,
              padding: '3px 8px',
              borderRadius: 4,
              border: '1px solid #E2E8F0',
              background: '#FFFFFF',
              color: '#334155',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            title={sc.desc}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = '#EFF6FF';
              (e.currentTarget as HTMLElement).style.borderColor = '#BFDBFE';
              (e.currentTarget as HTMLElement).style.color = '#2563EB';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = '#FFFFFF';
              (e.currentTarget as HTMLElement).style.borderColor = '#E2E8F0';
              (e.currentTarget as HTMLElement).style.color = '#334155';
            }}
          >
            {sc.label}
          </button>
        ))}
      </div>
    </div>
  );
}
