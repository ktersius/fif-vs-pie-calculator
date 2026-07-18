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
import type { CalculatorResult } from '../lib/types';

interface Props {
  result: CalculatorResult;
  onSelectYear: (year: number) => void;
}

export default function TaxDragChart({ result, onSelectYear }: Props) {
  // Skip Year 0 (no tax levied).
  const data = result.left.records.slice(1).map((rec, i) => ({
    calendarYear: rec.calendarYear,
    portfolioYear: rec.year,
    left: Math.round(rec.tax),
    right: Math.round(result.right.records[i + 1].tax),
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="calendarYear" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} width={80} tickFormatter={(v) => formatNZD(v)} />
        <Tooltip
          formatter={(v: number) => formatNZD(v)}
          labelFormatter={(l) => {
            const row = data.find((d) => d.calendarYear === l);
            return `${l} (Year ${row?.portfolioYear})`;
          }}
        />
        <Legend />
        <Bar
          dataKey="left"
          name={result.left.shortLabel}
          fill={result.left.color}
          cursor="pointer"
          onClick={(d: { portfolioYear: number }) => onSelectYear(d.portfolioYear)}
        />
        <Bar
          dataKey="right"
          name={result.right.shortLabel}
          fill={result.right.color}
          cursor="pointer"
          onClick={(d: { portfolioYear: number }) => onSelectYear(d.portfolioYear)}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
