import { useMemo, useState } from 'react';
import BalanceChart from './components/BalanceChart';
import BreakdownTable from './components/BreakdownTable';
import ControlPanel from './components/ControlPanel';
import SummaryDashboard from './components/SummaryDashboard';
import TaxDragChart from './components/TaxDragChart';
import { MAX_CRASH_YEARS } from './lib/constants';
import { DEFAULT_INPUTS, newSeed } from './lib/defaults';
import { runSimulation } from './lib/simulation';
import type { SimulationInputs } from './lib/types';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-slate-800">{title}</h2>
      {children}
    </section>
  );
}

export default function App() {
  const [inputs, setInputs] = useState<SimulationInputs>(DEFAULT_INPUTS);
  const [expandedYear, setExpandedYear] = useState<number | null>(null);

  const result = useMemo(() => runSimulation(inputs), [inputs]);

  const crashYearsMax = Math.min(MAX_CRASH_YEARS, inputs.horizonYears);

  function handleChange<K extends keyof SimulationInputs>(key: K, value: SimulationInputs[K]) {
    setInputs((prev) => {
      const next = { ...prev, [key]: value };
      // Clamp crash years so they never exceed the horizon.
      if (key === 'horizonYears' || key === 'crashYears') {
        const cap = Math.min(MAX_CRASH_YEARS, next.horizonYears);
        next.crashYears = Math.min(next.crashYears, cap);
      }
      return next;
    });
  }

  function handleReroll() {
    setInputs((prev) => ({ ...prev, crashSeed: newSeed() }));
  }

  function handleToggleYear(year: number) {
    setExpandedYear((prev) => (prev === year ? null : year));
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-8">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">NZ FIF vs PIE Calculator</h1>
        <p className="mt-1 text-sm text-slate-500">
          20-year (configurable) comparison of an InvestNow Foundation Series PIE fund versus a
          direct US ETF held through Interactive Brokers under the FIF regime.
        </p>
      </header>

      <Section title="Control Panel">
        <ControlPanel
          inputs={inputs}
          crashYearsMax={crashYearsMax}
          onChange={handleChange}
          onReroll={handleReroll}
        />
      </Section>

      <Section title="Summary">
        <SummaryDashboard result={result} />
      </Section>

      <Section title="Portfolio Balance">
        <BalanceChart result={result} />
      </Section>

      <Section title="Tax Drag (per year)">
        <p className="mb-2 text-xs text-slate-400">Click a bar to open that year's breakdown below.</p>
        <TaxDragChart result={result} onSelectYear={setExpandedYear} />
      </Section>

      <Section title="Year-by-Year Breakdown">
        <BreakdownTable result={result} expandedYear={expandedYear} onToggle={handleToggleYear} />
      </Section>

      <footer className="pb-8 text-center text-xs text-slate-400">
        Illustrative model only — not financial or tax advice. Assumes fixed constants per the
        project specification.
      </footer>
    </div>
  );
}
