import type { Frequency } from './types';

/** Exchange rate: 1 NZD = 0.60 USD. Used to convert USD fixed fees to NZD. */
export const USD_PER_NZD = 0.6;

/** Underlying ETF management fee: 0.03% annually, applied to both platforms. */
export const MANAGEMENT_FEE_RATE = 0.0003;

/** US dividend withholding tax: 15% on gross dividends. */
export const WITHHOLDING_TAX_RATE = 0.15;

/** Fair Dividend Rate: 5% of opening balance is deemed taxable income. */
export const FDR_RATE = 0.05;

/** Crash-year severity band bounds (drop fractions). */
export const CRASH_SEVERITY_OUTER_MIN = 0.05;
export const CRASH_SEVERITY_OUTER_MAX = 0.6;

/** Default crash severity band (drop fractions). */
export const DEFAULT_CRASH_SEVERITY_MIN = 0.1;
export const DEFAULT_CRASH_SEVERITY_MAX = 0.35;

/** FIF de minimis threshold in NZD. */
export const DE_MINIMIS_THRESHOLD = 100_000;

/** InvestNow transaction fees. */
export const INVESTNOW_BUY_FEE = 0.005;
export const INVESTNOW_SELL_FEE = 0.005;

/** IBKR fees. */
export const IBKR_FX_RATE = 0.0003; // 0.03% of NZD transaction amount
export const IBKR_BROKERAGE_MIN_USD = 0.35; // USD minimum per order
export const IBKR_BROKERAGE_CAP_RATE = 0.01; // strictly capped at 1% of trade value

/** Number of contribution instances per year for each frequency. */
export const FREQUENCY_INSTANCES: Record<Frequency, number> = {
  Weekly: 52,
  Fortnightly: 26,
  Monthly: 12,
  Annually: 1,
};

/** Maximum number of crash years supported. */
export const MAX_CRASH_YEARS = 5;

/** Investment horizon bounds. */
export const MIN_HORIZON = 1;
export const MAX_HORIZON = 50;
