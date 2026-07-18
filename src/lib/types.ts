export type Frequency = 'Weekly' | 'Fortnightly' | 'Monthly' | 'Annually';
export type CalculatorMode = 'pie-vs-us' | 'us-vs-irish';
export type FxMode = 'auto' | 'manual';
export type EtfDomicile = 'us' | 'irish';
export type BrokerageVenue = 'us' | 'lse';

/** All investor-configurable inputs. Rates are stored as decimals (e.g. 0.08 = 8%). */
export interface SimulationInputs {
  initialInvestment: number;
  periodicContribution: number;
  frequency: Frequency;
  horizonYears: number;
  historicalEndYear: number;
  marginalRate: number;
  pir: number;
  fxMode: FxMode;
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
  fxMode?: FxMode;
  brokerageLabel?: string;
}

/** InvestNow PIE tax calculation detail. */
export interface PieTaxDetail {
  kind: 'pie';
  openingBalance: number;
  grossDividends: number;
  withholdingTax: number;
  taxableIncome: number;
  pir: number;
  grossTax: number;
  foreignTaxCredit: number;
  netTax: number;
}

/** IBKR FIF tax calculation detail. */
export interface FifTaxDetail {
  kind: 'direct-fif';
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

/** FIF calculation for either ETF in the domicile comparison. */
export interface EtfFifTaxDetail {
  kind: 'us-fif' | 'irish-fif';
  openingBalance: number;
  grossDividends: number;
  externalDividends: number;
  withholdingTax: number;
  netDividends: number;
  foreignTaxCredit: number;
  fdrIncome: number;
  fdrGrossTax: number;
  fdrForeignTaxCredit: number;
  fdrNetTax: number;
  cvIncome: number;
  cvGrossTax: number;
  cvForeignTaxCredit: number;
  cvNetTax: number;
  selectedMethod: 'FDR' | 'CV';
  netTax: number;
}

export type TaxDetail = PieTaxDetail | FifTaxDetail | EtfFifTaxDetail;

/** Common per-year record fields shared by both platforms. */
export interface YearRecordBase {
  year: number;
  calendarYear: number | null;
  priceReturn: number;
  dividendReturn: number;
  openingBalance: number;
  netAnnualContribution: number;
  growth: number;
  grossDividends: number;
  netDividends: number;
  managementFee: number;
  tax: number;
  closingBalance: number;
  fees: FeeYearDetail;
}

export interface InvestNowYearRecord extends YearRecordBase {
  taxDetail: PieTaxDetail | null;
}

export interface IbkrYearRecord extends YearRecordBase {
  taxDetail: FifTaxDetail | null;
}

export interface EtfYearRecord extends YearRecordBase {
  externalDividends: number;
  withholdingTax: number;
  taxDetail: EtfFifTaxDetail | null;
}

export type YearRecord = InvestNowYearRecord | IbkrYearRecord | EtfYearRecord;

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
  inheritedWealth?: {
    terminalHolding: number;
    estateTax: number;
    inheritedBalance: number;
  };
}

export interface PlatformResult<T extends YearRecord = YearRecord> {
  key: string;
  label: string;
  shortLabel: string;
  color: string;
  records: T[];
  summary: PlatformSummary;
}

export interface CalculatorResult {
  mode: CalculatorMode;
  title: string;
  description: string;
  historicalStartYear: number;
  historicalEndYear: number;
  totalPrincipal: number;
  left: PlatformResult;
  right: PlatformResult;
}
