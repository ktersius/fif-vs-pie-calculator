import {
  FREQUENCY_INSTANCES,
  MANAGEMENT_FEE_RATE,
  WITHHOLDING_TAX_RATE,
} from './constants';
import {
  ibkrBrokerageFee,
  ibkrFxFee,
  ibkrOrderFee,
  investNowBuyFee,
  investNowSellFee,
} from './fees';
import { getHistoricalWindow, type HistoricalMarketYear } from './historicalMarketData';
import { fifTax, pieTax } from './tax';
import type {
  FeeSummary,
  IbkrYearRecord,
  InvestNowYearRecord,
  OrderFee,
  SimulationInputs,
  SimulationResult,
} from './types';

function emptyFeeSummary(): FeeSummary {
  return { transaction: 0, fx: 0, brokerage: 0, management: 0, total: 0 };
}

/** Simulate the InvestNow (PIE) portfolio across the horizon. */
function simulateInvestNow(
  inputs: SimulationInputs,
  marketYears: HistoricalMarketYear[],
): { records: InvestNowYearRecord[]; fees: FeeSummary; totalTax: number } {
  const { initialInvestment, periodicContribution, frequency, horizonYears, pir } = inputs;
  const instances = FREQUENCY_INSTANCES[frequency];
  const fees = emptyFeeSummary();
  let totalTax = 0;

  // Year 0: apply entry buy fee.
  const initialBuyFee = investNowBuyFee(initialInvestment);
  fees.transaction += initialBuyFee;
  let balance = initialInvestment - initialBuyFee;

  const records: InvestNowYearRecord[] = [
    {
      year: 0,
      calendarYear: null,
      priceReturn: 0,
      dividendReturn: 0,
      openingBalance: initialInvestment,
      netAnnualContribution: balance,
      growth: 0,
      grossDividends: 0,
      netDividends: 0,
      managementFee: 0,
      tax: 0,
      closingBalance: balance,
      taxDetail: null,
      fees: {
        orderCount: 0,
        oneOffOrder: { gross: initialInvestment, fxFee: 0, brokerageFee: initialBuyFee, net: balance },
        oneOffLabel: 'Initial investment (0.50% buy fee)',
        fxFees: 0,
        brokerageFees: 0,
        transactionFees: initialBuyFee,
        managementFee: 0,
      },
    },
  ];

  for (let year = 1; year <= horizonYears; year++) {
    const opening = balance;
    const marketYear = marketYears[year - 1];

    const totalContribution = periodicContribution * instances;
    const buyFee = investNowBuyFee(totalContribution);
    const netContribution = totalContribution - buyFee;

    const base = opening + netContribution;
    const growth = base * marketYear.priceReturn;
    const grossDividends = base * marketYear.dividendReturn;
    const netDividends = grossDividends * (1 - WITHHOLDING_TAX_RATE);

    let temp = base + growth + netDividends;
    const managementFee = temp * MANAGEMENT_FEE_RATE;
    temp -= managementFee;

    const taxDetail = pieTax(opening, grossDividends, pir);
    const tax = taxDetail.netTax;
    let closing = Math.max(0, temp - tax);

    const yearFees = {
      transaction: buyFee,
      fx: 0,
      brokerage: 0,
      management: managementFee,
    };

    const perOrderBuyFee = investNowBuyFee(periodicContribution);
    const representativeOrder: OrderFee | undefined =
      periodicContribution > 0
        ? {
            gross: periodicContribution,
            fxFee: 0,
            brokerageFee: perOrderBuyFee,
            net: periodicContribution - perOrderBuyFee,
          }
        : undefined;

    let oneOffOrder: OrderFee | undefined;
    let oneOffLabel: string | undefined;

    // Final-year exit fee (applied after taxation).
    if (year === horizonYears) {
      const sellFee = investNowSellFee(closing);
      const afterExit = closing - sellFee;
      oneOffOrder = { gross: closing, fxFee: 0, brokerageFee: sellFee, net: afterExit };
      oneOffLabel = 'Exit (0.50% sell fee)';
      yearFees.transaction += sellFee;
      closing = afterExit;
    }

    fees.transaction += yearFees.transaction;
    fees.management += yearFees.management;
    totalTax += tax;
    balance = closing;

    records.push({
      year,
      calendarYear: marketYear.year,
      priceReturn: marketYear.priceReturn,
      dividendReturn: marketYear.dividendReturn,
      openingBalance: opening,
      netAnnualContribution: netContribution,
      growth,
      grossDividends,
      netDividends,
      managementFee,
      tax,
      closingBalance: closing,
      taxDetail,
      fees: {
        representativeOrder,
        orderCount: periodicContribution > 0 ? instances : 0,
        oneOffOrder,
        oneOffLabel,
        fxFees: 0,
        brokerageFees: 0,
        transactionFees: yearFees.transaction,
        managementFee,
      },
    });
  }

  fees.total = fees.transaction + fees.fx + fees.brokerage + fees.management;
  return { records, fees, totalTax };
}

