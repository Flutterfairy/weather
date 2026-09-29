import React from 'react';
import { Layers, Info, MapPin, Calendar, Clock, CloudRain } from 'lucide-react';
import { ModelWeight, WeightContext } from '../types';
import { MODELS } from '../data/constants';
import { getWeightExplanation } from '../services/weightEngine';

interface ModelWeightPanelProps {
  weights: ModelWeight[];
  context: WeightContext;
}

export default function ModelWeightPanel({ weights, context }: ModelWeightPanelProps) {
  const explanation = getWeightExplanation(context.region, context.month, context.weatherRegime);

  return (
    <div className="card" style={{ marginBottom: 20 }}>
      <div className="card-header">
        <Layers size={16} />
        Current Model Weights
      </div>

      {/* Weight Bars */}
      <div style={{ marginBottom: 16 }}>
        {weights.map(w => {
          const model = MODELS.find(m => m.id === w.modelId);
          if (!model) return null;
          return (
            <div key={w.modelId} style={{ marginBottom: 12 }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 4,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{
                    width: 8,
                    height: 8,
                    borderRadius: 2,
                    background: model.color,
                  }} />
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#0F172A' }}>
                    {model.name}
                  </span>
                </div>
                <span style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: model.color,
                }}>
                  {w.weight}%
                </span>
              </div>
              <div style={{
                height: 8,
                borderRadius: 4,
                background: '#F1F5F9',
                overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  width: `${w.weight}%`,
                  borderRadius: 4,
                  background: model.color,
                  transition: 'width 0.5s ease',
                }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Context */}
      <div style={{
        background: '#F8FAFC',
        borderRadius: 4,
        padding: 12,
        marginBottom: 12,
      }}>
        <div style={{
          fontSize: 11,
          fontWeight: 600,
          color: '#64748B',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: 8,
        }}>
          Weighting Context
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 8,
        }}>
          {[
            { icon: <Calendar size={11} />, label: 'Current Month', value: context.month },
            { icon: <MapPin size={11} />, label: 'Region', value: context.region.charAt(0).toUpperCase() + context.region.slice(1) },
            { icon: <Clock size={11} />, label: 'Lead Time', value: 'Days 1–3' },
            { icon: <CloudRain size={11} />, label: 'Weather Regime', value: context.weatherRegime },
          ].map((item, i) => (
            <div key={i}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 10,
                color: '#94A3B8',
                marginBottom: 2,
              }}>
                {item.icon}
                {item.label}
              </div>
              <div style={{
                fontSize: 12,
                fontWeight: 500,
                color: '#0F172A',
              }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Explanation */}
      <div style={{
        padding: '10px 12px',
        background: '#EFF6FF',
        borderRadius: 4,
        border: '1px solid #BFDBFE',
        fontSize: 12,
        color: '#1E40AF',
        lineHeight: 1.5,
      }}>
        <Info size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
        {explanation}
      </div>
    </div>
  );
}
