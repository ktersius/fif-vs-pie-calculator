import { useMemo, useState } from 'react';
import BalanceChart from './components/BalanceChart';
import BreakdownTable from './components/BreakdownTable';
import ControlPanel from './components/ControlPanel';
import SummaryDashboard from './components/SummaryDashboard';
import TaxDragChart from './components/TaxDragChart';
import { trackEvent } from './lib/analytics';
import { DEFAULT_INPUTS } from './lib/defaults';
import { clampHistoricalEndYear } from './lib/historicalMarketData';
import { runSimulation } from './lib/simulation';
import type { SimulationInputs } from './lib/types';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-md border border-slate-200 bg-white p-2 sm:rounded-xl sm:p-5 sm:shadow-sm">
      <h2 className="mb-2 text-lg font-semibold text-slate-800 sm:mb-4">{title}</h2>
      {children}
    </section>
  );
}

export default function App() {
  const [inputs, setInputs] = useState<SimulationInputs>(DEFAULT_INPUTS);
  const [expandedYear, setExpandedYear] = useState<number | null>(null);

  const result = useMemo(() => runSimulation(inputs), [inputs]);

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
        <h1 className="text-2xl font-bold text-slate-900">NZ FIF vs PIE Calculator</h1>
        <p className="mt-1 text-sm text-slate-500">
          20-year (configurable) comparison of an InvestNow Foundation Series PIE fund versus a
          direct US ETF held through Interactive Brokers under the FIF regime.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[18rem_minmax(0,1fr)] xl:grid-cols-[19rem_minmax(0,1fr)] 2xl:grid-cols-[20rem_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-8 lg:self-start">
          <Section title="Control Panel">
            <ControlPanel inputs={inputs} onChange={handleChange} />
          </Section>
        </aside>

        <main className="min-w-0 space-y-6">
          <Section title="Summary">
            <SummaryDashboard result={result} />
          </Section>

          <Section title="Portfolio Balance">
            <BalanceChart result={result} />
          </Section>

          <Section title="Tax Drag (per year)">
            <p className="mb-2 text-xs text-slate-400">Click a bar to open that year's breakdown below.</p>
            <TaxDragChart result={result} onSelectYear={handleSelectTaxChartYear} />
          </Section>

          <Section title="Year-by-Year Breakdown">
            <BreakdownTable
              result={result}
              expandedYear={expandedYear}
              onToggle={handleToggleYear}
            />
          </Section>
        </main>
      </div>

      <footer className="pb-8 text-center text-xs text-slate-400">
        Illustrative model only — not financial or tax advice. Assumes fixed constants per the
        project specification.
      </footer>
    </div>
  );
}
