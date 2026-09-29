import React, { useState } from 'react';
import {
  CloudSun, Activity, Menu, X, Clock
} from 'lucide-react';

interface HeaderProps {
  lastUpdated: string;
  isLive: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
  viewMode: 'tabs' | 'all';
  onViewModeChange: (mode: 'tabs' | 'all') => void;
}

const NAV_TABS = [
  { id: 'dashboard', label: 'Operational Forecast' },
  { id: 'performance', label: 'Model Performance' },
  { id: 'weights', label: 'Weight Analysis' },
  { id: 'system', label: 'Architecture & Alerts' },
];

export default function Header({
  lastUpdated,
  isLive,
  activeTab,
  onTabChange,
  viewMode,
  onViewModeChange,
}: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header style={{
      background: '#FFFFFF',
      borderBottom: '1px solid #E2E8F0',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
    }}>
      <div style={{
        maxWidth: 1400,
        margin: '0 auto',
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 56,
      }}>
        {/* Left: Logo + Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32,
            height: 32,
            background: 'linear-gradient(135deg, #2563EB 0%, #0F9D9A 100%)',
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)',
          }}>
            <CloudSun size={18} color="white" />
          </div>
          <div>
            <div style={{
              fontSize: 14,
              fontWeight: 700,
              color: '#0F172A',
              letterSpacing: '-0.01em',
              lineHeight: 1.2,
            }}>
              Hybrid AI–NWP Blending
            </div>
            <div style={{ fontSize: 10, color: '#64748B', fontWeight: 500 }}>
              Operational Intelligence
            </div>
          </div>
        </div>

        {/* Center: Nav Tabs (desktop) */}
        <nav style={{ display: 'flex', gap: 4, background: '#F1F5F9', padding: '3px', borderRadius: 6 }} className="hidden md:flex">
          {NAV_TABS.map((tab) => {
            const isActive = viewMode === 'tabs' && activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  onViewModeChange('tabs');
                  onTabChange(tab.id);
                }}
                style={{
                  fontSize: 12,
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#2563EB' : '#64748B',
                  padding: '6px 14px',
                  borderRadius: 4,
                  background: isActive ? '#FFFFFF' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Right: Controls & Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* View mode toggle */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: 4,
            padding: 2,
          }} className="hidden lg:flex">
            <button
              onClick={() => onViewModeChange('tabs')}
              style={{
                fontSize: 11,
                padding: '3px 8px',
                borderRadius: 3,
                border: 'none',
                background: viewMode === 'tabs' ? '#2563EB' : 'transparent',
                color: viewMode === 'tabs' ? '#FFFFFF' : '#64748B',
                fontWeight: viewMode === 'tabs' ? 600 : 400,
                cursor: 'pointer',
              }}
              title="Compact tabbed mode for fast navigation"
            >
              Tabbed
            </button>
            <button
              onClick={() => onViewModeChange('all')}
              style={{
                fontSize: 11,
                padding: '3px 8px',
                borderRadius: 3,
                border: 'none',
                background: viewMode === 'all' ? '#2563EB' : 'transparent',
                color: viewMode === 'all' ? '#FFFFFF' : '#64748B',
                fontWeight: viewMode === 'all' ? 600 : 400,
                cursor: 'pointer',
              }}
              title="View all sections on one page"
            >
              Full Page
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }} className="hidden sm:flex">
            <Clock size={12} color="#64748B" />
            <span style={{ fontSize: 11, color: '#64748B' }}>{lastUpdated}</span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 12,
            fontWeight: 500,
            color: isLive ? '#16A34A' : '#64748B',
            background: isLive ? '#F0FDF4' : '#F8FAFC',
            padding: '4px 10px',
            borderRadius: 4,
          }}>
            <span style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: isLive ? '#16A34A' : '#94A3B8',
            }} />
            {isLive ? 'Live' : 'Offline'}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
              color: '#64748B',
            }}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div
          className="md:hidden"
          style={{
            borderTop: '1px solid #E2E8F0',
            padding: '8px 24px',
            background: '#FFFFFF',
          }}
        >
          {NAV_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                onViewModeChange('tabs');
                onTabChange(tab.id);
                setMobileOpen(false);
              }}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '10px 0',
                fontSize: 14,
                fontWeight: activeTab === tab.id ? 600 : 400,
                color: activeTab === tab.id ? '#2563EB' : '#0F172A',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
