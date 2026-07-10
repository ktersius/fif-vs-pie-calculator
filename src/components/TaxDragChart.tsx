import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatNZD } from '../lib/format';
import type { SimulationResult } from '../lib/types';

interface Props {
  result: SimulationResult;
  onSelectYear: (year: number) => void;
}

export default function TaxDragChart({ result, onSelectYear }: Props) {
  // Skip Year 0 (no tax levied).
  const data = result.investNow.records.slice(1).map((rec, i) => ({
    year: rec.year,
    InvestNow: Math.round(rec.tax),
    IBKR: Math.round(result.ibkr.records[i + 1].tax),
    crash: rec.isCrashYear,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="year" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} width={80} tickFormatter={(v) => formatNZD(v)} />
        <Tooltip
          formatter={(v: number) => formatNZD(v)}
          labelFormatter={(l) => {
            const row = data.find((d) => d.year === l);
            return `Year ${l}${row?.crash ? ' (crash)' : ''}`;
          }}
        />
        <Legend />
        <Bar
          dataKey="InvestNow"
          fill="#2563eb"
          cursor="pointer"
          onClick={(d: { year: number }) => onSelectYear(d.year)}
        />
        <Bar
          dataKey="IBKR"
          fill="#16a34a"
          cursor="pointer"
          onClick={(d: { year: number }) => onSelectYear(d.year)}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
