import React, { useState, useEffect } from 'react';
import { Loader } from 'lucide-react';

interface LoadingOverlayProps {
  isLoading: boolean;
}

const STEPS = [
  'Analyzing regional conditions...',
  'Evaluating model performance...',
  'Calculating dynamic weights...',
  'Blending forecast outputs...',
  'Generating 10-day forecast...',
];

export default function LoadingOverlay({ isLoading }: LoadingOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setCurrentStep(0);
      setComplete(false);
      return;
    }

    setComplete(false);
    setCurrentStep(0);

    const timers: ReturnType<typeof setTimeout>[] = [];
    STEPS.forEach((_, i) => {
      timers.push(setTimeout(() => setCurrentStep(i), i * 380));
    });
    timers.push(setTimeout(() => setComplete(true), STEPS.length * 380));

    return () => timers.forEach(clearTimeout);
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(248, 250, 252, 0.92)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: 6,
        padding: '28px 36px',
        maxWidth: 400,
        width: '90%',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 18,
        }}>
          <Loader size={18} color="#2563EB" style={{
            animation: 'spin 1.2s linear infinite',
          }} />
          <span style={{
            fontSize: 15,
            fontWeight: 600,
            color: '#0F172A',
          }}>
            Generating Blended Forecast
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {STEPS.map((step, i) => (
            <div
              key={i}
              className={i <= currentStep ? 'loading-step' : ''}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 13,
                color: i <= currentStep ? '#0F172A' : '#CBD5E1',
                animationDelay: `${i * 0.1}s`,
                opacity: i <= currentStep ? 1 : 0.3,
                transition: 'opacity 0.3s, color 0.3s',
              }}
            >
              <span style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: i < currentStep ? '#16A34A' : i === currentStep ? '#2563EB' : '#E2E8F0',
                flexShrink: 0,
                transition: 'background 0.3s',
              }} />
              {step}
            </div>
          ))}
        </div>

        {complete && (
          <div style={{
            marginTop: 14,
            padding: '8px 12px',
            background: '#F0FDF4',
            border: '1px solid #BBF7D0',
            borderRadius: 4,
            fontSize: 13,
            color: '#16A34A',
            fontWeight: 500,
            textAlign: 'center',
          }}>
            ✓ Forecast Generated Successfully
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
