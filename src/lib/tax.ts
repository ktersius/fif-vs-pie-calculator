import { DE_MINIMIS_THRESHOLD, FDR_RATE, WITHHOLDING_TAX_RATE } from './constants';
import type { FifTaxDetail, PieTaxDetail } from './types';

/**
 * InvestNow PIE Fair Dividend Rate tax. Taxable Income = Opening Balance x 5%;
 * PIE Tax = Taxable Income x PIR. Levied even when the market return is negative.
 */
export function pieTax(openingBalance: number, pir: number): PieTaxDetail {
  const taxableIncome = openingBalance * FDR_RATE;
  const taxOwed = taxableIncome * pir;
  return { openingBalance, taxableIncome, pir, taxOwed };
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
    return { costBase, regime: 'exempt', grossDividends, ftc, nzGrossTax, netTax };
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
