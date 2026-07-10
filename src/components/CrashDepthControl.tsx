import { CRASH_SEVERITY_OUTER_MAX, CRASH_SEVERITY_OUTER_MIN } from '../lib/constants';
import { formatPercent } from '../lib/format';

interface Props {
  year: number;
  /** Effective depth applied this year (drop fraction). */
  depth: number;
  /** Whether the current depth is a manual override (vs a band default). */
  isOverride: boolean;
  onChange: (year: number, depth: number) => void;
  onReset: (year: number) => void;
}

/**
 * Shared crash-depth adjustment control. Presentation-only over the App's
 * override state, so every mount point (breakdown row, chart popover) stays in
 * sync. Adjusting re-runs the simulation via the supplied handlers.
 */
export default function CrashDepthControl({ year, depth, isOverride, onChange, onReset }: Props) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-medium text-slate-600">
          Crash depth: <span className="tabular-nums font-semibold text-red-700">−{formatPercent(depth)}</span>
        </span>
        <span
          className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
            isOverride ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
          }`}
        >
          {isOverride ? 'override' : 'default'}
        </span>
      </div>
      <input
        type="range"
        min={CRASH_SEVERITY_OUTER_MIN}
        max={CRASH_SEVERITY_OUTER_MAX}
        step={0.005}
        value={depth}
        onChange={(e) => onChange(year, Number(e.target.value))}
        className="w-full accent-red-600"
      />
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-slate-400">
          {formatPercent(CRASH_SEVERITY_OUTER_MIN)} – {formatPercent(CRASH_SEVERITY_OUTER_MAX)} drop
        </span>
        <button
          type="button"
          disabled={!isOverride}
          onClick={() => onReset(year)}
          className="rounded px-2 py-0.5 text-[10px] font-medium text-slate-600 underline-offset-2 hover:underline disabled:cursor-not-allowed disabled:text-slate-300 disabled:no-underline"
        >
          Reset to default
        </button>
      </div>
    </div>
  );
}
