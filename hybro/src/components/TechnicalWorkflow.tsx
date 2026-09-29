import React from 'react';
import {
  Workflow, MapPin, Database, Cloud, Activity,
  Sliders, Blend, Calendar, RefreshCw, ArrowDown
} from 'lucide-react';

const STEPS = [
  {
    icon: <MapPin size={16} />,
    label: 'User Selects Region',
    description: 'Geographic location and month selection',
    color: '#2563EB',
  },
  {
    icon: <Database size={16} />,
    label: 'Historical + Real-Time Weather Data',
    description: 'Observational and model initialization data',
    color: '#64748B',
  },
  {
    icon: <Cloud size={16} />,
    label: 'NWP + AI + Ensemble Forecasts',
    description: 'Three independent model predictions generated',
    color: '#0F9D9A',
  },
  {
    icon: <Activity size={16} />,
    label: 'Model Performance Analysis',
    description: 'Historical and recent skill evaluated per context',
    color: '#7C3AED',
  },
  {
    icon: <Sliders size={16} />,
    label: 'Dynamic Weight Engine',
    description: 'Weights calculated from region, month, lead time, regime',
    color: '#2563EB',
  },
  {
    icon: <Blend size={16} />,
    label: 'Weighted Forecast Blending',
    description: 'Models combined using context-aware weights',
    color: '#0F9D9A',
  },
  {
    icon: <Calendar size={16} />,
    label: '10-Day Forecast Timeline',
    description: '60 forecast points across 10 days generated',
    color: '#7C3AED',
  },
  {
    icon: <RefreshCw size={16} />,
    label: 'Continuous Monitoring & Updates',
    description: 'New data triggers automatic recalculation',
    color: '#16A34A',
  },
];

export default function TechnicalWorkflow() {
  return (
    <div className="card" style={{ marginBottom: 20 }}>
      <div className="card-header">
        <Workflow size={16} />
        End-to-End Forecasting Workflow
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0,
      }}>
        {STEPS.map((step, i) => (
          <React.Fragment key={i}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              width: '100%',
              maxWidth: 500,
              padding: '10px 16px',
              background: i === STEPS.length - 1 ? '#F0FDF4' : '#F8FAFC',
              border: `1px solid ${i === STEPS.length - 1 ? '#BBF7D0' : '#E2E8F0'}`,
              borderRadius: 5,
            }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: 6,
                background: `${step.color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: step.color,
                flexShrink: 0,
              }}>
                {step.icon}
              </div>
              <div>
                <div style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#0F172A',
                }}>
                  {step.label}
                </div>
                <div style={{
                  fontSize: 11,
                  color: '#64748B',
                }}>
                  {step.description}
                </div>
              </div>
              <div style={{
                marginLeft: 'auto',
                fontSize: 10,
                fontWeight: 600,
                color: '#94A3B8',
                background: '#F1F5F9',
                padding: '2px 6px',
                borderRadius: 3,
                flexShrink: 0,
              }}>
                {i + 1}/{STEPS.length}
              </div>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                padding: '2px 0',
                color: '#CBD5E1',
              }}>
                <ArrowDown size={16} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
