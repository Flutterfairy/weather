import React, { useState } from 'react';
import { useForecastState } from './hooks/useForecastState';
import Header from './components/Header';
import DashboardHeader from './components/DashboardHeader';
import ForecastControls from './components/ForecastControls';
import SummaryCards from './components/SummaryCards';
import BlendingPipeline from './components/BlendingPipeline';
import ForecastTable from './components/ForecastTable';
import ModelWeightPanel from './components/ModelWeightPanel';
import WeightFactors from './components/WeightFactors';
import ModelPerformanceSection from './components/ModelPerformance';
import WeightAdaptationChart from './components/WeightAdaptationChart';
import ForecastConfidencePanel from './components/ForecastConfidence';
import ExtremeWeather from './components/ExtremeWeather';
import RegionalReliabilityMap from './components/RegionalReliabilityMap';
import LiveUpdates from './components/LiveUpdates';
import TechnicalWorkflow from './components/TechnicalWorkflow';
import TechnicalStatus from './components/TechnicalStatus';
import LoadingOverlay from './components/LoadingOverlay';
import Footer from './components/Footer';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'performance' | 'weights' | 'system'>('dashboard');
  const [viewMode, setViewMode] = useState<'tabs' | 'all'>('tabs');

  const {
    state,
    setLocation,
    setMonth,
    setSelectedModel,
    generateForecast,
    simulateUpdate,
    getDisplayedForecast,
  } = useForecastState();

  const displayedForecast = getDisplayedForecast();

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', width: '100%', overflowX: 'hidden' }}>
      <LoadingOverlay isLoading={state.isLoading} />

      <Header
        lastUpdated={state.lastUpdated}
        isLive={state.isLive}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as any)}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <main style={{
        maxWidth: 1400,
        margin: '0 auto',
        padding: '16px 20px',
        width: '100%',
        boxSizing: 'border-box',
      }}>
        {/* Global Controls & Summary (Always accessible in Dashboard or when needed) */}
        <DashboardHeader />

        <ForecastControls
          selectedLocation={state.selectedLocation}
          selectedMonth={state.selectedMonth}
          forecastDuration={state.forecastDuration}
          forecastInterval={state.forecastInterval}
          isLoading={state.isLoading}
          onLocationChange={setLocation}
          onMonthChange={setMonth}
          onGenerate={generateForecast}
          onSimulateUpdate={simulateUpdate}
        />

        {/* TAB 1: OPERATIONAL DASHBOARD */}
        {(viewMode === 'all' || activeTab === 'dashboard') && (
          <section id="dashboard" style={{ marginBottom: viewMode === 'all' ? 24 : 0 }}>
            {/* KPI Summary Cards */}
            <SummaryCards
              confidence={state.confidence}
              alerts={state.alerts}
            />

            {/* Blending Pipeline */}
            <BlendingPipeline
              weights={state.currentWeights}
              performances={state.modelPerformance}
            />

            {/* Main Forecast + Sidebar Cockpit */}
            <div className="forecast-main-grid" style={{ marginBottom: 16 }}>
              {/* Main 10-day forecast table */}
              <div style={{ minWidth: 0 }}>
                <ForecastTable
                  forecastData={displayedForecast}
                  modelForecasts={state.modelForecasts}
                  weights={state.currentWeights}
                  selectedModel={state.selectedModel}
                  onSelectModel={setSelectedModel}
                  locationName={state.selectedLocation.fullName}
                />

                {/* Extreme Weather Guidance right below the forecast table */}
                <ExtremeWeather alerts={state.alerts} />
              </div>

              {/* Sidebar: Weights, Confidence, Status */}
              <div style={{ minWidth: 0 }}>
                <ModelWeightPanel
                  weights={state.currentWeights}
                  context={state.weightContext}
                />
                <ForecastConfidencePanel
                  confidence={state.confidence}
                />
                <TechnicalStatus />
              </div>
            </div>
          </section>
        )}

        {/* TAB 2: MODEL PERFORMANCE */}
        {(viewMode === 'all' || activeTab === 'performance') && (
          <section id="model-performance" style={{ marginBottom: viewMode === 'all' ? 24 : 0 }}>
            <ModelPerformanceSection
              performance={state.modelPerformance}
              selectedMonth={state.selectedMonth}
              region={state.selectedLocation.id}
              onMonthChange={setMonth}
            />

            <WeightFactors />
          </section>
        )}

        {/* TAB 3: WEIGHT ANALYSIS */}
        {(viewMode === 'all' || activeTab === 'weights') && (
          <section id="weight-analysis" style={{ marginBottom: viewMode === 'all' ? 24 : 0 }}>
            <WeightAdaptationChart
              leadTimeWeights={state.leadTimeWeights}
            />

            <RegionalReliabilityMap
              selectedLocation={state.selectedLocation}
              selectedMonth={state.selectedMonth}
              weatherRegime={state.weightContext.weatherRegime}
            />
          </section>
        )}

        {/* TAB 4: ARCHITECTURE & ALERTS */}
        {(viewMode === 'all' || activeTab === 'system') && (
          <section id="alerts" style={{ marginBottom: viewMode === 'all' ? 24 : 0 }}>
            <LiveUpdates
              updates={state.updateHistory}
              lastUpdated={state.lastUpdated}
            />

            <TechnicalWorkflow />
          </section>
        )}
      </main>

      <Footer />

      {/* Responsive adjustments */}
      <style>{`
        @media (max-width: 1080px) {
          .forecast-main-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
