import { MAX_HORIZON, MIN_HORIZON } from '../lib/constants';
import { FREQUENCIES, MARGINAL_RATES, PIR_RATES } from '../lib/defaults';
import {
  EARLIEST_HISTORICAL_YEAR,
  LATEST_HISTORICAL_YEAR,
} from '../lib/historicalMarketData';
import { formatNZD, formatPercent } from '../lib/format';
import type { CalculatorMode, Frequency, FxMode, SimulationInputs } from '../lib/types';

interface Props {
  mode: CalculatorMode;
  inputs: SimulationInputs;
  onChange: <K extends keyof SimulationInputs>(key: K, value: SimulationInputs[K]) => void;
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

export default function ControlPanel({ mode, inputs, onChange }: Props) {
  const historicalStartYear = inputs.historicalEndYear - inputs.horizonYears + 1;
  const minimumEndYear = EARLIEST_HISTORICAL_YEAR + inputs.horizonYears - 1;

  return (
    <div className="grid grid-cols-1 gap-5">
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
          className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm"
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

      <Field
        label="Historical Period"
        hint={`${historicalStartYear} - ${inputs.historicalEndYear}`}
      >
        <Slider
          min={minimumEndYear}
          max={LATEST_HISTORICAL_YEAR}
          step={1}
          value={inputs.historicalEndYear}
          onChange={(v) => onChange('historicalEndYear', v)}
        />
        <div className="flex justify-between text-xs font-medium tabular-nums text-slate-500">
          <span>{historicalStartYear}</span>
          <span>{inputs.historicalEndYear}</span>
        </div>
      </Field>

      <Field label="Marginal Income Tax Rate">
        <select
          value={inputs.marginalRate}
          onChange={(e) => onChange('marginalRate', Number(e.target.value))}
          className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm"
        >
          {MARGINAL_RATES.map((r) => (
            <option key={r} value={r}>
              {formatPercent(r)}
            </option>
          ))}
        </select>
      </Field>

      {mode === 'pie-vs-us' ? (
        <Field label="PIE PIR (Prescribed Investor Rate)">
          <select
            value={inputs.pir}
            onChange={(e) => onChange('pir', Number(e.target.value))}
            className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm"
          >
            {PIR_RATES.map((r) => (
              <option key={r} value={r}>
                {formatPercent(r)}
              </option>
            ))}
          </select>
        </Field>
      ) : (
        <>
          <Field label="FX Conversion">
            <select
              value={inputs.fxMode}
              onChange={(e) => onChange('fxMode', e.target.value as FxMode)}
              className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm"
            >
              <option value="auto">Auto Conversion (0.03%)</option>
              <option value="manual">Manual Spot (USD $2 minimum)</option>
            </select>
          </Field>
          <p className="rounded border border-amber-200 bg-amber-50 p-2 text-xs text-amber-800">
            Assumes the investor is subject to FIF for every simulated year.
          </p>
        </>
      )}
    </div>
  );
}
