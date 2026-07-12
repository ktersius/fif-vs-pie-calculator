import { Fragment } from 'react';
import { formatNZD, formatPercent } from '../lib/format';
import type {
  FeeYearDetail,
  FifTaxDetail,
  IbkrYearRecord,
  InvestNowYearRecord,
  OrderFee,
  PieTaxDetail,
  SimulationResult,
} from '../lib/types';
import CrashDepthControl from './CrashDepthControl';

interface Props {
  result: SimulationResult;
  expandedYear: number | null;
  onToggle: (year: number) => void;
  overrides: Record<number, number>;
  onSetOverride: (year: number, depth: number) => void;
  onResetOverride: (year: number) => void;
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`flex justify-between gap-4 py-0.5 ${strong ? 'font-semibold text-slate-800' : 'text-slate-600'}`}>
      <span>{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded border border-slate-200 bg-slate-50 p-3 text-sm">
      <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</div>
      {children}
    </div>
  );
}

function PieTaxPanel({ detail }: { detail: PieTaxDetail }) {
  return (
    <Panel title="PIE tax (FDR)">
      <Row label="Opening balance" value={formatNZD(detail.openingBalance)} />
      <Row label="Taxable income (x5%)" value={formatNZD(detail.taxableIncome)} />
      <Row label={`PIR (${(detail.pir * 100).toFixed(2)}%)`} value="" />
      <Row label="PIE tax owed" value={formatNZD(detail.taxOwed)} strong />
    </Panel>
  );
}

function FifTaxPanel({ detail }: { detail: FifTaxDetail }) {
  return (
    <Panel title={`FIF tax — ${detail.regime === 'fif' ? 'FIF regime' : 'de minimis exempt'}`}>
      <Row label="Cost base" value={formatNZD(detail.costBase)} />
      <Row label="Gross dividends" value={formatNZD(detail.grossDividends)} />
      <Row label="Foreign tax credit" value={formatNZD(detail.ftc)} />
      {detail.regime === 'exempt' ? (
        <>
          <Row label="NZ gross tax" value={formatNZD(detail.nzGrossTax ?? 0)} />
          <Row label="Net tax owed" value={formatNZD(detail.netTax)} strong />
        </>
      ) : (
        <div className="mt-2 grid grid-cols-2 gap-3">
          <div className={`rounded p-2 ${detail.selectedMethod === 'FDR' ? 'bg-blue-100 ring-1 ring-blue-300' : 'bg-white'}`}>
            <div className="text-xs font-semibold text-slate-500">
              FDR {detail.selectedMethod === 'FDR' ? '(applied)' : ''}
            </div>
            <Row label="Income" value={formatNZD(detail.fdrIncome ?? 0)} />
            <Row label="Gross tax" value={formatNZD(detail.fdrGrossTax ?? 0)} />
            <Row label="Net tax" value={formatNZD(detail.fdrNetTax ?? 0)} strong />
          </div>
          <div className={`rounded p-2 ${detail.selectedMethod === 'CV' ? 'bg-green-100 ring-1 ring-green-300' : 'bg-white'}`}>
            <div className="text-xs font-semibold text-slate-500">
              CV {detail.selectedMethod === 'CV' ? '(applied)' : ''}
            </div>
            <Row label="Income" value={formatNZD(detail.cvIncome ?? 0)} />
            <Row label="Gross tax" value={formatNZD(detail.cvGrossTax ?? 0)} />
            <Row label="Net tax" value={formatNZD(detail.cvNetTax ?? 0)} strong />
          </div>
        </div>
      )}
      {detail.regime === 'fif' ? (
        <div className="mt-2">
          <Row label="Net tax owed (lesser)" value={formatNZD(detail.netTax)} strong />
        </div>
      ) : null}
    </Panel>
  );
}

function OrderRow({ label, order }: { label: string; order: OrderFee }) {
  return (
    <div className="mb-2">
      <div className="text-xs font-medium text-slate-500">{label}</div>
      <Row label="Gross order" value={formatNZD(order.gross, true)} />
      {order.fxFee > 0 ? <Row label="FX fee" value={formatNZD(order.fxFee, true)} /> : null}
      <Row label="Brokerage / buy fee" value={formatNZD(order.brokerageFee, true)} />
      <Row label="Net" value={formatNZD(order.net, true)} strong />
    </div>
  );
}

function FeePanel({ fees }: { fees: FeeYearDetail }) {
  return (
    <Panel title="Fees">
      {fees.representativeOrder ? (
        <OrderRow
          label={`Representative order (x${fees.orderCount} identical)`}
          order={fees.representativeOrder}
        />
      ) : null}
      {fees.oneOffOrder ? (
        <OrderRow label={fees.oneOffLabel ?? 'One-off order'} order={fees.oneOffOrder} />
      ) : null}
      <div className="mt-2 border-t border-slate-200 pt-1">
        {fees.transactionFees > 0 ? (
          <Row label="Transaction (annual)" value={formatNZD(fees.transactionFees)} />
        ) : null}
        {fees.fxFees > 0 ? <Row label="FX (annual)" value={formatNZD(fees.fxFees)} /> : null}
        {fees.brokerageFees > 0 ? (
          <Row label="Brokerage (annual)" value={formatNZD(fees.brokerageFees)} />
        ) : null}
        <Row label="Management" value={formatNZD(fees.managementFee, true)} />
      </div>
    </Panel>
  );
}

