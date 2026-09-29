import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';
import { ForecastConfidence as ConfidenceType } from '../types';

interface ForecastConfidenceProps {
  confidence: ConfidenceType[];
}

function getConfidenceColor(level: string): string {
  switch (level) {
    case 'High': return '#16A34A';
    case 'Medium': return '#D97706';
    case 'Moderate': return '#94A3B8';
    case 'Low': return '#DC2626';
    default: return '#94A3B8';
  }
}

function getConfidenceBg(level: string): string {
  switch (level) {
    case 'High': return '#F0FDF4';
    case 'Medium': return '#FFFBEB';
    case 'Moderate': return '#F8FAFC';
    case 'Low': return '#FEF2F2';
    default: return '#F8FAFC';
  }
}

export default function ForecastConfidencePanel({ confidence }: ForecastConfidenceProps) {
  return (
    <div className="card" style={{ marginBottom: 20 }}>
      <div className="card-header">
        <ShieldCheck size={16} />
        Forecast Confidence
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
        {confidence.map(c => (
          <div key={c.band} style={{
            padding: '10px 12px',
            background: getConfidenceBg(c.level),
            borderRadius: 4,
            border: `1px solid ${getConfidenceColor(c.level)}20`,
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 6,
            }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: '#0F172A' }}>
                {c.days}
              </span>
              <span style={{
                fontSize: 12,
                fontWeight: 700,
                color: getConfidenceColor(c.level),
                textTransform: 'uppercase',
                letterSpacing: '0.03em',
              }}>
                {c.level} Confidence
              </span>
            </div>
            <div className="confidence-bar">
              <div
                className="confidence-fill"
                style={{
                  width: `${c.score}%`,
                  background: getConfidenceColor(c.level),
                }}
              />
            </div>
            <div style={{ fontSize: 11, color: '#64748B', marginTop: 4 }}>
              {c.explanation}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 6,
        fontSize: 12,
        color: '#64748B',
        lineHeight: 1.5,
      }}>
        <div className="tooltip-trigger" style={{ flexShrink: 0, marginTop: 1 }}>
          <Info size={13} color="#94A3B8" />
          <div className="tooltip-content">
            Confidence reflects model agreement, lead time, historical performance and weather uncertainty.
          </div>
        </div>
        Confidence changes with forecast lead time and model agreement.
      </div>
    </div>
  );
}
