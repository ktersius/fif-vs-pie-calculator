import {
  FREQUENCY_INSTANCES,
  IRISH_ETF_MANAGEMENT_FEE_RATE,
  MANAGEMENT_FEE_RATE,
  WITHHOLDING_TAX_RATE,
} from './constants';
import {
  ibkrEtfOrderFee,
  ibkrBrokerageFee,
  ibkrFxFee,
  ibkrOrderFee,
  investNowBuyFee,
  investNowSellFee,
} from './fees';
import { getHistoricalWindow, type HistoricalMarketYear } from './historicalMarketData';
import { etfFifTax, fifTax, inheritedWealth, pieTax } from './tax';
import type {
  CalculatorResult,
  EtfDomicile,
  EtfYearRecord,
  FeeSummary,
  IbkrYearRecord,
  InvestNowYearRecord,
  OrderFee,
  SimulationInputs,
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

export function runPieDirectMarketPath(
  inputs: SimulationInputs,
  marketYears: HistoricalMarketYear[],
): Pick<CalculatorResult, 'totalPrincipal' | 'left' | 'right'> {
  const investNow = simulateInvestNow(inputs, marketYears);
  const ibkr = simulateIbkr(inputs, marketYears);
  const instances = FREQUENCY_INSTANCES[inputs.frequency];
  const totalPrincipal =
    inputs.initialInvestment + inputs.periodicContribution * instances * inputs.horizonYears;

  return {
    totalPrincipal,
    left: {
      key: 'invest-now',
      label: 'InvestNow Foundation Series PIE',
      shortLabel: 'InvestNow',
      color: '#16a34a',
      records: investNow.records,
      summary: {
        finalBalance: investNow.records[investNow.records.length - 1].closingBalance,
        totalTax: investNow.totalTax,
        fees: investNow.fees,
      },
    },
    right: {
      key: 'direct-us-etf',
      label: 'Direct US ETF (IBKR)',
      shortLabel: 'US ETF',
      color: '#2563eb',
      records: ibkr.records,
      summary: {
        finalBalance: ibkr.records[ibkr.records.length - 1].closingBalance,
        totalTax: ibkr.totalTax,
        fees: ibkr.fees,
      },
    },
  };
}

/**
 * Run the full 20-year (configurable) comparison. Returns per-year records for
 * both platforms plus aggregate summaries. Deterministic for a given set of
 * inputs and historical period.
 */
export function runSimulation(inputs: SimulationInputs): CalculatorResult {
  const marketYears = getHistoricalWindow(inputs.historicalEndYear, inputs.horizonYears);
  return {
    mode: 'pie-vs-us',
    title: 'NZ FIF vs PIE Calculator',
    description:
      'Comparison of an InvestNow Foundation Series PIE fund and a direct US ETF held through Interactive Brokers.',
    historicalStartYear: marketYears[0].year,
    historicalEndYear: marketYears[marketYears.length - 1].year,
    ...runPieDirectMarketPath(inputs, marketYears),
  };
}

function simulateDomiciledEtf(
  inputs: SimulationInputs,
  marketYears: HistoricalMarketYear[],
  domicile: EtfDomicile,
): { records: EtfYearRecord[]; fees: FeeSummary; totalTax: number; terminalHolding: number } {
  const { initialInvestment, periodicContribution, frequency, horizonYears, marginalRate, fxMode } =
    inputs;
  const instances = FREQUENCY_INSTANCES[frequency];
  const venue = domicile === 'us' ? 'us' : 'lse';
  const managementRate =
    domicile === 'us' ? MANAGEMENT_FEE_RATE : IRISH_ETF_MANAGEMENT_FEE_RATE;
  const brokerageLabel = domicile === 'us' ? 'US tiered brokerage' : 'LSE ETF brokerage';
  const fees = emptyFeeSummary();
  let totalTax = 0;

  const initialOrder = ibkrEtfOrderFee(initialInvestment, fxMode, venue);
  fees.fx += initialOrder.fxFee;
  fees.brokerage += initialOrder.brokerageFee;
  let balance = initialOrder.net;
  let terminalHolding = balance;

  const records: EtfYearRecord[] = [
    {
      year: 0,
      calendarYear: null,
      priceReturn: 0,
      dividendReturn: 0,
      openingBalance: initialInvestment,
      netAnnualContribution: balance,
      growth: 0,
      grossDividends: 0,
      externalDividends: 0,
      withholdingTax: 0,
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
        fxMode,
        brokerageLabel,
      },
    },
  ];

  for (let year = 1; year <= horizonYears; year++) {
    const opening = balance;
    const marketYear = marketYears[year - 1];
    const perOrder =
      periodicContribution > 0
        ? ibkrEtfOrderFee(periodicContribution, fxMode, venue)
        : undefined;
    const netContribution = (perOrder?.net ?? 0) * instances;
    const fxFees = (perOrder?.fxFee ?? 0) * instances;
    const brokerageFees = (perOrder?.brokerageFee ?? 0) * instances;

    const base = opening + netContribution;
    const growth = base * marketYear.priceReturn;
    const grossDividends = base * marketYear.dividendReturn;
    const withholdingTax = grossDividends * WITHHOLDING_TAX_RATE;
    const netDividends = grossDividends - withholdingTax;
    const externalDividends = domicile === 'us' ? grossDividends : 0;

    let temp = base + growth + netDividends;
    const managementFee = temp * managementRate;
    temp -= managementFee;

    const taxDetail = etfFifTax({
      domicile,
      openingBalance: opening,
      grossDividends,
      growth,
      managementFee,
      marginalRate,
    });
    const tax = taxDetail.netTax;
    let closing = Math.max(0, temp - tax);
    terminalHolding = closing;

    let oneOffOrder: OrderFee | undefined;
    let oneOffLabel: string | undefined;
    let exitFx = 0;
    let exitBrokerage = 0;
    if (year === horizonYears) {
      oneOffOrder = ibkrEtfOrderFee(closing, fxMode, venue);
      oneOffLabel = 'Exit (FX + brokerage)';
      exitFx = oneOffOrder.fxFee;
      exitBrokerage = oneOffOrder.brokerageFee;
      closing = oneOffOrder.net;
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
      externalDividends,
      withholdingTax,
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
        fxMode,
        brokerageLabel,
      },
    });
  }

  fees.total = fees.fx + fees.brokerage + fees.management;
  return { records, fees, totalTax, terminalHolding };
}