function ExpandedYear({
  inv,
  ibkr,
  overrides,
  onSetOverride,
  onResetOverride,
}: {
  inv: InvestNowYearRecord;
  ibkr: IbkrYearRecord;
  overrides: Record<number, number>;
  onSetOverride: (year: number, depth: number) => void;
  onResetOverride: (year: number) => void;
}) {
  return (
    <div className="border-t border-slate-200 bg-white p-4">
      {inv.isCrashYear ? (
        <div className="mb-4 max-w-sm rounded border border-red-200 bg-red-50 p-3">
          <CrashDepthControl
            year={inv.year}
            depth={ibkr.crashDepth}
            isOverride={overrides[inv.year] !== undefined}
            onChange={onSetOverride}
            onReset={onResetOverride}
          />
        </div>
      ) : null}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="text-sm font-semibold text-blue-700">InvestNow (PIE)</div>
          {inv.taxDetail ? <PieTaxPanel detail={inv.taxDetail} /> : null}
          <FeePanel fees={inv.fees} />
        </div>
        <div className="space-y-3">
          <div className="text-sm font-semibold text-green-700">IBKR (FIF)</div>
          {ibkr.taxDetail ? <FifTaxPanel detail={ibkr.taxDetail} /> : null}
          <FeePanel fees={ibkr.fees} />
        </div>
      </div>
    </div>
  );
}

export default function BreakdownTable({
  result,
  expandedYear,
  onToggle,
  overrides,
  onSetOverride,
  onResetOverride,
}: Props) {
  return (
    <div className="max-w-full overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full table-fixed text-sm sm:min-w-[44rem] sm:table-auto">
        <thead className="bg-slate-100 text-left text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="w-12 px-2 py-2 sm:w-auto sm:px-3">Year</th>
            <th className="hidden px-3 py-2 text-right sm:table-cell">InvestNow balance</th>
            <th className="hidden px-3 py-2 text-right sm:table-cell">IBKR balance</th>
            <th className="px-2 py-2 text-right sm:px-3" aria-label="InvestNow tax">
              <span className="sm:hidden">InvestNow</span>
              <span className="hidden sm:inline">InvestNow tax</span>
            </th>
            <th className="px-2 py-2 text-right sm:px-3" aria-label="IBKR tax">
              <span className="sm:hidden">IBKR</span>
              <span className="hidden sm:inline">IBKR tax</span>
            </th>
            <th className="w-8 px-1 py-2 sm:w-auto sm:px-3" />
          </tr>
        </thead>
        <tbody>
          {result.investNow.records.map((inv, i) => {
            const ibkr = result.ibkr.records[i];
            const expanded = expandedYear === inv.year;
            return (
              <Fragment key={inv.year}>
                <tr
                  key={`row-${inv.year}`}
                  className={`cursor-pointer border-t border-slate-100 hover:bg-slate-50 ${
                    expanded ? 'bg-slate-50' : ''
                  }`}
                  onClick={() => onToggle(inv.year)}
                >
                  <td className="w-12 px-2 py-2 font-medium text-slate-700 sm:w-auto sm:px-3">
                    {inv.year}
                    {inv.isCrashYear ? (
                      <span
                        className="mt-1 block w-fit whitespace-nowrap rounded bg-red-100 px-1 py-0.5 text-[0.65rem] font-semibold leading-none text-red-700 sm:ml-2 sm:mt-0 sm:inline-block sm:px-1.5 sm:text-xs sm:leading-normal"
                        aria-label={`crash −${formatPercent(ibkr.crashDepth)}`}
                      >
                        <span className="sm:hidden">−{formatPercent(ibkr.crashDepth)}</span>
                        <span className="hidden sm:inline">crash −{formatPercent(ibkr.crashDepth)}</span>
                      </span>
                    ) : null}
                  </td>
                  <td className="hidden px-3 py-2 text-right tabular-nums sm:table-cell">{formatNZD(inv.closingBalance)}</td>
                  <td className="hidden px-3 py-2 text-right tabular-nums sm:table-cell">{formatNZD(ibkr.closingBalance)}</td>
                  <td className="px-2 py-2 text-right tabular-nums sm:px-3">{formatNZD(inv.tax)}</td>
                  <td className="px-2 py-2 text-right tabular-nums sm:px-3">{formatNZD(ibkr.tax)}</td>
                  <td className="w-8 px-1 py-2 text-right text-slate-400 sm:w-auto sm:px-3">{expanded ? '▲' : '▼'}</td>
                </tr>
                {expanded ? (
                  <tr key={`detail-${inv.year}`}>
                    <td colSpan={6} className="p-0">
                      <ExpandedYear
                        inv={inv}
                        ibkr={ibkr}
                        overrides={overrides}
                        onSetOverride={onSetOverride}
                        onResetOverride={onResetOverride}
                      />
                    </td>
                  </tr>
                ) : null}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
