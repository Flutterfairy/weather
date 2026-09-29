import React from 'react';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid #E2E8F0',
      padding: '20px 24px',
      textAlign: 'center',
      background: '#FFFFFF',
      marginTop: 20,
    }}>
      <div style={{
        fontSize: 13,
        fontWeight: 600,
        color: '#0F172A',
        marginBottom: 4,
      }}>
        Hybrid AI–NWP Multi-Model Forecast Blending System
      </div>
      <div style={{
        fontSize: 12,
        color: '#64748B',
        lineHeight: 1.6,
      }}>
        Demonstration interface · Multi-model adaptive forecasting architecture
      </div>
    </footer>
  );
}
