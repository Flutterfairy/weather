import React from 'react';
import { History, TrendingUp, MapPin, Calendar, Clock, CloudRain } from 'lucide-react';

const FACTORS = [
  {
    icon: <History size={14} />,
    label: 'Historical Performance',
    description: 'Long-term skill for this region',
  },
  {
    icon: <Calendar size={14} />,
    label: 'Current Month',
    description: 'Month-specific historical behavior',
  },
  {
    icon: <MapPin size={14} />,
    label: 'Region',
    description: 'Local geographical performance',
  },
  {
    icon: <Clock size={14} />,
    label: 'Lead Time',
    description: 'Performance changes with forecast horizon',
  },
  {
    icon: <CloudRain size={14} />,
    label: 'Weather Regime',
    description: 'Rain, heat, storms, etc.',
  },
  {
    icon: <TrendingUp size={14} />,
    label: 'Recent Performance',
    description: 'Latest forecast accuracy',
  },
];

export default function WeightFactors() {
  return (
    <div className="card" style={{ marginBottom: 20 }}>
      <div className="card-header">
        <TrendingUp size={16} />
        Weighting Factors
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: 8,
      }}>
        {FACTORS.map((f, i) => (
          <div key={i} style={{
            padding: '10px 12px',
            background: '#F8FAFC',
            borderRadius: 4,
            border: '1px solid #F1F5F9',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: '#2563EB',
              marginBottom: 4,
            }}>
              {f.icon}
              <span style={{ fontSize: 12, fontWeight: 600, color: '#0F172A' }}>
                {f.label}
              </span>
            </div>
            <div style={{ fontSize: 11, color: '#64748B' }}>
              {f.description}
            </div>
          </div>
        ))}
      </div>

      {/* Formula */}
      <div style={{
        marginTop: 14,
        padding: '10px 14px',
        background: '#F8FAFC',
        borderRadius: 4,
        border: '1px solid #E2E8F0',
      }}>
        <div style={{
          fontSize: 11,
          fontWeight: 600,
          color: '#64748B',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: 6,
        }}>
          Dynamic Weight Calculation
        </div>
        <div style={{
          fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
          fontSize: 11,
          color: '#0F172A',
          lineHeight: 1.6,
        }}>
          <div>score(model) = historical × monthly × regional × leadTime × regime × recent</div>
          <div style={{ color: '#64748B', marginTop: 2 }}>
            weight(model) = score(model) / Σ(all scores) → normalized to 100%
          </div>
        </div>
        <div style={{
          fontSize: 10,
          color: '#94A3B8',
          marginTop: 6,
          fontStyle: 'italic',
        }}>
          Demonstration model logic — weights adapt dynamically to context.
        </div>
      </div>
    </div>
  );
}
