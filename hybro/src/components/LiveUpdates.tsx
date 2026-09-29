import React from 'react';
import { RefreshCw, ArrowRight, Database, Activity, Sliders, Blend, Calendar, Radio } from 'lucide-react';
import { ForecastUpdate } from '../types';

interface LiveUpdatesProps {
  updates: ForecastUpdate[];
  lastUpdated: string;
}

function getUpdateIcon(type: string) {
  switch (type) {
    case 'data': return <Database size={12} color="#2563EB" />;
    case 'weight': return <Sliders size={12} color="#0F9D9A" />;
    case 'forecast': return <Calendar size={12} color="#7C3AED" />;
    case 'alert': return <Radio size={12} color="#D97706" />;
    default: return <Activity size={12} color="#64748B" />;
  }
}

function getUpdateBadge(type: string) {
  const styles: Record<string, { bg: string; color: string; label: string }> = {
    data: { bg: '#EFF6FF', color: '#2563EB', label: 'Data' },
    weight: { bg: '#F0FDFA', color: '#0F9D9A', label: 'Weights' },
    forecast: { bg: '#F5F3FF', color: '#7C3AED', label: 'Forecast' },
    alert: { bg: '#FFFBEB', color: '#D97706', label: 'Alert' },
  };
  const s = styles[type] ?? styles.data;
  return (
    <span style={{
      fontSize: 10,
      fontWeight: 500,
      padding: '1px 6px',
      borderRadius: 3,
      background: s.bg,
      color: s.color,
    }}>
      {s.label}
    </span>
  );
}

export default function LiveUpdates({ updates, lastUpdated }: LiveUpdatesProps) {
  return (
    <div className="card" style={{ marginBottom: 20 }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 14,
      }}>
        <div className="card-header" style={{ marginBottom: 0 }}>
          <RefreshCw size={16} />
          Live Forecast Updates
        </div>
        <div style={{ fontSize: 11, color: '#64748B' }}>
          Last: {lastUpdated}
        </div>
      </div>

      {/* Update Pipeline */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 0,
        marginBottom: 16,
        overflowX: 'auto',
        paddingBottom: 4,
      }} className="forecast-scroll">
        {[
          { icon: <Database size={12} />, label: 'New Data' },
          { icon: <Activity size={12} />, label: 'Recalculate Performance' },
          { icon: <Sliders size={12} />, label: 'Update Weights' },
          { icon: <Blend size={12} />, label: 'Recalculate Forecast' },
          { icon: <Calendar size={12} />, label: 'Update Timeline' },
        ].map((step, i, arr) => (
          <React.Fragment key={i}>
            <div style={{
              flex: '0 0 auto',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '5px 10px',
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: 4,
              fontSize: 11,
              color: '#0F172A',
              fontWeight: 500,
              whiteSpace: 'nowrap',
            }}>
              <span style={{ color: '#2563EB' }}>{step.icon}</span>
              {step.label}
            </div>
            {i < arr.length - 1 && (
              <ArrowRight size={14} color="#CBD5E1" style={{ flexShrink: 0, margin: '0 2px' }} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Recent Updates */}
      <div style={{
        fontSize: 12,
        fontWeight: 600,
        color: '#64748B',
        marginBottom: 8,
      }}>
        Recent Forecast Updates
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {updates.map((update, i) => (
          <div key={update.id} style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
            padding: '8px 0',
            borderBottom: i < updates.length - 1 ? '1px solid #F1F5F9' : 'none',
          }}>
            <div style={{
              flexShrink: 0,
              width: 20,
              height: 20,
              borderRadius: '50%',
              background: '#F8FAFC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 1,
            }}>
              {getUpdateIcon(update.type)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                marginBottom: 2,
              }}>
                <span style={{ fontSize: 11, fontWeight: 500, color: '#64748B' }}>
                  {update.timestamp}
                </span>
                {getUpdateBadge(update.type)}
              </div>
              <div style={{ fontSize: 12, color: '#0F172A' }}>
                {update.message}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
