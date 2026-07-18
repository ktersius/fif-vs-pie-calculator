import { formatNZD, formatPercent } from '../lib/format';
import type {
  MonteCarloResult,
  Percentiles,
} from '../lib/monteCarlo';

const percentileRows: { key: keyof Percentiles; label: string }[] = [
  { key: 'p10', label: '10th percentile' },
  { key: 'p50', label: 'Median' },
  { key: 'p90', label: '90th percentile' },
];

function PercentileTable({
  title,
  metrics,
}: {
  title: string;
  metrics: { label: string; values: Percentiles }[];
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full min-w-[28rem] text-sm">
        <caption className="bg-slate-50 px-3 py-2 text-left font-semibold text-slate-700">
          {title}
        </caption>
        <thead>
          <tr className="border-t border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
            <th className="px-3 py-2">Percentile</th>
            {metrics.map((metric) => (
              <th key={metric.label} className="px-3 py-2 text-right">
                {metric.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {percentileRows.map(({ key, label }) => (
            <tr key={key} className="border-t border-slate-100">
              <th className="px-3 py-2 text-left font-medium text-slate-600">{label}</th>
              {metrics.map((metric) => (
                <td key={metric.label} className="px-3 py-2 text-right tabular-nums">
                  {formatNZD(metric.values[key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function MonteCarloResults({ result }: { result: MonteCarloResult }) {
  const maxBucketCount = Math.max(...result.histogram.map((bucket) => bucket.count));
  const wins = [
    {
      label: 'InvestNow PIE wins',
      card: 'border-green-200 bg-green-50',
      text: 'text-green-800',
      ...result.wins.pie,
    },
    {
      label: 'Direct US ETF wins',
      card: 'border-blue-200 bg-blue-50',
      text: 'text-blue-800',
      ...result.wins.direct,
    },
    {
      label: 'Ties',
      card: 'border-slate-200 bg-slate-50',
      text: 'text-slate-700',
      ...result.wins.ties,
    },
  ];

  return (
    <div className="space-y-6">
      <p className="rounded border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
        Historically conditioned stationary-block-bootstrap analysis of {result.runCount.toLocaleString(
          'en-NZ',
        )} paths resampled from paired annual S&amp;P 500 price and dividend records from
        SlickCharts (1957-2025). Seed {result.seed}; mean block length{' '}
        {result.meanBlockLength} years. This is not a forecast and does not predict future market,
        tax-law, or legal outcomes.
      </p>

      <div>
        <h3 className="text-base font-semibold text-slate-800">Win rates</h3>
        <p className="mt-1 text-xs text-slate-500">
          A positive final-value difference favours direct holdings.
        </p>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {wins.map((win) => (
            <div key={win.label} className={`rounded-lg border p-4 ${win.card}`}>
              <div className={`text-sm font-medium ${win.text}`}>{win.label}</div>
              <div className={`mt-1 text-xl font-semibold tabular-nums ${win.text}`}>
                {formatPercent(win.rate, 1)}
              </div>
              <div className="text-xs tabular-nums text-slate-500">
                {win.count.toLocaleString('en-NZ')} of {result.runCount.toLocaleString('en-NZ')}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <PercentileTable
          title="Final net balance"
          metrics={[
            { label: 'InvestNow PIE', values: result.finalBalances.pie },
            { label: 'Direct US ETF (IBKR)', values: result.finalBalances.direct },
          ]}
        />
        <div>
          <PercentileTable
            title="Final balance difference: Direct US ETF minus InvestNow PIE"
            metrics={[{ label: 'Direct − PIE', values: result.finalValueDifference }]}
          />
          <p className="mt-1 px-1 text-xs text-slate-500">
            Positive values mean Direct US ETF finished ahead; negative values mean InvestNow PIE
            finished ahead.
          </p>
        </div>
        <PercentileTable
          title="Total New Zealand tax"
          metrics={[
            { label: 'InvestNow PIE', values: result.totalTax.pie },
            { label: 'Direct US ETF (IBKR)', values: result.totalTax.direct },
          ]}
        />
        <PercentileTable
          title="Total fees"
          metrics={[
            { label: 'InvestNow PIE', values: result.totalFees.pie },
            { label: 'Direct US ETF (IBKR)', values: result.totalFees.direct },
          ]}
        />
      </div>

      <div>
        <h3 className="text-base font-semibold text-slate-800">
          Final-value-difference histogram
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Direct US ETF final balance minus InvestNow PIE final balance, in NZD.
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded bg-slate-50 px-3 py-2 text-xs font-medium">
          <span className="text-green-700">← PIE ahead (negative)</span>
          <span className="text-slate-600">Near tie ($0)</span>
          <span className="text-blue-700">Direct ahead (positive) →</span>
        </div>
        <div className="mt-3 overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full min-w-[36rem] text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="px-3 py-2">Difference range</th>
                <th className="px-3 py-2">Outcome</th>
                <th className="px-3 py-2 text-right">Scenarios</th>
                <th className="px-3 py-2">Distribution</th>
              </tr>
            </thead>
            <tbody>
              {result.histogram.map((bucket) => {
                const outcome =
                  bucket.min === 0 && bucket.max === 0
                    ? { label: 'Near tie', color: 'bg-slate-500', text: 'text-slate-600' }
                    : bucket.max <= 0
                      ? {
                          label: 'PIE ahead',
                          color: 'bg-green-600',
                          text: 'text-green-700',
                        }
                      : bucket.min >= 0
                        ? {
                            label: 'Direct ahead',
                            color: 'bg-blue-600',
                            text: 'text-blue-700',
                          }
                        : {
                            label: 'Near tie',
                            color: 'bg-slate-500',
                            text: 'text-slate-600',
                          };
                return (
                  <tr key={`${bucket.min}-${bucket.max}`} className="border-t border-slate-100">
                    <td className="px-3 py-1.5 tabular-nums">
                      {bucket.min === bucket.max
                        ? formatNZD(bucket.min)
                        : `${formatNZD(bucket.min)} to ${formatNZD(bucket.max)}`}
                    </td>
                    <td className={`px-3 py-1.5 font-medium ${outcome.text}`}>
                      {outcome.label}
                    </td>
                    <td className="px-3 py-1.5 text-right tabular-nums">{bucket.count}</td>
                    <td className="w-1/2 px-3 py-1.5">
                      <div className="h-3 rounded bg-slate-100" aria-hidden="true">
                        <div
                          className={`h-3 rounded ${outcome.color}`}
                          style={{ width: `${(bucket.count / maxBucketCount) * 100}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
