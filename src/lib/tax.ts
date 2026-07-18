import {
  DE_MINIMIS_THRESHOLD,
  FDR_RATE,
  US_ESTATE_TAX_CREDIT_USD,
  WITHHOLDING_TAX_RATE,
} from './constants';
import { nzdFromUsd, usdFromNzd } from './fees';
import type { EtfDomicile, EtfFifTaxDetail, FifTaxDetail, PieTaxDetail } from './types';

/**
 * InvestNow PIE Fair Dividend Rate tax. Taxable Income = Opening Balance x 5%;
 * foreign withholding tax reduces the PIE tax owed.
 */
export function pieTax(
  openingBalance: number,
  grossDividends: number,
  pir: number,
): PieTaxDetail {
  const taxableIncome = openingBalance * FDR_RATE;
  const grossTax = taxableIncome * pir;
  const withholdingTax = grossDividends * WITHHOLDING_TAX_RATE;
  const foreignTaxCredit = Math.min(withholdingTax, grossTax);
  const netTax = grossTax - foreignTaxCredit;
  return {
    kind: 'pie',
    openingBalance,
    grossDividends,
    withholdingTax,
    taxableIncome,
    pir,
    grossTax,
    foreignTaxCredit,
    netTax,
  };
}

export interface FifTaxParams {
  costBase: number;
  openingBalance: number;
  grossDividends: number;
  growth: number;
  managementFee: number;
  marginalRate: number;
}

/**
 * IBKR FIF tax. If the year-end cost base is at or below the de minimis
 * threshold the portfolio is FIF-exempt and taxed on dividends only. Otherwise
 * the FIF regime applies and the lesser of the FDR and CV method net tax is
 * levied. The CV calculation uses GROSS dividends.
 */
export function fifTax(params: FifTaxParams): FifTaxDetail {
  const { costBase, openingBalance, grossDividends, growth, managementFee, marginalRate } =
    params;

  if (costBase <= DE_MINIMIS_THRESHOLD) {
    const nzGrossTax = grossDividends * marginalRate;
    const ftc = Math.min(grossDividends * WITHHOLDING_TAX_RATE, nzGrossTax);
    const netTax = nzGrossTax - ftc;
    return {
      kind: 'direct-fif',
      costBase,
      regime: 'exempt',
      grossDividends,
      ftc,
      nzGrossTax,
      netTax,
    };
  }

  const ftc = grossDividends * WITHHOLDING_TAX_RATE;

  const fdrIncome = openingBalance * FDR_RATE;
  const fdrGrossTax = fdrIncome * marginalRate;
  const fdrNetTax = Math.max(0, fdrGrossTax - Math.min(ftc, fdrGrossTax));

  const cvIncome = Math.max(0, growth + grossDividends - managementFee);
  const cvGrossTax = cvIncome * marginalRate;
  const cvNetTax = Math.max(0, cvGrossTax - Math.min(ftc, cvGrossTax));

  const selectedMethod: 'FDR' | 'CV' = fdrNetTax <= cvNetTax ? 'FDR' : 'CV';
  const netTax = Math.min(fdrNetTax, cvNetTax);

  return {
    kind: 'direct-fif',
    costBase,
    regime: 'fif',
    grossDividends,
    ftc,
    fdrIncome,
    fdrGrossTax,
    fdrNetTax,
    cvIncome,
    cvGrossTax,
    cvNetTax,
    selectedMethod,
    netTax,
  };
}

export interface EtfFifTaxParams {
  domicile: EtfDomicile;
  openingBalance: number;
  grossDividends: number;
  growth: number;
  managementFee: number;
  marginalRate: number;
}

/** FIF tax for the distributing US ETF or accumulating Irish ETF. */
export function etfFifTax(params: EtfFifTaxParams): EtfFifTaxDetail {
  const { domicile, openingBalance, grossDividends, growth, managementFee, marginalRate } =
    params;
  const withholdingTax = grossDividends * WITHHOLDING_TAX_RATE;
  const netDividends = grossDividends - withholdingTax;
  const externalDividends = domicile === 'us' ? grossDividends : 0;

  const fdrIncome = openingBalance * FDR_RATE;
  const fdrGrossTax = fdrIncome * marginalRate;
  const fdrForeignTaxCredit =
    domicile === 'us' ? Math.min(withholdingTax, fdrGrossTax) : 0;
  const fdrNetTax = Math.max(0, fdrGrossTax - fdrForeignTaxCredit);

  const cvIncome = Math.max(
    0,
    growth + (domicile === 'us' ? grossDividends : netDividends) - managementFee,
  );
  const cvGrossTax = cvIncome * marginalRate;
  const cvForeignTaxCredit =
    domicile === 'us' ? Math.min(withholdingTax, cvGrossTax) : 0;
  const cvNetTax = Math.max(0, cvGrossTax - cvForeignTaxCredit);

  const selectedMethod: 'FDR' | 'CV' = fdrNetTax <= cvNetTax ? 'FDR' : 'CV';
  return {
    kind: domicile === 'us' ? 'us-fif' : 'irish-fif',
    openingBalance,
    grossDividends,
    externalDividends,
    withholdingTax,
    netDividends,
    foreignTaxCredit:
      selectedMethod === 'FDR' ? fdrForeignTaxCredit : cvForeignTaxCredit,
    fdrIncome,
    fdrGrossTax,
    fdrForeignTaxCredit,
    fdrNetTax,
    cvIncome,
    cvGrossTax,
    cvForeignTaxCredit,
    cvNetTax,
    selectedMethod,
    netTax: Math.min(fdrNetTax, cvNetTax),
  };
}

/** Tentative US estate tax using the progressive rate schedule in 26 USC 2001(c). */
export function tentativeEstateTaxUsd(taxableEstateUsd: number): number {
  const brackets: [number, number, number][] = [
    [10_000, 0, 0.18],
    [20_000, 1_800, 0.2],
    [40_000, 3_800, 0.22],
    [60_000, 8_200, 0.24],
    [80_000, 13_000, 0.26],
    [100_000, 18_200, 0.28],
    [150_000, 23_800, 0.3],
    [250_000, 38_800, 0.32],
    [500_000, 70_800, 0.34],
    [750_000, 155_800, 0.37],
    [1_000_000, 248_300, 0.39],
    [Infinity, 345_800, 0.4],
  ];
  let lowerBound = 0;
  for (const [upperBound, baseTax, rate] of brackets) {
    if (taxableEstateUsd <= upperBound) {
      return baseTax + (taxableEstateUsd - lowerBound) * rate;
    }
    lowerBound = upperBound;
  }
  return 0;
}

/** Illustrative inherited wealth for a terminal holding, expressed in NZD. */
export function inheritedWealth(
  terminalHoldingNzd: number,
  domicile: EtfDomicile,
): { terminalHolding: number; estateTax: number; inheritedBalance: number } {
  if (domicile === 'irish') {
    return {
      terminalHolding: terminalHoldingNzd,
      estateTax: 0,
      inheritedBalance: terminalHoldingNzd,
    };
  }
  const terminalUsd = usdFromNzd(terminalHoldingNzd);
  const estateTaxUsd = Math.max(
    0,
    tentativeEstateTaxUsd(terminalUsd) - US_ESTATE_TAX_CREDIT_USD,
  );
  const estateTax = nzdFromUsd(estateTaxUsd);
  return {
    terminalHolding: terminalHoldingNzd,
    estateTax,
    inheritedBalance: Math.max(0, terminalHoldingNzd - estateTax),
  };
}