/** Run the US-domiciled distributing versus Irish-domiciled accumulating comparison. */
export function runUsIrishSimulation(inputs: SimulationInputs): CalculatorResult {
  const marketYears = getHistoricalWindow(inputs.historicalEndYear, inputs.horizonYears);
  const us = simulateDomiciledEtf(inputs, marketYears, 'us');
  const irish = simulateDomiciledEtf(inputs, marketYears, 'irish');
  const instances = FREQUENCY_INSTANCES[inputs.frequency];
  const totalPrincipal =
    inputs.initialInvestment + inputs.periodicContribution * instances * inputs.horizonYears;

  return {
    mode: 'us-vs-irish',
    title: 'US vs Irish ETF Calculator',
    description:
      'Comparison of a US-domiciled distributing ETF and an Irish-domiciled accumulating ETF. Assumes FIF applies throughout.',
    historicalStartYear: marketYears[0].year,
    historicalEndYear: marketYears[marketYears.length - 1].year,
    totalPrincipal,
    left: {
      key: 'us-etf',
      label: 'US-domiciled distributing ETF',
      shortLabel: 'US ETF',
      color: '#2563eb',
      records: us.records,
      summary: {
        finalBalance: us.records[us.records.length - 1].closingBalance,
        totalTax: us.totalTax,
        fees: us.fees,
        inheritedWealth: inheritedWealth(us.terminalHolding, 'us'),
      },
    },
    right: {
      key: 'irish-etf',
      label: 'Irish-domiciled accumulating ETF',
      shortLabel: 'Irish ETF',
      color: '#16a34a',
      records: irish.records,
      summary: {
        finalBalance: irish.records[irish.records.length - 1].closingBalance,
        totalTax: irish.totalTax,
        fees: irish.fees,
        inheritedWealth: inheritedWealth(irish.terminalHolding, 'irish'),
      },
    },
  };
}