/** Simulate the IBKR (direct FIF) portfolio across the horizon. */
function simulateIbkr(
  inputs: SimulationInputs,
  marketYears: HistoricalMarketYear[],
): { records: IbkrYearRecord[]; fees: FeeSummary; totalTax: number } {
  const { initialInvestment, periodicContribution, frequency, horizonYears, marginalRate } = inputs;
  const instances = FREQUENCY_INSTANCES[frequency];
  const fees = emptyFeeSummary();
  let totalTax = 0;

  // Year 0: single initial order (FX + capped brokerage).
  const initialOrder = ibkrOrderFee(initialInvestment);
  fees.fx += initialOrder.fxFee;
  fees.brokerage += initialOrder.brokerageFee;
  let balance = initialOrder.net;
  let costBase = initialOrder.net; // cumulative net contributions

  const records: IbkrYearRecord[] = [
    {
      year: 0,
      calendarYear: null,
      priceReturn: 0,
      dividendReturn: 0,
      openingBalance: initialInvestment,
      netAnnualContribution: balance,
      growth: 0,
      grossDividends: 0,
      netDividends: 0,
      managementFee: 0,
      tax: 0,
      closingBalance: balance,
      taxDetail: null,
      fees: {
        orderCount: 0,
        oneOffOrder: initialOrder,
        oneOffLabel: 'Initial investment (FX + brokerage)',
        fxFees: initialOrder.fxFee,
        brokerageFees: initialOrder.brokerageFee,
        transactionFees: 0,
        managementFee: 0,
      },
    },
  ];

  for (let year = 1; year <= horizonYears; year++) {
    const opening = balance;
    const marketYear = marketYears[year - 1];

    // Per-instance fee loop.
    let netContribution = 0;
    let fxFees = 0;
    let brokerageFees = 0;
    const perOrder = periodicContribution > 0 ? ibkrOrderFee(periodicContribution) : undefined;
    for (let i = 0; i < instances && periodicContribution > 0; i++) {
      const order = ibkrOrderFee(periodicContribution);
      netContribution += order.net;
      fxFees += order.fxFee;
      brokerageFees += order.brokerageFee;
    }

    costBase += netContribution; // net contributions added to cost base

    const base = opening + netContribution;
    const growth = base * marketYear.priceReturn;
    const grossDividends = base * marketYear.dividendReturn;
    const netDividends = grossDividends * (1 - WITHHOLDING_TAX_RATE);

    let temp = base + growth + netDividends;
    const managementFee = temp * MANAGEMENT_FEE_RATE;
    temp -= managementFee;

    costBase += netDividends; // net reinvested dividends added to cost base

    const taxDetail = fifTax({
      costBase,
      openingBalance: opening,
      grossDividends,
      growth,
      managementFee,
      marginalRate,
    });
    const tax = taxDetail.netTax;
    let closing = Math.max(0, temp - tax);

    let oneOffOrder: OrderFee | undefined;
    let oneOffLabel: string | undefined;
    let exitFx = 0;
    let exitBrokerage = 0;

    if (year === horizonYears) {
      exitFx = ibkrFxFee(closing);
      exitBrokerage = ibkrBrokerageFee(closing);
      const afterExit = Math.max(0, closing - exitFx - exitBrokerage);
      oneOffOrder = {
        gross: closing,
        fxFee: exitFx,
        brokerageFee: exitBrokerage,
        net: afterExit,
      };
      oneOffLabel = 'Exit (FX + brokerage)';
      closing = afterExit;
    }

    fees.fx += fxFees + exitFx;
    fees.brokerage += brokerageFees + exitBrokerage;
    fees.management += managementFee;
    totalTax += tax;
    balance = closing;

    records.push({
      year,
      calendarYear: marketYear.year,
      priceReturn: marketYear.priceReturn,
      dividendReturn: marketYear.dividendReturn,
      openingBalance: opening,
      netAnnualContribution: netContribution,
      growth,
      grossDividends,
      netDividends,
      managementFee,
      tax,
      closingBalance: closing,
      taxDetail,
      fees: {
        representativeOrder: perOrder,
        orderCount: periodicContribution > 0 ? instances : 0,
        oneOffOrder,
        oneOffLabel,
        fxFees: fxFees + exitFx,
        brokerageFees: brokerageFees + exitBrokerage,
        transactionFees: 0,
        managementFee,
      },
    });
  }

  fees.total = fees.transaction + fees.fx + fees.brokerage + fees.management;
  return { records, fees, totalTax };
}

/**
 * Run the full 20-year (configurable) comparison. Returns per-year records for
 * both platforms plus aggregate summaries. Deterministic for a given set of
 * inputs and historical period.
 */
export function runSimulation(inputs: SimulationInputs): SimulationResult {
  const marketYears = getHistoricalWindow(inputs.historicalEndYear, inputs.horizonYears);
  const investNow = simulateInvestNow(inputs, marketYears);
  const ibkr = simulateIbkr(inputs, marketYears);

  const instances = FREQUENCY_INSTANCES[inputs.frequency];
  const totalPrincipal =
    inputs.initialInvestment + inputs.periodicContribution * instances * inputs.horizonYears;

  return {
    historicalStartYear: marketYears[0].year,
    historicalEndYear: marketYears[marketYears.length - 1].year,
    totalPrincipal,
    investNow: {
      records: investNow.records,
      summary: {
        finalBalance: investNow.records[investNow.records.length - 1].closingBalance,
        totalTax: investNow.totalTax,
        fees: investNow.fees,
      },
    },
    ibkr: {
      records: ibkr.records,
      summary: {
        finalBalance: ibkr.records[ibkr.records.length - 1].closingBalance,
        totalTax: ibkr.totalTax,
        fees: ibkr.fees,
      },
    },
  };
}
