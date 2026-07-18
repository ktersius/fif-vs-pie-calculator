import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { CalculatorSelector } from './App';
import ControlPanel from './components/ControlPanel';
import SummaryDashboard from './components/SummaryDashboard';
import { DEFAULT_INPUTS } from './lib/defaults';
import { runSimulation, runUsIrishSimulation } from './lib/simulation';
import type { SimulationInputs } from './lib/types';

const inputs: SimulationInputs = {
  ...DEFAULT_INPUTS,
  pir: 0.175,
  fxMode: 'manual',
};

describe('calculator mode interface', () => {
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
      createElement(ControlPanel, { ...props, mode: 'pie-vs-us' }),
    );
    const etfHtml = renderToStaticMarkup(
      createElement(ControlPanel, { ...props, mode: 'us-vs-irish' }),
    );
    expect(pieHtml).toContain('PIE PIR');
    expect(pieHtml).not.toContain('FX Conversion');
    expect(pieHtml).toContain('value="0.175" selected=""');
    expect(etfHtml).toContain('FX Conversion');
    expect(etfHtml).not.toContain('PIE PIR');
    expect(etfHtml).toContain('value="manual" selected=""');
    expect(etfHtml).toContain('subject to FIF for every simulated year');
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
});
