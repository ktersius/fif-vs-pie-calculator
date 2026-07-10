import { useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatNZD, formatPercent } from '../lib/format';
import type { SimulationResult } from '../lib/types';
import CrashDepthControl from './CrashDepthControl';

interface Props {
  result: SimulationResult;
  overrides: Record<number, number>;
  onSetOverride: (year: number, depth: number) => void;
  onResetOverride: (year: number) => void;
}

interface Marker {
  year: number;
  balance: number;
  depth: number;
}

interface Popover {
  year: number;
  x: number;
  y: number;
}

/** Custom interactive crash marker; captures pixel position on hover/click. */
function CrashDot(props: {
  cx?: number;
  cy?: number;
  marker: Marker;
  onHover: (p: Popover | null) => void;
  onOpen: (p: Popover) => void;
}) {
  const { cx, cy, marker, onHover, onOpen } = props;
  if (cx == null || cy == null) return null;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={7}
      fill="#dc2626"
      stroke="#ffffff"
      strokeWidth={2}
      style={{ cursor: 'pointer' }}
      onMouseEnter={() => onHover({ year: marker.year, x: cx, y: cy })}
      onMouseLeave={() => onHover(null)}
      onClick={() => onOpen({ year: marker.year, x: cx, y: cy })}
    />
  );
}

export default function BalanceChart({ result, overrides, onSetOverride, onResetOverride }: Props) {
  const [hover, setHover] = useState<Popover | null>(null);
  const [popover, setPopover] = useState<Popover | null>(null);

  const data = result.investNow.records.map((rec, i) => ({
    year: rec.year,
    InvestNow: Math.round(rec.closingBalance),
    IBKR: Math.round(result.ibkr.records[i].closingBalance),
  }));

  const markers: Marker[] = result.ibkr.records
    .filter((rec) => rec.isCrashYear)
    .map((rec) => ({ year: rec.year, balance: rec.closingBalance, depth: rec.crashDepth }));

  const markerByYear = new Map(markers.map((m) => [m.year, m]));
  const hoverMarker = hover ? markerByYear.get(hover.year) : undefined;
  const popMarker = popover ? markerByYear.get(popover.year) : undefined;

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="inGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="ibGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#16a34a" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="year" tick={{ fontSize: 12 }} label={{ value: 'Year', position: 'insideBottom', offset: -2, fontSize: 12 }} />
          <YAxis
            tick={{ fontSize: 12 }}
            width={80}
            tickFormatter={(v) => formatNZD(v)}
          />
          <Tooltip formatter={(v: number) => formatNZD(v)} labelFormatter={(l) => `Year ${l}`} />
          <Legend />
          <Area type="monotone" dataKey="InvestNow" stroke="#2563eb" fill="url(#inGrad)" strokeWidth={2} />
          <Area type="monotone" dataKey="IBKR" stroke="#16a34a" fill="url(#ibGrad)" strokeWidth={2} />
          {markers.map((m) => (
            <ReferenceDot
              key={m.year}
              x={m.year}
              y={Math.round(m.balance)}
              ifOverflow="extendDomain"
              shape={(dotProps: { cx?: number; cy?: number }) => (
                <CrashDot
                  cx={dotProps.cx}
                  cy={dotProps.cy}
                  marker={m}
                  onHover={setHover}
                  onOpen={(p) => {
                    setHover(null);
                    setPopover(p);
                  }}
                />
              )}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>

      {hover && hoverMarker && !popover ? (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded bg-slate-800 px-2 py-1 text-xs font-medium text-white shadow"
          style={{ left: hover.x, top: hover.y - 10 }}
        >
          Year {hover.year}: −{formatPercent(hoverMarker.depth)}
        </div>
      ) : null}

      {popover && popMarker ? (
        <div
          className="absolute z-20 w-60 -translate-x-1/2 rounded-lg border border-slate-200 bg-white p-3 shadow-lg"
          style={{ left: popover.x, top: popover.y + 12 }}
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">Crash · Year {popover.year}</span>
            <button
              type="button"
              onClick={() => setPopover(null)}
              className="text-xs text-slate-400 hover:text-slate-600"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <CrashDepthControl
            year={popover.year}
            depth={popMarker.depth}
            isOverride={overrides[popover.year] !== undefined}
            onChange={onSetOverride}
            onReset={onResetOverride}
          />
        </div>
      ) : null}
    </div>
  );
}
