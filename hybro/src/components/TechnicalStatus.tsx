import React from 'react';
import {
  Server, Database, Cloud, Cpu, Clock, Calendar, Ruler
} from 'lucide-react';

export default function TechnicalStatus() {
  const items = [
    { icon: <Server size={12} />, label: 'Forecast Engine', value: 'Active', color: '#16A34A' },
    { icon: <Cloud size={12} />, label: 'NWP Models', value: '1', color: '#0F172A' },
    { icon: <Cpu size={12} />, label: 'AI Models', value: '1', color: '#0F172A' },
    { icon: <Database size={12} />, label: 'Ensemble Models', value: '1', color: '#0F172A' },
    { icon: <Cloud size={12} />, label: 'Data Feed', value: 'Connected', color: '#16A34A' },
    { icon: <Clock size={12} />, label: 'Last Calculation', value: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }), color: '#0F172A' },
    { icon: <Calendar size={12} />, label: 'Forecast Horizon', value: '10 Days', color: '#0F172A' },
    { icon: <Ruler size={12} />, label: 'Resolution', value: '3 Hours', color: '#0F172A' },
  ];

  return (
    <div className="card card-sm" style={{ marginBottom: 20 }}>
      <div className="card-header" style={{ fontSize: 13 }}>
        <Server size={14} />
        Technical Status
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: 6,
      }}>
        {items.map((item, i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '5px 8px',
            background: '#F8FAFC',
            borderRadius: 3,
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 11,
              color: '#64748B',
            }}>
              {item.icon}
              {item.label}
            </div>
            <span style={{
              fontSize: 11,
              fontWeight: 600,
              color: item.color,
            }}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
