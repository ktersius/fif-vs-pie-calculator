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
import type { SimulationResult } from '../lib/types';

interface Props {
  result: SimulationResult;
}

export default function BalanceChart({ result }: Props) {
  const data = result.investNow.records.map((rec, i) => ({
    period: rec.calendarYear ?? 'Initial',
    portfolioYear: rec.year,
    priceReturn: rec.priceReturn,
    InvestNow: Math.round(rec.closingBalance),
    IBKR: Math.round(result.ibkr.records[i].closingBalance),
  }));

  return (
    <div>
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
          <Area type="monotone" dataKey="InvestNow" stroke="#2563eb" fill="url(#inGrad)" strokeWidth={2} />
          <Area type="monotone" dataKey="IBKR" stroke="#16a34a" fill="url(#ibGrad)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
