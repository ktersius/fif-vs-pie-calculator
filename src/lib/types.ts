export type Frequency = 'Weekly' | 'Fortnightly' | 'Monthly' | 'Annually';

/** All investor-configurable inputs. Rates are stored as decimals (e.g. 0.08 = 8%). */
export interface SimulationInputs {
  initialInvestment: number;
  periodicContribution: number;
  frequency: Frequency;
  horizonYears: number;
  marketReturn: number;
  dividendYield: number;
  marginalRate: number;
  pir: number;
  crashYears: number;
  crashSeed: number;
}

/** Breakdown of a single order (contribution, initial investment, or exit). */
export interface OrderFee {
  gross: number;
  fxFee: number;
  brokerageFee: number;
  net: number;
}

/** Per-year fee detail powering the breakdown drill-down. */
export interface FeeYearDetail {
  /** Representative periodic order (all periodic orders in a year are identical). */
  representativeOrder?: OrderFee;
  /** Number of periodic orders in the year. */
  orderCount: number;
  /** One-off order for the year (initial investment in Year 0, exit in the final year). */
  oneOffOrder?: OrderFee;
  oneOffLabel?: string;
  /** Annual fee totals by category. */
  fxFees: number;
  brokerageFees: number;
  transactionFees: number;
  managementFee: number;
}

/** InvestNow PIE tax calculation detail. */
export interface PieTaxDetail {
  openingBalance: number;
  taxableIncome: number;
  pir: number;
  taxOwed: number;
}

/** IBKR FIF tax calculation detail. */
export interface FifTaxDetail {
  costBase: number;
  regime: 'exempt' | 'fif';
  grossDividends: number;
  ftc: number;
  /** Exempt branch. */
  nzGrossTax?: number;
  /** FIF branch. */
  fdrIncome?: number;
  fdrGrossTax?: number;
  fdrNetTax?: number;
  cvIncome?: number;
  cvGrossTax?: number;
  cvNetTax?: number;
  selectedMethod?: 'FDR' | 'CV';
  netTax: number;
}

/** Common per-year record fields shared by both platforms. */
export interface YearRecordBase {
  year: number;
  openingBalance: number;
  netAnnualContribution: number;
  growth: number;
  grossDividends: number;
  netDividends: number;
  managementFee: number;
  tax: number;
  closingBalance: number;
  isCrashYear: boolean;
  fees: FeeYearDetail;
}

export interface InvestNowYearRecord extends YearRecordBase {
  taxDetail: PieTaxDetail | null;
}

export interface IbkrYearRecord extends YearRecordBase {
  taxDetail: FifTaxDetail | null;
}

export interface FeeSummary {
  transaction: number;
  fx: number;
  brokerage: number;
  management: number;
  total: number;
}

export interface PlatformSummary {
  finalBalance: number;
  totalTax: number;
  fees: FeeSummary;
}

export interface PlatformResult<T> {
  records: T[];
  summary: PlatformSummary;
}

export interface SimulationResult {
  crashYears: number[];
  totalPrincipal: number;
  investNow: PlatformResult<InvestNowYearRecord>;
  ibkr: PlatformResult<IbkrYearRecord>;
}
