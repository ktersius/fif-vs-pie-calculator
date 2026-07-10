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
import { formatNZD } from '../lib/format';
import type { SimulationResult } from '../lib/types';

export default function BalanceChart({ result }: { result: SimulationResult }) {
  const data = result.investNow.records.map((rec, i) => ({
    year: rec.year,
    InvestNow: Math.round(rec.closingBalance),
    IBKR: Math.round(result.ibkr.records[i].closingBalance),
  }));

  return (
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
      </AreaChart>
    </ResponsiveContainer>
  );
}
