import React, { useState } from 'react';
import { ArrowRight, ChevronDown, ChevronUp, Database, Activity, Sliders, Blend, Calendar, Sparkles } from 'lucide-react';
import { ModelWeight } from '../types';
import { MODELS } from '../data/constants';

interface BlendingPipelineProps {
  weights: ModelWeight[];
  performances: { modelId: string; overallSkill: number }[];
}

export default function BlendingPipeline({ weights, performances }: BlendingPipelineProps) {
  const [showSteps, setShowSteps] = useState(false);

  const formulaParts = MODELS.map(m => {
    const w = weights.find(mw => mw.modelId === m.id)?.weight ?? 0;
    return `${(w / 100).toFixed(2)}·[${m.name.split(' ')[0]}]`;
  }).join(' + ');

  return (
    <div className="card" style={{ marginBottom: 16, padding: '14px 16px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 24,
            height: 24,
            borderRadius: 4,
            background: '#EFF6FF',
            color: '#2563EB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Blend size={14} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>
              Multi-Model Dynamic Blending Engine
            </div>
            <div style={{ fontSize: 11, color: '#64748B' }}>
              Context-weighted consensus synthesizing NWP, Deep Learning & Statistical Ensemble
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            fontSize: 11,
            fontFamily: 'monospace',
            background: '#F1F5F9',
            padding: '3px 8px',
            borderRadius: 4,
            color: '#334155',
            border: '1px solid #E2E8F0',
          }} className="hidden md:block">
            Forecast = {formulaParts}
          </div>
          <button
            onClick={() => setShowSteps(!showSteps)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 11,
              fontWeight: 500,
              color: '#2563EB',
              background: '#EFF6FF',
              border: '1px solid #BFDBFE',
              borderRadius: 4,
              padding: '4px 8px',
              cursor: 'pointer',
            }}
          >
            {showSteps ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            {showSteps ? 'Hide Workflow' : 'Show 5-Step Pipeline'}
          </button>
        </div>
      </div>

      {/* Model Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 8,
      }}>
        {MODELS.map(model => {
          const w = weights.find(mw => mw.modelId === model.id)?.weight ?? 0;
          const p = performances.find(mp => mp.modelId === model.id)?.overallSkill ?? 0;
          return (
            <div
              key={model.id}
              style={{
                padding: '10px 12px',
                borderRadius: 5,
                border: `1px solid ${model.color}30`,
                background: `${model.color}06`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  <span style={{
                    width: 7,
                    height: 7,
                    borderRadius: 2,
                    background: model.color,
                    flexShrink: 0,
                  }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#0F172A', whiteSpace: 'nowrap' }}>
                    {model.name}
                  </span>
                </div>
                <div style={{ fontSize: 10, color: '#64748B' }}>
                  {model.type}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 9, color: '#94A3B8', textTransform: 'uppercase', fontWeight: 600 }}>Weight</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: model.color }}>{w}%</div>
                </div>
                <div style={{
                  width: 1,
                  height: 24,
                  background: '#E2E8F0',
                }} />
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 9, color: '#94A3B8', textTransform: 'uppercase', fontWeight: 600 }}>Skill</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{p}%</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expandable Pipeline Steps */}
      {showSteps && (
        <div style={{
          marginTop: 12,
          paddingTop: 12,
          borderTop: '1px solid #E2E8F0',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            overflowX: 'auto',
            paddingBottom: 4,
          }} className="forecast-scroll">
            {[
              { icon: <Database size={13} />, label: '1. Model Ingestion', sub: 'ECMWF, AI-DL, ENS' },
              { icon: <Activity size={13} />, label: '2. Bias Evaluation', sub: 'Historical skill' },
              { icon: <Sliders size={13} />, label: '3. Dynamic Weighting', sub: 'Regime & Lead Time' },
              { icon: <Blend size={13} />, label: '4. Consensus Fusion', sub: 'Optimal weighting' },
              { icon: <Calendar size={13} />, label: '5. Blended 10-Day', sub: '60 time intervals' },
            ].map((step, i, arr) => (
              <React.Fragment key={i}>
                <div style={{
                  flex: '1 0 130px',
                  padding: '8px 10px',
                  background: i === arr.length - 1 ? '#EFF6FF' : '#F8FAFC',
                  border: `1px solid ${i === arr.length - 1 ? '#BFDBFE' : '#E2E8F0'}`,
                  borderRadius: 4,
                  textAlign: 'center',
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: 3,
                    color: i === arr.length - 1 ? '#2563EB' : '#64748B',
                  }}>
                    {step.icon}
                  </div>
                  <div style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: i === arr.length - 1 ? '#2563EB' : '#0F172A',
                  }}>
                    {step.label}
                  </div>
                  <div style={{ fontSize: 9, color: '#94A3B8' }}>{step.sub}</div>
                </div>
                {i < arr.length - 1 && (
                  <div style={{ flex: '0 0 auto', color: '#94A3B8' }}>
                    <ArrowRight size={14} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
