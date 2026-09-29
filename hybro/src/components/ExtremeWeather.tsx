import React from 'react';
import { AlertTriangle, CloudRain, Thermometer, Wind } from 'lucide-react';
import { WeatherAlert } from '../types';

interface ExtremeWeatherProps {
  alerts: WeatherAlert[];
}

function getAlertIcon(type: string) {
  switch (type) {
    case 'heavy_rainfall': return <CloudRain size={18} color="#2563EB" />;
    case 'heat_wave': return <Thermometer size={18} color="#DC2626" />;
    case 'high_wind': return <Wind size={18} color="#D97706" />;
    default: return <AlertTriangle size={18} color="#D97706" />;
  }
}

function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'High': return '#DC2626';
    case 'Moderate': return '#D97706';
    case 'Low': return '#64748B';
    default: return '#64748B';
  }
}

function getConfidenceColor(confidence: string): string {
  switch (confidence) {
    case 'High': return '#16A34A';
    case 'Medium': return '#D97706';
    case 'Low': return '#94A3B8';
    default: return '#94A3B8';
  }
}

export default function ExtremeWeather({ alerts }: ExtremeWeatherProps) {
  return (
    <div className="card" style={{ marginBottom: 16 }} id="extreme-weather">
      <div className="card-header">
        <AlertTriangle size={16} />
        Extreme Weather Guidance
      </div>

      {alerts.length === 0 ? (
        <div style={{
          padding: '20px',
          textAlign: 'center',
          color: '#64748B',
          fontSize: 13,
          background: '#F8FAFC',
          borderRadius: 4,
        }}>
          No significant extreme-weather risks detected.
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 12,
        }}>
          {alerts.map(alert => (
            <div key={alert.id} style={{
              padding: '14px',
              borderRadius: 5,
              border: `1px solid ${getSeverityColor(alert.severity)}20`,
              background: alert.severity === 'High' ? '#FEF2F208' : '#FFFFFF',
            }}>
              {/* Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 10,
              }}>
                {getAlertIcon(alert.type)}
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>
                    {alert.label}
                  </div>
                  <div style={{ fontSize: 11, color: '#64748B' }}>
                    {alert.location} — Day {alert.day}, {alert.time}
                  </div>
                </div>
              </div>

              {/* Value */}
              <div style={{
                display: 'flex',
                gap: 16,
                marginBottom: 10,
              }}>
                <div>
                  <div style={{ fontSize: 10, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Expected
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#0F172A' }}>
                    {alert.value} {alert.unit}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Severity
                  </div>
                  <div style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: getSeverityColor(alert.severity),
                  }}>
                    {alert.severity}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Confidence
                  </div>
                  <div style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: getConfidenceColor(alert.confidence),
                  }}>
                    {alert.confidence}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div style={{
                fontSize: 11,
                color: '#64748B',
                lineHeight: 1.5,
              }}>
                {alert.description}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
