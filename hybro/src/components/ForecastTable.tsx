import React, { useState } from 'react';
import {
  Cloud, CloudRain, CloudSun, Sun, CloudLightning,
  Wind, Thermometer, Droplets, AlertTriangle, Eye, Blend,
  ChevronDown, ChevronUp, Layers, Filter
} from 'lucide-react';
import { ForecastPoint, ModelId, ModelForecast, ModelWeight } from '../types';
import { MODELS } from '../data/constants';

interface ForecastTableProps {
  forecastData: ForecastPoint[];
  modelForecasts: ModelForecast[];
  weights: ModelWeight[];
  selectedModel: ModelId | 'blended';
  onSelectModel: (id: ModelId | 'blended') => void;
  locationName: string;
}

function getConditionIcon(condition: string, size: number = 14) {
  switch (condition) {
    case 'Clear': return <Sun size={size} color="#F59E0B" />;
    case 'Partly Cloudy': return <CloudSun size={size} color="#64748B" />;
    case 'Cloudy': return <Cloud size={size} color="#94A3B8" />;
    case 'Haze': return <Cloud size={size} color="#CBD5E1" />;
    case 'Light Rain': return <CloudRain size={size} color="#60A5FA" />;
    case 'Rain': return <CloudRain size={size} color="#3B82F6" />;
    case 'Heavy Rain': return <CloudRain size={size} color="#1D4ED8" />;
    case 'Thunderstorm': return <CloudLightning size={size} color="#7C3AED" />;
    case 'Hot': return <Sun size={size} color="#EF4444" />;
    case 'Windy': return <Wind size={size} color="#64748B" />;
    default: return <CloudSun size={size} color="#94A3B8" />;
  }
}

function getRainColor(prob: number): string {
  if (prob > 70) return '#1D4ED8';
  if (prob > 50) return '#3B82F6';
  if (prob > 30) return '#60A5FA';
  if (prob > 15) return '#93C5FD';
  return '#94A3B8';
}

function getConfidenceForDay(day: number): { label: string; color: string; bg: string } {
  if (day <= 3) return { label: 'High', color: '#16A34A', bg: '#F0FDF4' };
  if (day <= 6) return { label: 'Medium', color: '#D97706', bg: '#FFFBEB' };
  return { label: 'Moderate', color: '#64748B', bg: '#F8FAFC' };
}

