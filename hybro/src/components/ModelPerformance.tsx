import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, Calendar } from 'lucide-react';
import { ModelPerformance as ModelPerf } from '../types';
import { MODELS, MONTHS } from '../data/constants';
import { getModelPerformance } from '../services/weightEngine';

interface ModelPerformanceProps {
  performance: ModelPerf[];
  selectedMonth: string;
  region: string;
  onMonthChange: (month: string) => void;
}

export default function ModelPerformanceSection({
  performance,
  selectedMonth,
  region,
  onMonthChange,
}: ModelPerformanceProps) {
  const chartData = [
    {
      metric: 'Rainfall',
      'NWP Model A': performance.find(p => p.modelId === 'nwp_a')?.rainfallAccuracy ?? 0,
      'AI Model B': performance.find(p => p.modelId === 'ai_b')?.rainfallAccuracy ?? 0,
      'Ensemble C': performance.find(p => p.modelId === 'ensemble_c')?.rainfallAccuracy ?? 0,
    },
    {
      metric: 'Temperature',
      'NWP Model A': performance.find(p => p.modelId === 'nwp_a')?.temperatureAccuracy ?? 0,
      'AI Model B': performance.find(p => p.modelId === 'ai_b')?.temperatureAccuracy ?? 0,
      'Ensemble C': performance.find(p => p.modelId === 'ensemble_c')?.temperatureAccuracy ?? 0,
    },
    {
      metric: 'Wind',
      'NWP Model A': performance.find(p => p.modelId === 'nwp_a')?.windAccuracy ?? 0,
      'AI Model B': performance.find(p => p.modelId === 'ai_b')?.windAccuracy ?? 0,
      'Ensemble C': performance.find(p => p.modelId === 'ensemble_c')?.windAccuracy ?? 0,
    },
    {
      metric: 'Extreme Events',
      'NWP Model A': performance.find(p => p.modelId === 'nwp_a')?.extremeEventDetection ?? 0,
      'AI Model B': performance.find(p => p.modelId === 'ai_b')?.extremeEventDetection ?? 0,
      'Ensemble C': performance.find(p => p.modelId === 'ensemble_c')?.extremeEventDetection ?? 0,
    },
  ];

  return (
    <div className="card" style={{ marginBottom: 20 }} id="model-performance">
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 14,
      }}>
        <div className="card-header" style={{ marginBottom: 0 }}>
          <Activity size={16} />
          Model Performance Comparison
        </div>

        {/* Month selector */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}>
          <Calendar size={13} color="#64748B" />
          <span style={{ fontSize: 12, color: '#64748B' }}>Performance Month:</span>
          <select
            value={selectedMonth}
            onChange={(e) => onMonthChange(e.target.value)}
            style={{
              padding: '4px 8px',
              fontSize: 12,
              border: '1px solid #E2E8F0',
              borderRadius: 4,
              background: '#FFFFFF',
              color: '#0F172A',
              cursor: 'pointer',
              outline: 'none',
            }}
            aria-label="Performance month"
          >
            {MONTHS.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Chart */}
      <div style={{ width: '100%', height: 280 }}>
        <ResponsiveContainer>
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis
              dataKey="metric"
              tick={{ fontSize: 12, fill: '#64748B' }}
              axisLine={{ stroke: '#E2E8F0' }}
              tickLine={false}
            />
            <YAxis
              domain={[60, 100]}
              tick={{ fontSize: 11, fill: '#94A3B8' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              contentStyle={{
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: 4,
                fontSize: 12,
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}
              formatter={(value: any) => [`${value}%`, '']}
            />
            <Legend
              wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
            />
            <Bar dataKey="NWP Model A" fill="#2563EB" radius={[3, 3, 0, 0]} />
            <Bar dataKey="AI Model B" fill="#0F9D9A" radius={[3, 3, 0, 0]} />
            <Bar dataKey="Ensemble C" fill="#7C3AED" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Interpretation */}
      <div style={{
        marginTop: 12,
        padding: '10px 12px',
        background: '#F8FAFC',
        borderRadius: 4,
        fontSize: 12,
        color: '#64748B',
        lineHeight: 1.5,
      }}>
        <strong style={{ color: '#0F172A' }}>Higher historical skill → Higher forecast weight.</strong>{' '}
        Historical performance is evaluated for the selected region and month, while recent performance and weather regime provide additional adaptive signals.
      </div>
    </div>
  );
}
