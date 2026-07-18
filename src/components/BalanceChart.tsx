import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatNZD, formatPercent } from '../lib/format';
import type { CalculatorResult } from '../lib/types';

interface Props {
  result: CalculatorResult;
}

export default function BalanceChart({ result }: Props) {
  const data = result.left.records.map((rec, i) => ({
    period: rec.calendarYear ?? 'Initial',
    portfolioYear: rec.year,
    priceReturn: rec.priceReturn,
    left: Math.round(rec.closingBalance),
    right: Math.round(result.right.records[i].closingBalance),
  }));

  return (
    <div>
      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="inGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={result.left.color} stopOpacity={0.4} />
              <stop offset="95%" stopColor={result.left.color} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="ibGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={result.right.color} stopOpacity={0.4} />
              <stop offset="95%" stopColor={result.right.color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="period"
            tick={{ fontSize: 12 }}
            label={{ value: 'Calendar year', position: 'insideBottom', offset: -2, fontSize: 12 }}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            width={80}
            tickFormatter={(v) => formatNZD(v)}
          />
          <Tooltip
            formatter={(value: number) => formatNZD(value)}
            labelFormatter={(label) => {
              const row = data.find((item) => item.period === label);
              return row?.portfolioYear === 0
                ? 'Initial state (Year 0)'
                : `${label} (Year ${row?.portfolioYear}) · Price return ${formatPercent(
                    row?.priceReturn ?? 0,
                  )}`;
            }}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="left"
            name={result.left.shortLabel}
            stroke={result.left.color}
            fill="url(#inGrad)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="right"
            name={result.right.shortLabel}
            stroke={result.right.color}
            fill="url(#ibGrad)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
