import { formatNZD } from '../lib/format';
import type { FeeSummary, SimulationResult } from '../lib/types';

function Card({
  title,
  investNow,
  ibkr,
  highlight,
}: {
  title: string;
  investNow: string;
  ibkr: string;
  highlight?: boolean;
}) {
  return (
    <div className={`rounded-lg border p-4 ${highlight ? 'border-slate-300 bg-white shadow-sm' : 'border-slate-200 bg-white'}`}>
      <h3 className="text-sm font-medium text-slate-500">{title}</h3>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-blue-600">InvestNow</div>
          <div className="text-lg font-semibold text-slate-800">{investNow}</div>
        </div>
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-green-600">IBKR</div>
          <div className="text-lg font-semibold text-slate-800">{ibkr}</div>
        </div>
      </div>
    </div>
  );
}

function FeeBreakdown({ label, fees }: { label: string; fees: FeeSummary }) {
  const rows: [string, number][] = [
    ['Transaction', fees.transaction],
    ['FX', fees.fx],
    ['Brokerage', fees.brokerage],
    ['Management', fees.management],
  ];
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</div>
      <table className="mt-1 w-full text-sm">
        <tbody>
          {rows.map(([name, value]) => (
            <tr key={name} className="text-slate-600">
              <td className="py-0.5">{name}</td>
              <td className="py-0.5 text-right tabular-nums">{formatNZD(value)}</td>
            </tr>
          ))}
          <tr className="border-t border-slate-200 font-semibold text-slate-800">
            <td className="py-1">Total</td>
            <td className="py-1 text-right tabular-nums">{formatNZD(fees.total)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default function SummaryDashboard({ result }: { result: SimulationResult }) {
  const { investNow, ibkr } = result;
  const winner =
    ibkr.summary.finalBalance > investNow.summary.finalBalance ? 'IBKR' : 'InvestNow';

  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-500">
        Historical period:{' '}
        <span className="font-semibold text-slate-700">
          {result.historicalStartYear}-{result.historicalEndYear}
        </span>{' '}
        · S&amp;P 500 price and dividend returns via{' '}
        <a
          href="https://www.slickcharts.com/sp500/returns/details"
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-2 hover:text-slate-700"
        >
          SlickCharts
        </a>
      </p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card
          title="Total Principal Contributed"
          investNow={formatNZD(result.totalPrincipal)}
          ibkr={formatNZD(result.totalPrincipal)}
        />
        <Card
          title="Final Net Balance"
          investNow={formatNZD(investNow.summary.finalBalance)}
          ibkr={formatNZD(ibkr.summary.finalBalance)}
          highlight
        />
        <Card
          title="Total NZ Tax Paid"
          investNow={formatNZD(investNow.summary.totalTax)}
          ibkr={formatNZD(ibkr.summary.totalTax)}
        />
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-slate-500">Total Fees Paid (itemised)</h3>
          <span className="text-xs text-slate-400">
            Higher final balance: <span className="font-semibold text-slate-700">{winner}</span>
          </span>
        </div>
        <div className="mt-3 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <FeeBreakdown label="InvestNow" fees={investNow.summary.fees} />
          <FeeBreakdown label="IBKR" fees={ibkr.summary.fees} />
        </div>
      </div>
    </div>
  );
}
