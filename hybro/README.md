# Hybrid AI–NWP Multi-Model Forecast Blending System
### Adaptive Multi-Model Weather Intelligence for Optimized 10-Day Regional Forecasting

[![React](https://img.shields.io/badge/React-19.2-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Recharts](https://img.shields.io/badge/Recharts-2.15-22c55e)](https://recharts.org/)
[![Lucide Icons](https://img.shields.io/badge/Lucide_React-0.5-orange)](https://lucide.dev/)

---

## 1. Executive Summary & Vision

The **Hybrid AI–NWP Multi-Model Forecast Blending System** is an operational meteorological intelligence platform designed to address the foundational limitations of single-model weather forecasting.

Rather than relying on an isolated numerical weather prediction (NWP) model or an experimental AI model, this system evaluates multiple heterogeneous forecasting sources, dynamically assigns context-driven weights based on multidimensional performance factors, and continuously synthesizes an optimized **10-day blended forecast** at 3-hour temporal intervals.

```
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│   NWP Model A   │   │   AI Model B    │   │ Ensemble Model C│
│ (ECMWF Physics) │   │ (Deep Learning) │   │  (MOS Ensemble) │
└────────┬────────┘   └────────┬────────┘   └────────┬────────┘
         │                     │                     │
         └───────────────┬─────┴─────────────────────┘
                         ▼
        ┌───────────────────────────────────┐
        │  Multi-Factor Dynamic Weighting   │
        │  • Region     • Lead Time Band    │
        │  • Month      • Weather Regime    │
        │  • Skill      • Recent Error Drift│
        └─────────────────┬─────────────────┘
                          ▼
        ┌───────────────────────────────────┐
        │   Optimal Consensus Synthesis     │
        │  Continuous 10-Day Blended Output │
        └─────────────────┬─────────────────┘
                          ▼
        ┌───────────────────────────────────┐
        │ Operational Weather Intelligence  │
        │  • Severe Warnings • Trend Shifts │
        └───────────────────────────────────┘
```

---

## 2. Core Forecasting Models Integrated

| Model Identifier | Architecture / Methodology | Core Strengths | Operational Vulnerabilities |
| :--- | :--- | :--- | :--- |
| **NWP Model A** | Physics-based Numerical Weather Prediction (hydrostatic & non-hydrostatic atmospheric equations, ECMWF IFS paradigm) | Superior mass/energy conservation, peak skill in Days 1–3, accurate high-gradient orographic rain. | Computationally intensive, higher error dispersion and phase lag beyond Day 6. |
| **AI Model B** | Deep Learning / Neural Weather Architecture (Spherical Fourier Neural Operators / Vision Transformers, Pangu / FourCastNet paradigm) | Sub-second inference, excels in large-scale synoptic temperature advection, strong extended-range skill (Days 6–10). | Smoothing of local convective extremes; prone to dry bias in rapid monsoon onset. |
| **Ensemble Model C** | Statistical Multi-Model Ensemble / Model Output Statistics (MOS calibration with historical variance pooling) | High climatological stability, variance dampening, reliable baseline probability calibration. | Lacks dynamic responsiveness during rapid regime shifts or rare anomalous events. |

---

## 3. Mathematical Weight Allocation Formulation

Model weights are continuously calculated using a multidimensional objective function. The normalized contribution $w_i$ for model $i$ is defined as:

$$w_i = \frac{S_i}{\sum_{j=1}^{N} S_j} \times 100\%$$

Where the unnormalized context score $S_i$ is computed from six governing factors:

$$S_i = \text{Skill}_{\text{hist}, i} \times F_{\text{month}, i} \times F_{\text{region}, i} \times F_{\text{lead}, i} \times F_{\text{regime}, i} \times F_{\text{recent}, i}$$

### The 6 Contextual Weight Factors:
1. **Historical Skill ($\text{Skill}_{\text{hist}, i}$)**: Long-term multi-year verification accuracy across four primary variables (precipitation, temperature, surface wind, extreme events).
2. **Monthly / Seasonal Factor ($F_{\text{month}, i}$)**: Accounts for seasonal performance variations (e.g., NWP precipitation superiority during July/August monsoon vs. AI temperature superiority during pre-monsoon May heatwaves).
3. **Regional Microclimate Factor ($F_{\text{region}, i}$)**: Calibrated for geographic terrains (Coastal Konkan marine moisture vs. Vidarbha continental heat vs. Western Ghats orographic lift).
4. **Lead Time Horizon Factor ($F_{\text{lead}, i}$)**: Explicit model decay modeling:
   - **Days 1–3**: NWP physics receives high weighting ($w_{\text{NWP}} \approx 37\text{--}42\%$).
   - **Days 4–7**: AI and NWP operate in balanced consensus.
   - **Days 8–10**: Deep Learning & statistical ensemble overtake NWP ($w_{\text{AI}} \approx 38\text{--}44\%$).
5. **Weather Regime Factor ($F_{\text{regime}, i}$)**: Dynamic gain triggered by the prevailing atmospheric regime (e.g., *Active Monsoon*, *Extreme Heatwave*, *Dry Winter Inversion*).
6. **Recent Performance Drift ($F_{\text{recent}, i}$)**: Rolling 72-hour error calibration that discounts a model experiencing temporary drift or sensor feed latency.

> **Normalization Guarantee**: The weighting engine includes automatic rounding-drift compensation to ensure $\sum w_i \equiv 100\%$ across all configurations.

---

## 4. Key Dashboard Modules & User Interface

The web interface is organized into a high-density, compact **Operational Cockpit** designed to eliminate excessive scrolling while maximizing real-time interactivity.

### 4.1 Header & View Switcher
- **Operational Tabs**: Instant tab switching between `Operational Forecast`, `Model Performance`, `Weight Analysis`, and `Architecture & Alerts`.
- **Display Modes**: Toggle between **Tabbed View** (high-density compact mode) and **Full Page Overview** (single-page presentation mode).
- **System Health Indicators**: Live engine heartbeat, connected model feeds, and last-synchronized timestamp.

### 4.2 Forecast Controls & 1-Click Scenario Presets
- Interactive selectors for **Target Region** (Mumbai, Pune, Nagpur, Nashik, Bengaluru, Delhi) and **Season / Month**.
- **Quick Scenarios**:
  - `⛈️ Monsoon Storm`: Simulates peak monsoon precipitation in Mumbai; triggers NWP weighting surge and heavy rainfall advisories.
  - `☀️ Summer Heatwave`: Triggers extreme temperature anomaly in Nagpur; activates AI thermal tracking and Heat Wave guidance.
  - `❄️ Winter Regime`: Stable inversion regime in Pune; demonstrates high ensemble consensus.
  - `🌾 Post-Monsoon`: Tests convective transition season dynamics in Nashik.
- **Simulate Update Button**: Simulates incoming radar/satellite observations and triggers adaptive live re-blending.

### 4.3 KPI Metrics & Blending Pipeline Banner
- **4 Operational KPI Cards**: Blended sequence status, dynamic weighting state, lead-time confidence level, and severe weather alert count with descriptive severity tags.
- **Consensus Blending Engine Banner**: Displays live mathematical formula ($ŷ = 0.37 \cdot \text{NWP} + 0.35 \cdot \text{AI} + 0.28 \cdot \text{ENS}$) with an expandable 5-step processing pipeline.

### 4.4 Interactive 10-Day Forecast Table
- **Dual View Modes**:
  - **Daily Summary View**: Compact 10-day overview showing High/Low temperatures, precipitation probability with color-coded confidence, rainfall totals, wind vectors, and reliability badges.
  - **Hourly Interval View**: Full 60-horizon 3-hourly time-series with sticky headers.
- **Accordion Expandability**: Click any day to expand its 3-hour intervals (`06:00 AM`, `09:00 AM`, `12:00 PM`, `03:00 PM`, `06:00 PM`, `09:00 PM`).
- **Multi-Model Comparison Drawer**: Click `Compare` on any row to inspect individual predictions side-by-side:
  - NWP Model A vs. AI Model B vs. Ensemble C vs. Final Blended Value.
- **Lead Horizon Quick Filters**: Filter instantly by `All 10 Days`, `Days 1–3 (Short Range)`, `Days 4–7 (Medium)`, or `Days 8–10 (Extended)`.

### 4.5 Sidebar Diagnostics
- **Live Model Weight Bars**: Real-time proportional distribution with contextual explanation text.
- **Confidence Horizon Indicators**: Color-coded breakdown of forecast reliability by lead-time band.
- **Engine Technical Status**: Verification of model connectivity, spatial resolution (0.1° / ~9 km), update cycle (6-hour continuous assimilation), and MOS calibration status.

### 4.6 Analytics & Verification Views
- **Model Performance Comparison**: Recharts grouped bar visualization comparing Rainfall Accuracy, Temperature RMSE, Wind Vector Accuracy, and Extreme Event Detection across all 12 calendar months.
- **Weight Adaptation Stacked Area Chart**: Visualizes continuous weight transition from Day 1 through Day 10.
- **Regional Reliability SVG Map**: Geographic representation of model strengths across Maharashtra microclimates.
- **Live Ingestion Feed & Architecture**: 8-step operational pipeline tracking model run ingestion, bias evaluation, and distribution.

---

## 5. Technology Stack

- **Framework**: React 19 + TypeScript 5.9 (Strict mode enabled)
- **Build Tool**: Vite 8.3 with Rolldown bundler
- **Styling**: Vanilla CSS custom properties (`src/index.css`) + TailwindCSS v4 integration
- **Data Visualization**: Recharts 2.15 (Grouped Bar Charts, Stacked Area Charts)
- **Icons**: Lucide React
- **Typography**: Inter (Google Fonts)

---

## 6. Project Structure

```
Hybrid proj/
├── index.html                     # HTML5 entry with preconnected Google Fonts & meta tags
├── package.json                   # Dependencies, scripts, and build targets
├── tsconfig.json                  # TypeScript strict compiler configuration
├── vite.config.ts                 # Vite bundler configuration
├── src/
│   ├── main.tsx                   # Application mount point
│   ├── App.tsx                    # Main cockpit layout with tab routing & state
│   ├── index.css                  # Global design system, CSS tokens & responsive reset
│   ├── vite-env.d.ts              # Vite client types & CSS declaration modules
│   │
│   ├── types/
│   │   └── index.ts               # Core domain models (ForecastPoint, ModelWeight, Alerts, etc.)
│   │
│   ├── data/
│   │   └── constants.ts           # Geographic stations, model metadata, baseline climatology
│   │
│   ├── services/
│   │   ├── weightEngine.ts        # 6-factor weight calculation & 100% normalization
│   │   ├── forecastService.ts     # Multi-model synthetic generators & consensus blending
│   │   ├── alertService.ts        # Severe weather risk extraction & thresholding
│   │   └── confidenceService.ts   # Inter-model spread analysis & confidence scoring
│   │
│   ├── hooks/
│   │   └── useForecastState.ts    # Centralized reactive forecast state management
│   │
│   └── components/
│       ├── Header.tsx             # Sticky navbar with tab switcher & view toggle
│       ├── DashboardHeader.tsx    # Operational title, active badges, and core thesis
│       ├── ForecastControls.tsx   # Station/month selectors, quick scenarios & simulation
│       ├── SummaryCards.tsx       # 4 KPI cards with adaptive severity tags
│       ├── BlendingPipeline.tsx   # Compact consensus formula & collapsible pipeline
│       ├── ForecastTable.tsx      # Dual-mode daily/hourly table with multi-model comparison
│       ├── ModelWeightPanel.tsx   # Weight allocation progress bars & dynamic reasoning
│       ├── WeightFactors.tsx      # Mathematical breakdown of the 6 weighting factors
│       ├── ModelPerformance.tsx   # Comparative skill bar chart & month selector
│       ├── WeightAdaptationChart.tsx # Stacked area lead-time evolution chart
│       ├── ForecastConfidence.tsx # Lead-time reliability indicators
│       ├── ExtremeWeather.tsx     # Severe weather advisories with action guidance
│       ├── RegionalReliabilityMap.tsx # SVG regional microclimate skill map
│       ├── LiveUpdates.tsx        # Ingestion timeline & recent model runs
│       ├── TechnicalWorkflow.tsx  # 8-step end-to-end data pipeline diagram
│       ├── TechnicalStatus.tsx    # Operational health metrics
│       ├── LoadingOverlay.tsx     # Progress simulation overlay
│       └── Footer.tsx             # Scientific metadata footer
```

---

## 7. Local Setup & Execution Guide

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm (v9.0.0 or higher)

### Installation & Launch

1. **Clone or navigate to the workspace directory**:
   ```powershell
   cd "c:\Users\Lenovo\OneDrive\Desktop\t-3 endterm proj\Hybrid proj"
   ```

2. **Install project dependencies**:
   ```powershell
   npm install
   ```

3. **Start the local development server**:
   ```powershell
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173/`.

4. **Verify TypeScript type checking**:
   ```powershell
   npx tsc --noEmit
   ```

5. **Build production bundle**:
   ```powershell
   npm run build
   ```
   The compiled assets will be output to the `dist/` directory.

---

## 8. Robustness & Edge-Case Handling

- **Zero-Sum / Negative Weight Protection**: All weights are non-negative and strictly normalized to 100% using rounding-drift allocation.
- **Division-by-Zero Guards**: Blending algorithm protects against null or zeroed weights by falling back to equal weighting.
- **Viewport Overflow Prevention**: Strict `overflow-x: hidden` and `min-width: 0` rules on all grid containers prevent horizontal page blowout.
- **Interactive Resilience**: State changes (region change, month change, scenario preset clicks) trigger atomic forecast re-synthesis with smooth loading transitions.
- **Graceful Fallbacks**: Missing regional coordinates gracefully default without breaking map rendering or table views.

---

## 9. Academic & Operational Credits

Developed as a demonstration of **Hybrid Numerical-AI Multi-Model Weather Synthesis**, integrating physics-based fluid modeling with state-of-the-art neural weather prediction and Bayesian model averaging.
