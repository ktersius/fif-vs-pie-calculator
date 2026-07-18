import { useMemo, useState } from 'react';
import BalanceChart from './components/BalanceChart';
import BreakdownTable from './components/BreakdownTable';
import ControlPanel from './components/ControlPanel';
import MonteCarloResults from './components/MonteCarloResults';
import SummaryDashboard from './components/SummaryDashboard';
import TaxDragChart from './components/TaxDragChart';
import { trackEvent } from './lib/analytics';
import { DEFAULT_INPUTS } from './lib/defaults';
import { clampHistoricalEndYear } from './lib/historicalMarketData';
import { runMonteCarlo } from './lib/monteCarlo';
import { runSimulation, runUsIrishSimulation } from './lib/simulation';
import type { AnalysisMethod, CalculatorMode, SimulationInputs } from './lib/types';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-md border border-slate-200 bg-white p-2 sm:rounded-xl sm:p-5 sm:shadow-sm">
      <h2 className="mb-2 text-lg font-semibold text-slate-800 sm:mb-4">{title}</h2>
      {children}
    </section>
  );
}

export function CalculatorSelector({
  mode,
  onChange,
}: {
  mode: CalculatorMode;
  onChange: (mode: CalculatorMode) => void;
}) {
  const options: { value: CalculatorMode; label: string }[] = [
    { value: 'pie-vs-us', label: 'PIE vs US ETF' },
    { value: 'us-vs-irish', label: 'US ETF vs Irish ETF' },
  ];
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium text-slate-700">
        Historical comparison
      </legend>
      <div className="grid grid-cols-2 rounded-lg border border-slate-300 bg-slate-100 p-1">
        {options.map((option) => (
          <label key={option.value} className="cursor-pointer">
            <input
              type="radio"
              name="calculator-mode"
              value={option.value}
              checked={mode === option.value}
              onChange={() => onChange(option.value)}
              className="peer sr-only"
            />
            <span className="block rounded-md px-2 py-2 text-center text-xs font-medium text-slate-600 peer-checked:bg-white peer-checked:text-blue-700 peer-checked:shadow-sm peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500">
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function AnalysisMethodSelector({
  method,
  onChange,
}: {
  method: AnalysisMethod;
  onChange: (method: AnalysisMethod) => void;
}) {
  const options: { value: AnalysisMethod; label: string }[] = [
    { value: 'historical', label: 'Historical Backtest' },
    { value: 'monte-carlo', label: 'Monte Carlo Simulation' },
  ];
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium text-slate-700">Analysis method</legend>
      <div className="grid grid-cols-2 rounded-lg border border-slate-300 bg-slate-100 p-1">
        {options.map((option) => (
          <label key={option.value} className="cursor-pointer">
            <input
              type="radio"
              name="analysis-method"
              value={option.value}
              checked={method === option.value}
              onChange={() => onChange(option.value)}
              className="peer sr-only"
            />
            <span className="block rounded-md px-2 py-2 text-center text-xs font-medium text-slate-600 peer-checked:bg-white peer-checked:text-blue-700 peer-checked:shadow-sm peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500">
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function App() {
  const [inputs, setInputs] = useState<SimulationInputs>(DEFAULT_INPUTS);
  const [analysisMethod, setAnalysisMethod] = useState<AnalysisMethod>('historical');
  const [mode, setMode] = useState<CalculatorMode>('pie-vs-us');
  const [expandedYear, setExpandedYear] = useState<number | null>(null);

  const historicalResult = useMemo(
    () => (mode === 'pie-vs-us' ? runSimulation(inputs) : runUsIrishSimulation(inputs)),
    [inputs, mode],
  );
  const monteCarloResult = useMemo(
    () => (analysisMethod === 'monte-carlo' ? runMonteCarlo(inputs) : null),
    [analysisMethod, inputs],
  );

  function handleChange<K extends keyof SimulationInputs>(key: K, value: SimulationInputs[K]) {
    if (key === 'horizonYears' || key === 'historicalEndYear') {
      setExpandedYear(null);
    }
    setInputs((prev) => {
      const next = { ...prev, [key]: value };
      if (key === 'horizonYears' || key === 'historicalEndYear') {
        next.historicalEndYear = clampHistoricalEndYear(
          next.historicalEndYear,
          next.horizonYears,
        );
      }
      return next;
    });
  }

  function handleToggleYear(year: number) {
    if (expandedYear !== year) {
      trackEvent('expandYearBreakdown');
    }
    setExpandedYear(expandedYear === year ? null : year);
  }

  function handleSelectTaxChartYear(year: number) {
    trackEvent('clickTaxChartYear');
    setExpandedYear(year);
  }

  return (
    <div className="mx-auto max-w-screen-2xl space-y-6 p-4 sm:p-8">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">
          {analysisMethod === 'historical' ? 'Historical Backtest' : 'Monte Carlo Simulation'}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {analysisMethod === 'historical'
            ? `Replays one actual S&P 500 period (${historicalResult.historicalStartYear}-${historicalResult.historicalEndYear}) to show what would have happened under the selected structures and calculator assumptions.`
            : 'Compares InvestNow PIE with a direct US ETF held through IBKR across historically conditioned scenarios.'}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[18rem_minmax(0,1fr)] xl:grid-cols-[19rem_minmax(0,1fr)] 2xl:grid-cols-[20rem_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-8 lg:self-start">
          <Section title="Control Panel">
            <div className="space-y-5">
              <AnalysisMethodSelector
                method={analysisMethod}
                onChange={(nextMethod) => {
                  setAnalysisMethod(nextMethod);
                  setExpandedYear(null);
                }}
              />
              {analysisMethod === 'historical' ? (
                <CalculatorSelector
                  mode={mode}
                  onChange={(nextMode) => {
                    setMode(nextMode);
                    setExpandedYear(null);
                  }}
                />
              ) : (
                <p className="rounded border border-slate-200 bg-slate-50 p-2 text-xs text-slate-600">
                  Comparison: InvestNow PIE vs direct US ETF (IBKR)
                </p>
              )}
              <ControlPanel
                analysisMethod={analysisMethod}
                mode={mode}
                inputs={inputs}
                onChange={handleChange}
              />
            </div>
          </Section>
        </aside>

        <main className="min-w-0 space-y-6">
          {analysisMethod === 'historical' ? (
            <>
              <Section title="Historical Backtest Summary">
                <SummaryDashboard result={historicalResult} />
              </Section>

              <Section title="Portfolio Balance">
                <BalanceChart result={historicalResult} />
              </Section>

              <Section title="Tax Drag (per year)">
                <p className="mb-2 text-xs text-slate-400">
                  Click a bar to open that year's breakdown below.
                </p>
                <TaxDragChart
                  result={historicalResult}
                  onSelectYear={handleSelectTaxChartYear}
                />
              </Section>

              <Section title="Year-by-Year Breakdown">
                <BreakdownTable
                  result={historicalResult}
                  expandedYear={expandedYear}
                  onToggle={handleToggleYear}
                />
              </Section>
            </>
          ) : monteCarloResult ? (
            <Section title="Monte Carlo Distribution Results">
              <MonteCarloResults result={monteCarloResult} />
            </Section>
          ) : null}
        </main>
      </div>

      <footer className="pb-8 text-center text-xs text-slate-400">
        Illustrative model only — not financial or tax advice. Assumes fixed constants per the
        project specification.
      </footer>
    </div>
  );
}
