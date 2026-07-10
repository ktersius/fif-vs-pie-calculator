import {
  CRASH_SEVERITY_OUTER_MAX,
  CRASH_SEVERITY_OUTER_MIN,
  MAX_CRASH_YEARS,
  MAX_HORIZON,
  MIN_HORIZON,
} from '../lib/constants';
import { FREQUENCIES, MARGINAL_RATES, PIR_RATES } from '../lib/defaults';
import { formatNZD, formatPercent } from '../lib/format';
import type { Frequency, SimulationInputs } from '../lib/types';

interface Props {
  inputs: SimulationInputs;
  crashYearsMax: number;
  onChange: <K extends keyof SimulationInputs>(key: K, value: SimulationInputs[K]) => void;
  onReroll: () => void;
}

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {children}
      {hint ? <span className="text-xs text-slate-400">{hint}</span> : null}
    </label>
  );
}

function Slider({
  min,
  max,
  step,
  value,
  onChange,
}: {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full accent-blue-600"
    />
  );
}

function DualRange({
  min,
  max,
  step,
  low,
  high,
  onChange,
}: {
  min: number;
  max: number;
  step: number;
  low: number;
  high: number;
  onChange: (low: number, high: number) => void;
}) {
  const span = max - min;
  const lowPct = ((low - min) / span) * 100;
  const highPct = ((high - min) / span) * 100;
  return (
    <div className="dual-range">
      <div className="dual-range-track" />
      <div
        className="dual-range-fill"
        style={{ left: `${lowPct}%`, width: `${highPct - lowPct}%` }}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={low}
        onChange={(e) => onChange(Math.min(Number(e.target.value), high), high)}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={high}
        onChange={(e) => onChange(low, Math.max(Number(e.target.value), low))}
      />
    </div>
  );
}

export default function ControlPanel({ inputs, crashYearsMax, onChange, onReroll }: Props) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <Field label="Initial Investment" hint={formatNZD(inputs.initialInvestment)}>
        <Slider
          min={0}
          max={500_000}
          step={1_000}
          value={inputs.initialInvestment}
          onChange={(v) => onChange('initialInvestment', v)}
        />
      </Field>

      <Field label="Periodic Contribution" hint={formatNZD(inputs.periodicContribution)}>
        <Slider
          min={0}
          max={10_000}
          step={50}
          value={inputs.periodicContribution}
          onChange={(v) => onChange('periodicContribution', v)}
        />
      </Field>

      <Field label="Contribution Frequency">
        <select
          value={inputs.frequency}
          onChange={(e) => onChange('frequency', e.target.value as Frequency)}
          className="rounded border border-slate-300 bg-white px-3 py-2 text-sm"
        >
          {FREQUENCIES.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Investment Horizon" hint={`${inputs.horizonYears} years`}>
        <Slider
          min={MIN_HORIZON}
          max={MAX_HORIZON}
          step={1}
          value={inputs.horizonYears}
          onChange={(v) => onChange('horizonYears', v)}
        />
      </Field>

      <Field label="Expected Annual Market Return" hint={formatPercent(inputs.marketReturn)}>
        <Slider
          min={0.04}
          max={0.15}
          step={0.005}
          value={inputs.marketReturn}
          onChange={(v) => onChange('marketReturn', v)}
        />
      </Field>

      <Field label="Dividend Yield" hint={formatPercent(inputs.dividendYield)}>
        <Slider
          min={0}
          max={0.05}
          step={0.001}
          value={inputs.dividendYield}
          onChange={(v) => onChange('dividendYield', v)}
        />
      </Field>

      <Field label="Marginal Income Tax Rate">
        <select
          value={inputs.marginalRate}
          onChange={(e) => onChange('marginalRate', Number(e.target.value))}
          className="rounded border border-slate-300 bg-white px-3 py-2 text-sm"
        >
          {MARGINAL_RATES.map((r) => (
            <option key={r} value={r}>
              {formatPercent(r)}
            </option>
          ))}
        </select>
      </Field>

      <Field label="PIE PIR (Prescribed Investor Rate)">
        <select
          value={inputs.pir}
          onChange={(e) => onChange('pir', Number(e.target.value))}
          className="rounded border border-slate-300 bg-white px-3 py-2 text-sm"
        >
          {PIR_RATES.map((r) => (
            <option key={r} value={r}>
              {formatPercent(r)}
            </option>
          ))}
        </select>
      </Field>

      <Field
        label="Number of Crash Years"
        hint={`${inputs.crashYears} of ${inputs.horizonYears} years (max ${Math.min(
          MAX_CRASH_YEARS,
          crashYearsMax,
        )})`}
      >
        <Slider
          min={0}
          max={Math.min(MAX_CRASH_YEARS, crashYearsMax)}
          step={1}
          value={inputs.crashYears}
          onChange={(v) => onChange('crashYears', v)}
        />
      </Field>

      <Field
        label="Crash Severity Band"
        hint={`${formatPercent(inputs.crashSeverityMin)} \u2013 ${formatPercent(
          inputs.crashSeverityMax,
        )} drop`}
      >
        <DualRange
          min={CRASH_SEVERITY_OUTER_MIN}
          max={CRASH_SEVERITY_OUTER_MAX}
          step={0.005}
          low={inputs.crashSeverityMin}
          high={inputs.crashSeverityMax}
          onChange={(lo, hi) => {
            onChange('crashSeverityMin', lo);
            onChange('crashSeverityMax', hi);
          }}
        />
      </Field>

      <div className="flex items-end">
        <button
          type="button"
          onClick={onReroll}
          className="rounded bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
        >
          Re-roll crash years
        </button>
      </div>
    </div>
  );
}