export default function ForecastTable({
  forecastData,
  modelForecasts,
  weights,
  selectedModel,
  onSelectModel,
  locationName,
}: ForecastTableProps) {
  const [viewMode, setViewMode] = useState<'daily' | 'hourly'>('daily');
  const [leadRange, setLeadRange] = useState<'all' | '1-3' | '4-7' | '8-10'>('all');
  const [expandedDay, setExpandedDay] = useState<number | null>(1); // Day 1 expanded by default
  const [expandedRowIndex, setExpandedRowIndex] = useState<number | null>(null);

  // Active data source
  const displayData = selectedModel === 'blended'
    ? forecastData
    : (modelForecasts.find(mf => mf.modelId === selectedModel)?.points ?? forecastData);

  // All days
  const allDays = Array.from(new Set(displayData.map(p => p.day))).sort((a, b) => a - b);

  // Filtered days
  const filteredDays = allDays.filter(d => {
    if (leadRange === '1-3') return d >= 1 && d <= 3;
    if (leadRange === '4-7') return d >= 4 && d <= 7;
    if (leadRange === '8-10') return d >= 8 && d <= 10;
    return true;
  });

  return (
    <div className="card" style={{ marginBottom: 16, padding: '16px 18px', minWidth: 0 }}>
      {/* Top Header & Filter Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 14,
        paddingBottom: 12,
        borderBottom: '1px solid #E2E8F0',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A' }}>
              10-Day Multi-Model Forecast
            </h2>
            <span style={{
              fontSize: 11,
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: 4,
              background: '#EFF6FF',
              color: '#2563EB',
              border: '1px solid #BFDBFE',
            }}>
              {locationName}
            </span>
          </div>
          <p style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
            60-horizon blended sequence with individual model weights
          </p>
        </div>

        {/* View Mode & Model Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {/* Daily vs Hourly */}
          <div style={{
            display: 'flex',
            background: '#F1F5F9',
            padding: 2,
            borderRadius: 4,
          }}>
            <button
              onClick={() => setViewMode('daily')}
              style={{
                fontSize: 11,
                padding: '4px 9px',
                borderRadius: 3,
                border: 'none',
                background: viewMode === 'daily' ? '#FFFFFF' : 'transparent',
                color: viewMode === 'daily' ? '#0F172A' : '#64748B',
                fontWeight: viewMode === 'daily' ? 600 : 500,
                cursor: 'pointer',
                boxShadow: viewMode === 'daily' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              Daily Summary
            </button>
            <button
              onClick={() => setViewMode('hourly')}
              style={{
                fontSize: 11,
                padding: '4px 9px',
                borderRadius: 3,
                border: 'none',
                background: viewMode === 'hourly' ? '#FFFFFF' : 'transparent',
                color: viewMode === 'hourly' ? '#0F172A' : '#64748B',
                fontWeight: viewMode === 'hourly' ? 600 : 500,
                cursor: 'pointer',
                boxShadow: viewMode === 'hourly' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              3-Hour Steps
            </button>
          </div>

          {/* Model Filter Pills */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 3,
            background: '#F8FAFC',
            padding: 2,
            borderRadius: 4,
            border: '1px solid #E2E8F0',
          }}>
            <button
              onClick={() => onSelectModel('blended')}
              style={{
                padding: '3px 8px',
                borderRadius: 3,
                border: 'none',
                fontSize: 11,
                fontWeight: selectedModel === 'blended' ? 600 : 500,
                color: selectedModel === 'blended' ? '#FFFFFF' : '#64748B',
                background: selectedModel === 'blended' ? '#2563EB' : 'transparent',
                cursor: 'pointer',
              }}
            >
              Blended
            </button>
            {MODELS.map(m => (
              <button
                key={m.id}
                onClick={() => onSelectModel(m.id)}
                style={{
                  padding: '3px 8px',
                  borderRadius: 3,
                  border: 'none',
                  fontSize: 11,
                  fontWeight: selectedModel === m.id ? 600 : 500,
                  color: selectedModel === m.id ? '#FFFFFF' : '#64748B',
                  background: selectedModel === m.id ? m.color : 'transparent',
                  cursor: 'pointer',
                }}
              >
                {m.shortName}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lead Horizon Filter Chips */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#64748B' }}>Horizon:</span>
          {[
            { id: 'all', label: 'All 10 Days' },
            { id: '1-3', label: 'Days 1–3 (High Skill)' },
            { id: '4-7', label: 'Days 4–7 (Medium)' },
            { id: '8-10', label: 'Days 8–10 (Trend)' },
          ].map(h => (
            <button
              key={h.id}
              onClick={() => setLeadRange(h.id as any)}
              style={{
                fontSize: 11,
                padding: '3px 9px',
                borderRadius: 4,
                border: `1px solid ${leadRange === h.id ? '#2563EB' : '#E2E8F0'}`,
                background: leadRange === h.id ? '#EFF6FF' : '#FFFFFF',
                color: leadRange === h.id ? '#2563EB' : '#475569',
                fontWeight: leadRange === h.id ? 600 : 400,
                cursor: 'pointer',
              }}
            >
              {h.label}
            </button>
          ))}
        </div>

        {selectedModel !== 'blended' && (
          <div style={{
            fontSize: 11,
            color: '#2563EB',
            background: '#EFF6FF',
            padding: '2px 8px',
            borderRadius: 4,
            fontWeight: 500,
          }}>
            Showing unblended {MODELS.find(m => m.id === selectedModel)?.name}
          </div>
        )}
      </div>

      {/* DAILY COMPACT VIEW */}
      {viewMode === 'daily' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {filteredDays.map(day => {
            const dayPoints = displayData.filter(p => p.day === day);
            const temps = dayPoints.map(p => p.temperature);
            const maxTemp = Math.round(Math.max(...temps));
            const minTemp = Math.round(Math.min(...temps));
            const maxRainProb = Math.max(...dayPoints.map(p => p.precipitationProbability));
            const totalRain = dayPoints.reduce((acc, p) => acc + p.rainfall, 0).toFixed(1);
            const maxWind = Math.round(Math.max(...dayPoints.map(p => p.windSpeed)));
            const primaryCondition = dayPoints[Math.floor(dayPoints.length / 2)]?.condition ?? 'Clear';
            const conf = getConfidenceForDay(day);
            const isExpanded = expandedDay === day;

            return (
              <div
                key={day}
                style={{
                  border: `1px solid ${isExpanded ? '#BFDBFE' : '#E2E8F0'}`,
                  borderRadius: 6,
                  background: isExpanded ? '#F8FAFC' : '#FFFFFF',
                  overflow: 'hidden',
                  transition: 'all 0.15s ease',
                }}
              >
                {/* Daily Summary Bar (Clickable) */}
                <div
                  onClick={() => setExpandedDay(isExpanded ? null : day)}
                  style={{
                    padding: '9px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    gap: 12,
                    userSelect: 'none',
                  }}
                >
                  {/* Left: Day & Condition */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 150 }}>
                    <div style={{ width: 60 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>
                        Day {day}
                      </div>
                      <div style={{ fontSize: 10, color: '#64748B' }}>
                        {day === 1 ? 'Today' : day === 2 ? 'Tomorrow' : `+${day} days`}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {getConditionIcon(primaryCondition, 18)}
                      <span style={{ fontSize: 12, fontWeight: 500, color: '#334155' }}>
                        {primaryCondition}
                      </span>
                    </div>
                  </div>

                  {/* Center: Weather Metrics */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 20,
                    flexWrap: 'wrap',
                  }}>
                    {/* Temperature */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, minWidth: 70 }}>
                      <Thermometer size={13} color="#EF4444" />
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>
                        {maxTemp}°
                      </span>
                      <span style={{ fontSize: 12, color: '#94A3B8' }}>
                        / {minTemp}°C
                      </span>
                    </div>

                    {/* Rain */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 80 }}>
                      <CloudRain size={13} color={getRainColor(maxRainProb)} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: getRainColor(maxRainProb) }}>
                        {maxRainProb}%
                      </span>
                      <span style={{ fontSize: 11, color: '#64748B' }}>
                        ({totalRain} mm)
                      </span>
                    </div>

                    {/* Wind */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, minWidth: 70 }} className="hidden sm:flex">
                      <Wind size={13} color="#64748B" />
                      <span style={{ fontSize: 12, color: '#475569' }}>
                        {maxWind} km/h
                      </span>
                    </div>

                    {/* Confidence Badge */}
                    <span style={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: conf.color,
                      background: conf.bg,
                      padding: '2px 7px',
                      borderRadius: 4,
                      border: `1px solid ${conf.color}30`,
                    }}>
                      {conf.label} Skill
                    </span>
                  </div>

                  {/* Right: Expand Toggle */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#64748B' }}>
                    <span style={{ fontSize: 11, color: '#94A3B8' }} className="hidden md:inline">
                      {isExpanded ? 'Hide intervals' : '6 intervals'}
                    </span>
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>

                {/* Expanded 3-Hour Interval Table */}
                {isExpanded && (
                  <div style={{
                    borderTop: '1px solid #E2E8F0',
                    background: '#FFFFFF',
                    padding: '8px 12px',
                    overflowX: 'auto',
                  }} className="forecast-scroll">
                    <table style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      fontSize: 12,
                      minWidth: 550,
                    }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>
                          <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 600 }}>Time</th>
                          <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 600 }}>Condition</th>
                          <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 600 }}>Temp</th>
                          <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 600 }}>Rain %</th>
                          <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 600 }}>Rainfall</th>
                          <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 600 }}>Wind</th>
                          <th style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 600 }}>Models</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dayPoints.map((point, idx) => {
                          const pointIndex = displayData.indexOf(point);
                          const isRowExpanded = expandedRowIndex === pointIndex;
                          return (
                            <React.Fragment key={idx}>
                              <tr style={{
                                borderBottom: '1px solid #F1F5F9',
                                background: idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC',
                              }}>
                                <td style={{ padding: '6px 8px', fontWeight: 600, color: '#0F172A' }}>
                                  {point.time}
                                </td>
                                <td style={{ padding: '6px 8px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                    {getConditionIcon(point.condition, 14)}
                                    <span>{point.condition}</span>
                                  </div>
                                </td>
                                <td style={{ padding: '6px 8px', fontWeight: 600 }}>
                                  {Math.round(point.temperature)}°C
                                </td>
                                <td style={{ padding: '6px 8px', color: getRainColor(point.precipitationProbability), fontWeight: 600 }}>
                                  {point.precipitationProbability}%
                                </td>
                                <td style={{ padding: '6px 8px', color: '#475569' }}>
                                  {point.rainfall > 0 ? `${point.rainfall} mm` : '—'}
                                </td>
                                <td style={{ padding: '6px 8px', color: '#64748B' }}>
                                  {point.windSpeed} km/h
                                </td>
                                <td style={{ padding: '6px 8px', textAlign: 'right' }}>
                                  <button
                                    onClick={() => setExpandedRowIndex(isRowExpanded ? null : pointIndex)}
                                    style={{
                                      fontSize: 10,
                                      padding: '2px 6px',
                                      borderRadius: 3,
                                      border: '1px solid #CBD5E1',
                                      background: isRowExpanded ? '#EFF6FF' : '#FFFFFF',
                                      color: isRowExpanded ? '#2563EB' : '#475569',
                                      cursor: 'pointer',
                                    }}
                                  >
                                    {isRowExpanded ? 'Close' : 'Compare'}
                                  </button>
                                </td>
                              </tr>

                              {/* Multi-Model Breakdown Drawer */}
                              {isRowExpanded && (
                                <tr>
                                  <td colSpan={7} style={{ padding: '8px 10px', background: '#F8FAFC' }}>
                                    <div style={{
                                      display: 'grid',
                                      gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                                      gap: 8,
                                      fontSize: 11,
                                    }}>
                                      {MODELS.map(m => {
                                        const mp = modelForecasts.find(mf => mf.modelId === m.id)?.points[pointIndex];
                                        const w = weights.find(mw => mw.modelId === m.id)?.weight ?? 0;
                                        return (
                                          <div key={m.id} style={{
                                            padding: 8,
                                            borderRadius: 4,
                                            border: `1px solid ${m.color}30`,
                                            background: '#FFFFFF',
                                          }}>
                                            <div style={{ fontWeight: 600, color: m.color, marginBottom: 4 }}>
                                              {m.name} ({w}%)
                                            </div>
                                            <div>Temp: {mp?.temperature ? `${Math.round(mp.temperature)}°C` : '—'}</div>
                                            <div>Rain: {mp?.precipitationProbability}% ({mp?.rainfall ?? 0} mm)</div>
                                            <div>Wind: {mp?.windSpeed ?? 0} km/h</div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* HOURLY TABLE VIEW (When user wants the full continuous list) */}
      {viewMode === 'hourly' && (
        <div style={{ overflowX: 'auto', maxHeight: '500px' }} className="forecast-scroll">
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: 12,
            minWidth: 600,
          }}>
            <thead style={{ position: 'sticky', top: 0, background: '#F8FAFC', zIndex: 10 }}>
              <tr style={{ borderBottom: '2px solid #E2E8F0', color: '#64748B' }}>
                <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600 }}>Day</th>
                <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600 }}>Time</th>
                <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600 }}>Condition</th>
                <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600 }}>Temp</th>
                <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600 }}>Rain %</th>
                <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600 }}>Rainfall</th>
                <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600 }}>Wind</th>
                <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600 }}>Confidence</th>
              </tr>
            </thead>
            <tbody>
              {filteredDays.flatMap(day => displayData.filter(p => p.day === day)).map((point, idx) => {
                const conf = getConfidenceForDay(point.day);
                return (
                  <tr key={idx} style={{
                    borderBottom: '1px solid #F1F5F9',
                    background: idx % 2 === 0 ? '#FFFFFF' : '#FAFBFC',
                  }}>
                    <td style={{ padding: '6px 10px', fontWeight: 600, color: '#0F172A' }}>Day {point.day}</td>
                    <td style={{ padding: '6px 10px', color: '#475569' }}>{point.time}</td>
                    <td style={{ padding: '6px 10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {getConditionIcon(point.condition, 14)}
                        <span>{point.condition}</span>
                      </div>
                    </td>
                    <td style={{ padding: '6px 10px', fontWeight: 600 }}>{Math.round(point.temperature)}°C</td>
                    <td style={{ padding: '6px 10px', color: getRainColor(point.precipitationProbability), fontWeight: 600 }}>
                      {point.precipitationProbability}%
                    </td>
                    <td style={{ padding: '6px 10px', color: '#475569' }}>
                      {point.rainfall > 0 ? `${point.rainfall} mm` : '—'}
                    </td>
                    <td style={{ padding: '6px 10px', color: '#64748B' }}>{point.windSpeed} km/h</td>
                    <td style={{ padding: '6px 10px' }}>
                      <span style={{
                        fontSize: 10,
                        fontWeight: 600,
                        color: conf.color,
                        background: conf.bg,
                        padding: '1px 6px',
                        borderRadius: 3,
                      }}>
                        {conf.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
