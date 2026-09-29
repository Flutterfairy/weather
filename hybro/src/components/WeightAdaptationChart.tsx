import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { LeadTimeWeights } from '../types';

interface WeightAdaptationChartProps {
  leadTimeWeights: LeadTimeWeights[];
}

export default function WeightAdaptationChart({ leadTimeWeights }: WeightAdaptationChartProps) {
  const chartData = leadTimeWeights.map(ltw => {
    const nwp = ltw.weights.find(w => w.modelId === 'nwp_a')?.weight ?? 0;
    const ai = ltw.weights.find(w => w.modelId === 'ai_b')?.weight ?? 0;
    const ens = ltw.weights.find(w => w.modelId === 'ensemble_c')?.weight ?? 0;
    return {
      band: ltw.days,
      'NWP Model A': nwp,
      'AI Model B': ai,
      'Ensemble C': ens,
    };
  });

  return (
    <div className="card" style={{ marginBottom: 20 }} id="weight-analysis">
      <div className="card-header">
        <TrendingUp size={16} />
        Dynamic Weight Adaptation
      </div>
      <p style={{ fontSize: 12, color: '#64748B', marginBottom: 14 }}>
        Model weights change with forecast lead time and changing weather conditions.
      </p>

      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer>
          <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis
              dataKey="band"
              tick={{ fontSize: 12, fill: '#64748B' }}
              axisLine={{ stroke: '#E2E8F0' }}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
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
            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
            <Area
              type="monotone"
              dataKey="NWP Model A"
              stackId="1"
              stroke="#2563EB"
              fill="#2563EB"
              fillOpacity={0.7}
            />
            <Area
              type="monotone"
              dataKey="AI Model B"
              stackId="1"
              stroke="#0F9D9A"
              fill="#0F9D9A"
              fillOpacity={0.7}
            />
            <Area
              type="monotone"
              dataKey="Ensemble C"
              stackId="1"
              stroke="#7C3AED"
              fill="#7C3AED"
              fillOpacity={0.7}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Weight Table */}
      <div style={{ marginTop: 14 }}>
        <table style={{
          width: '100%',
          fontSize: 12,
          borderCollapse: 'collapse',
        }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
              <th style={{ textAlign: 'left', padding: '6px 8px', fontSize: 11, color: '#64748B', fontWeight: 600 }}>Lead Time</th>
              <th style={{ textAlign: 'center', padding: '6px 8px', fontSize: 11, color: '#2563EB', fontWeight: 600 }}>NWP A</th>
              <th style={{ textAlign: 'center', padding: '6px 8px', fontSize: 11, color: '#0F9D9A', fontWeight: 600 }}>AI B</th>
              <th style={{ textAlign: 'center', padding: '6px 8px', fontSize: 11, color: '#7C3AED', fontWeight: 600 }}>Ensemble C</th>
            </tr>
          </thead>
          <tbody>
            {leadTimeWeights.map(ltw => (
              <tr key={ltw.band} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '6px 8px', fontWeight: 500 }}>{ltw.days}</td>
                {ltw.weights.map(w => (
                  <td key={w.modelId} style={{
                    padding: '6px 8px',
                    textAlign: 'center',
                    fontWeight: 600,
                    color: w.modelId === 'nwp_a' ? '#2563EB' : w.modelId === 'ai_b' ? '#0F9D9A' : '#7C3AED',
                  }}>
                    {w.weight}%
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
