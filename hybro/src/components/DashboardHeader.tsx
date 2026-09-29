import React from 'react';
import { Activity, Zap } from 'lucide-react';

export default function DashboardHeader() {
  return (
    <div style={{ marginBottom: 20 }}>
      <h1 style={{
        fontSize: 24,
        fontWeight: 700,
        color: '#0F172A',
        marginBottom: 4,
        letterSpacing: '-0.02em',
      }}>
        Hybrid AI–NWP Multi-Model Forecast Blending System
      </h1>
      <p style={{
        fontSize: 14,
        color: '#64748B',
        marginBottom: 10,
      }}>
        Adaptive multi-model weather intelligence for optimized 10-day regional forecasting
      </p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <span className="badge badge-success">
          <Activity size={11} /> Forecast Engine: Active
        </span>
        <span className="badge badge-primary">
          <Zap size={11} /> 3 Models Connected
        </span>
      </div>

      {/* Central narrative */}
      <div style={{
        marginTop: 14,
        padding: '10px 14px',
        background: '#EFF6FF',
        border: '1px solid #BFDBFE',
        borderRadius: 5,
        fontSize: 13,
        color: '#1E40AF',
        lineHeight: 1.5,
      }}>
        <strong>Select any region</strong> → evaluate model performance by month, region, lead time and weather conditions → <strong>dynamically assign weights</strong> → blend multiple forecasts → <strong>continuously update the 10-day forecast</strong>.
      </div>
    </div>
  );
}
