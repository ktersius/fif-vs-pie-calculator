import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import App, { AnalysisMethodSelector, CalculatorSelector } from './App';
import ControlPanel from './components/ControlPanel';
import MonteCarloResults from './components/MonteCarloResults';
import SummaryDashboard from './components/SummaryDashboard';
import { DEFAULT_INPUTS } from './lib/defaults';
import type { MonteCarloResult } from './lib/monteCarlo';
import { runSimulation, runUsIrishSimulation } from './lib/simulation';
import type { SimulationInputs } from './lib/types';

const inputs: SimulationInputs = {
  ...DEFAULT_INPUTS,
  pir: 0.175,
  fxMode: 'manual',
};

describe('calculator mode interface', () => {
  it('defaults to the historical backtest method', () => {
    const html = renderToStaticMarkup(createElement(App));
    expect(html).toContain('<h1 class="text-2xl font-bold text-slate-900">Historical Backtest</h1>');
    expect(html).toContain('name="analysis-method"');
    expect(html).toContain('checked="" value="historical"');
    expect(html).toContain('Historical Backtest Summary');
    expect(html).not.toContain('Monte Carlo Distribution Results');
  });

  it('renders an accessible analysis-method selector', () => {
    const html = renderToStaticMarkup(
      createElement(AnalysisMethodSelector, {
        method: 'monte-carlo',
        onChange: () => undefined,
      }),
    );
    expect(html).toContain('<legend');
    expect(html).toContain('Analysis method');
    expect(html).toContain('checked="" value="monte-carlo"');
    expect(html).toContain('Historical Backtest');
    expect(html).toContain('Monte Carlo Simulation');
  });

  it('renders a native radio selector with PIE mode selected by default', () => {
    const html = renderToStaticMarkup(
      createElement(CalculatorSelector, {
        mode: 'pie-vs-us',
        onChange: () => undefined,
      }),
    );
    expect(html).toContain('type="radio"');
    expect(html).toContain('name="calculator-mode"');
    expect(html).toContain('checked="" value="pie-vs-us"');
    expect(html).toContain('US ETF vs Irish ETF');
  });

  it('shows only the active mode control while preserving both input values', () => {
    const props = { inputs, onChange: () => undefined };
    const pieHtml = renderToStaticMarkup(
      createElement(ControlPanel, {
        ...props,
        analysisMethod: 'historical',
        mode: 'pie-vs-us',
      }),
    );
    const etfHtml = renderToStaticMarkup(
      createElement(ControlPanel, {
        ...props,
        analysisMethod: 'historical',
        mode: 'us-vs-irish',
      }),
    );
    expect(pieHtml).toContain('PIE PIR');
    expect(pieHtml).not.toContain('FX Conversion');
    expect(pieHtml).toContain('value="0.175" selected=""');
    expect(etfHtml).toContain('FX Conversion');
    expect(etfHtml).not.toContain('PIE PIR');
    expect(etfHtml).toContain('value="manual" selected=""');
    expect(etfHtml).toContain('subject to FIF for every simulated year');
  });

  it('shows focused Monte Carlo controls without changing preserved inputs', () => {
    const html = renderToStaticMarkup(
      createElement(ControlPanel, {
        inputs,
        analysisMethod: 'monte-carlo',
        mode: 'us-vs-irish',
        onChange: () => undefined,
      }),
    );
    expect(html).toContain('PIE PIR');
    expect(html).toContain('value="0.175" selected=""');
    expect(html).toContain('Fixed Monte Carlo assumptions');
    expect(html).toContain('5,000');
    expect(html).toContain('Mean block length');
    expect(html).not.toContain('Historical End Year');
    expect(html).not.toContain('FX Conversion');
    expect(html).not.toContain('name="run-count"');
    expect(html).not.toContain('name="random-seed"');
  });

  it('uses active platform labels and only shows estate results in ETF mode', () => {
    const pieHtml = renderToStaticMarkup(
      createElement(SummaryDashboard, { result: runSimulation(inputs) }),
    );
    const etfHtml = renderToStaticMarkup(
      createElement(SummaryDashboard, { result: runUsIrishSimulation(inputs) }),
    );
    expect(pieHtml).toContain('InvestNow');
    expect(pieHtml).toContain('US ETF');
    expect(pieHtml).not.toContain('Inherited Wealth');
    expect(etfHtml).toContain('Irish ETF');
    expect(etfHtml).toContain('Inherited Wealth');
    expect(etfHtml).toContain('Illustrative US Estate Tax');
  });

  it('renders accessible Monte Carlo distributions without single-path output', () => {
    const percentiles = { p10: 10, p50: 20, p90: 30 };
    const result: MonteCarloResult = {
      runCount: 5_000,
      seed: 42,
      meanBlockLength: 4,
      wins: {
        pie: { count: 2_000, rate: 0.4 },
        direct: { count: 3_000, rate: 0.6 },
        ties: { count: 0, rate: 0 },
      },
      finalBalances: { pie: percentiles, direct: percentiles },
      finalValueDifference: percentiles,
      totalTax: { pie: percentiles, direct: percentiles },
      totalFees: { pie: percentiles, direct: percentiles },
      histogram: [
        { min: -20, max: -10, count: 1_000 },
        { min: -10, max: 10, count: 1_000 },
        { min: 10, max: 20, count: 3_000 },
      ],
    };
    const html = renderToStaticMarkup(createElement(MonteCarloResults, { result }));
    expect(html).toContain('InvestNow PIE wins');
    expect(html).toContain('Direct US ETF wins');
    expect(html).toContain('border-green-200 bg-green-50');
    expect(html).toContain('border-blue-200 bg-blue-50');
    expect(html).toContain('10th percentile');
    expect(html).toContain('Median');
    expect(html).toContain('Total New Zealand tax');
    expect(html).toContain('Total fees');
    expect(html).toContain('Final balance difference: Direct US ETF minus InvestNow PIE');
    expect(html).toContain('Positive values mean Direct US ETF finished ahead');
    expect(html).toContain('negative values mean InvestNow PIE');
    expect(html).toContain('Final-value-difference histogram');
    expect(html).toContain('PIE ahead (negative)');
    expect(html).toContain('Near tie ($0)');
    expect(html).toContain('Direct ahead (positive)');
    expect(html).toContain('>PIE ahead<');
    expect(html).toContain('>Near tie<');
    expect(html).toContain('>Direct ahead<');
    expect(html).toContain('This is not a forecast');
    expect(html).not.toContain('Historical period:');
    expect(html).not.toContain('Portfolio Balance');
    expect(html).not.toContain('Year-by-Year Breakdown');
  });
});
