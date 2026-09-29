import React from 'react';
import { Calendar, Layers, ShieldCheck, AlertTriangle } from 'lucide-react';
import { ForecastConfidence, WeatherAlert } from '../types';

interface SummaryCardsProps {
  confidence: ForecastConfidence[];
  alerts: WeatherAlert[];
}

export default function SummaryCards({ confidence, alerts }: SummaryCardsProps) {
  const highConfidence = confidence.find(c => c.band === '1-3');
  const highConfAlerts = alerts.filter(a => a.confidence === 'High').length;
  const medConfAlerts = alerts.filter(a => a.confidence === 'Medium').length;

  let alertSub = 'Normal conditions';
  if (alerts.length > 0) {
    if (highConfAlerts > 0) {
      alertSub = `${highConfAlerts} High Confidence`;
    } else if (medConfAlerts > 0) {
      alertSub = `${medConfAlerts} Moderate Severity`;
    } else {
      alertSub = `${alerts.length} Advisory active`;
    }
  }

  const cards = [
    {
      icon: <Calendar size={15} color="#2563EB" />,
      label: '10-Day Forecast',
      value: 'Operational',
      sub: '60 Blended Horizons',
      accent: '#2563EB',
    },
    {
      icon: <Layers size={15} color="#0F9D9A" />,
      label: 'Dynamic Model Weights',
      value: 'Adaptive Blend',
      sub: 'Auto-tuned by Lead Time',
      accent: '#0F9D9A',
    },
    {
      icon: <ShieldCheck size={15} color="#16A34A" />,
      label: 'Lead Time Confidence',
      value: highConfidence?.level ?? 'High',
      sub: 'Peak Skill in Days 1–3',
      accent: '#16A34A',
    },
    {
      icon: <AlertTriangle size={15} color={alerts.length > 0 ? '#D97706' : '#16A34A'} />,
      label: 'Severe Weather Alerts',
      value: `${alerts.length}`,
      sub: alertSub,
      accent: alerts.length > 0 ? '#D97706' : '#16A34A',
    },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: 12,
      marginBottom: 20,
    }}>
      {cards.map((card, i) => (
        <div key={i} className="card card-sm" style={{
          borderTop: `2px solid ${card.accent}`,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            marginBottom: 8,
          }}>
            {card.icon}
            <span style={{ fontSize: 12, fontWeight: 500, color: '#64748B' }}>{card.label}</span>
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', marginBottom: 2 }}>
            {card.value}
          </div>
          <div style={{ fontSize: 12, color: '#94A3B8' }}>{card.sub}</div>
        </div>
      ))}
    </div>
  );
}
