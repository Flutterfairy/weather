import React, { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
import { Location, ModelWeight } from '../types';
import { LOCATIONS, MODELS } from '../data/constants';
import { calculateWeights } from '../services/weightEngine';

interface RegionalMapProps {
  selectedLocation: Location;
  selectedMonth: string;
  weatherRegime: string;
}

// SVG-based India/Maharashtra map visualization
export default function RegionalReliabilityMap({
  selectedLocation,
  selectedMonth,
  weatherRegime,
}: RegionalMapProps) {
  // Get weights for all monitored regional stations
  const locationWeights = LOCATIONS.map(loc => {
    const weights = calculateWeights(loc.id, selectedMonth, '1-3', weatherRegime);
    const best = weights.reduce((a, b) => a.weight > b.weight ? a : b);
    const model = MODELS.find(m => m.id === best.modelId);
    return {
      location: loc,
      weights,
      bestModel: model,
      bestWeight: best.weight,
    };
  });

  // Map position mapping (relative positions within SVG viewbox)
  const positions: Record<string, { x: number; y: number }> = {
    nashik: { x: 125, y: 80 },
    mumbai: { x: 85, y: 140 },
    pune: { x: 135, y: 165 },
    nagpur: { x: 280, y: 95 },
  };

  return (
    <div className="card" style={{ marginBottom: 20 }}>
      <div className="card-header">
        <MapPin size={16} />
        Regional Model Reliability
      </div>
      <p style={{ fontSize: 12, color: '#64748B', marginBottom: 14 }}>
        Model weights vary according to regional historical performance.
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 16,
      }}>
        {/* SVG Map */}
        <div style={{
          background: '#F8FAFC',
          borderRadius: 4,
          border: '1px solid #E2E8F0',
          padding: 12,
          minHeight: 240,
        }}>
          <svg viewBox="0 0 380 260" style={{ width: '100%', height: '100%' }}>
            {/* Maharashtra outline (simplified) */}
            <path
              d="M60 40 L140 25 L220 30 L310 50 L340 90 L320 140 L280 170 L220 200 L160 210 L100 200 L60 170 L40 130 L45 80 Z"
              fill="#EFF6FF"
              stroke="#BFDBFE"
              strokeWidth="1.5"
            />
            <text x="180" y="230" textAnchor="middle" fontSize="10" fill="#94A3B8" fontWeight="500">
              Maharashtra
            </text>

            {/* Location markers */}
            {locationWeights.map(lw => {
              const pos = positions[lw.location.id];
              if (!pos) return null;
              const isSelected = lw.location.id === selectedLocation.id;

              return (
                <g key={lw.location.id}>
                  {/* Selection ring */}
                  {isSelected && (
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={22}
                      fill="none"
                      stroke="#2563EB"
                      strokeWidth="2"
                      strokeDasharray="4 2"
                    />
                  )}

                  {/* Marker circle */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isSelected ? 16 : 12}
                    fill={isSelected ? '#2563EB' : '#FFFFFF'}
                    stroke={isSelected ? '#1D4ED8' : '#CBD5E1'}
                    strokeWidth="1.5"
                  />

                  {/* City name */}
                  <text
                    x={pos.x}
                    y={pos.y - (isSelected ? 24 : 18)}
                    textAnchor="middle"
                    fontSize={isSelected ? "11" : "10"}
                    fill={isSelected ? '#2563EB' : '#0F172A'}
                    fontWeight={isSelected ? "600" : "500"}
                  >
                    {lw.location.name}
                  </text>

                  {/* Best model indicator */}
                  <text
                    x={pos.x}
                    y={pos.y + 4}
                    textAnchor="middle"
                    fontSize="8"
                    fill={isSelected ? '#FFFFFF' : '#64748B'}
                    fontWeight="600"
                  >
                    {lw.bestWeight}%
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Weight comparison table */}
        <div>
          <div style={{
            fontSize: 12,
            fontWeight: 600,
            color: '#0F172A',
            marginBottom: 10,
          }}>
            Regional Weight Distribution
          </div>
          {locationWeights.map(lw => {
            const isSelected = lw.location.id === selectedLocation.id;
            return (
              <div key={lw.location.id} style={{
                padding: '8px 10px',
                borderRadius: 4,
                marginBottom: 6,
                border: `1px solid ${isSelected ? '#BFDBFE' : '#F1F5F9'}`,
                background: isSelected ? '#EFF6FF' : '#FFFFFF',
              }}>
                <div style={{
                  fontSize: 12,
                  fontWeight: isSelected ? 600 : 500,
                  color: isSelected ? '#2563EB' : '#0F172A',
                  marginBottom: 6,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}>
                  <MapPin size={11} />
                  {lw.location.name}
                  {isSelected && (
                    <span style={{
                      fontSize: 9,
                      padding: '1px 4px',
                      background: '#2563EB',
                      color: '#FFFFFF',
                      borderRadius: 2,
                      fontWeight: 500,
                    }}>
                      Selected
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {lw.weights.map(w => {
                    const model = MODELS.find(m => m.id === w.modelId);
                    return (
                      <div key={w.modelId} style={{
                        flex: 1,
                        textAlign: 'center',
                      }}>
                        <div style={{
                          height: 4,
                          borderRadius: 2,
                          background: '#F1F5F9',
                          overflow: 'hidden',
                          marginBottom: 2,
                        }}>
                          <div style={{
                            height: '100%',
                            width: `${w.weight}%`,
                            background: model?.color ?? '#CBD5E1',
                            borderRadius: 2,
                          }} />
                        </div>
                        <div style={{ fontSize: 9, color: model?.color ?? '#64748B', fontWeight: 600 }}>
                          {model?.shortName} {w.weight}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
