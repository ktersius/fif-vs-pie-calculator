import { formatNZD } from '../lib/format';
import type { CalculatorResult, PlatformResult } from '../lib/types';

function Card({
  title,
  left,
  right,
  result,
  highlight,
}: {
  title: string;
  left: string;
  right: string;
  result: CalculatorResult;
  highlight?: boolean;
}) {
  return (
    <div className={`rounded-lg border p-4 ${highlight ? 'border-slate-300 bg-white shadow-sm' : 'border-slate-200 bg-white'}`}>
      <h3 className="text-sm font-medium text-slate-500">{title}</h3>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <div>
          <div
            className="text-xs font-medium uppercase tracking-wide"
            style={{ color: result.left.color }}
          >
            {result.left.shortLabel}
          </div>
          <div className="text-lg font-semibold text-slate-800">{left}</div>
        </div>
        <div>
          <div
            className="text-xs font-medium uppercase tracking-wide"
            style={{ color: result.right.color }}
          >
            {result.right.shortLabel}
          </div>
          <div className="text-lg font-semibold text-slate-800">{right}</div>
        </div>
      </div>
    </div>
  );
}

function FeeBreakdown({ platform }: { platform: PlatformResult }) {
  const { fees } = platform.summary;
  const rows: [string, number][] = [
    ['Transaction', fees.transaction],
    ['FX', fees.fx],
    ['Brokerage', fees.brokerage],
    ['Management', fees.management],
  ];
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {platform.label}
      </div>
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

export default function SummaryDashboard({ result }: { result: CalculatorResult }) {
  const { left, right } = result;
  const winner =
    right.summary.finalBalance > left.summary.finalBalance
      ? right.shortLabel
      : left.shortLabel;
  const hasInheritedWealth =
    left.summary.inheritedWealth && right.summary.inheritedWealth;

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
          left={formatNZD(result.totalPrincipal)}
          right={formatNZD(result.totalPrincipal)}
          result={result}
        />
        <Card
          title="Final Net Balance"
          left={formatNZD(left.summary.finalBalance)}
          right={formatNZD(right.summary.finalBalance)}
          result={result}
          highlight
        />
        <Card
          title="Total NZ Tax Paid"
          left={formatNZD(left.summary.totalTax)}
          right={formatNZD(right.summary.totalTax)}
          result={result}
        />
      </div>

      {hasInheritedWealth ? (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card
              title="Inherited Wealth (death at horizon)"
              left={formatNZD(left.summary.inheritedWealth!.inheritedBalance)}
              right={formatNZD(right.summary.inheritedWealth!.inheritedBalance)}
              result={result}
              highlight
            />
            <Card
              title="Illustrative US Estate Tax"
              left={formatNZD(left.summary.inheritedWealth!.estateTax)}
              right={formatNZD(right.summary.inheritedWealth!.estateTax)}
              result={result}
            />
          </div>
          <p className="text-xs text-slate-400">
            Illustrative no-deductions estate scenario, calculated separately from ordinary
            liquidation balances.
          </p>
        </>
      ) : null}

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-slate-500">Total Fees Paid (itemised)</h3>
          <span className="text-xs text-slate-400">
            Higher final balance: <span className="font-semibold text-slate-700">{winner}</span>
          </span>
        </div>
        <div className="mt-3 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <FeeBreakdown platform={left} />
          <FeeBreakdown platform={right} />
        </div>
      </div>
    </div>
  );
}
