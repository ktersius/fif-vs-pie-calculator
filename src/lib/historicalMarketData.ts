/**
 * Annual S&P 500 price and dividend returns, 1957–2025.
 *
 * Source: SlickCharts — S&P 500 Price Return, Dividend Return, and Total Return
 * URL:    https://www.slickcharts.com/sp500/returns/details
 * Retrieved: 2026-07-18
 *
 * Update policy: add a completed year's record only after 31 December has
 * passed for that year.  Increment LATEST_HISTORICAL_YEAR and append a new
 * entry (maintaining ascending year order) after verifying both values
 * against the source table.
 *
 * All return values are stored as decimals (e.g. 0.2631 = 26.31%).
 * priceReturn  — index price change only, excluding dividends.
 * dividendReturn — dividend component; treat as gross dividend income per
 *                  dollar invested (before the 15 % US withholding tax).
 */

export interface HistoricalMarketYear {
  year: number;
  priceReturn: number;
  dividendReturn: number;
}

/** First year included in the dataset (S&P 500 expanded to 500 components). */
export const EARLIEST_HISTORICAL_YEAR = 1957;

/** Last fully completed calendar year included in the dataset. */
export const LATEST_HISTORICAL_YEAR = 2025;

/**
 * Complete annual S&P 500 dataset sorted ascending by year.
 *
 * Source: https://www.slickcharts.com/sp500/returns/details  (retrieved 2026-07-18)
 */
export const HISTORICAL_MARKET_DATA: readonly HistoricalMarketYear[] = [
  { year: 1957, priceReturn: -0.143133, dividendReturn: 0.035333 },  // -14.31% + 3.53% = -10.78%
  { year: 1958, priceReturn:  0.380595, dividendReturn: 0.053005 },  //  38.06% + 5.30% = 43.36%
  { year: 1959, priceReturn:  0.084767, dividendReturn: 0.034833 },  //   8.48% + 3.48% = 11.96%
  { year: 1960, priceReturn: -0.029721, dividendReturn: 0.034421 },  //  -2.97% + 3.44% =  0.47%
  { year: 1961, priceReturn:  0.231285, dividendReturn: 0.037615 },  //  23.13% + 3.76% = 26.89%
  { year: 1962, priceReturn: -0.118099, dividendReturn: 0.030799 },  // -11.81% + 3.08% = -8.73%
  { year: 1963, priceReturn:  0.188906, dividendReturn: 0.039094 },  //  18.89% + 3.91% = 22.80%
  { year: 1964, priceReturn:  0.129699, dividendReturn: 0.035101 },  //  12.97% + 3.51% = 16.48%
  { year: 1965, priceReturn:  0.090619, dividendReturn: 0.033881 },  //   9.06% + 3.39% = 12.45%
  { year: 1966, priceReturn: -0.130910, dividendReturn: 0.030310 },  // -13.09% + 3.03% = -10.06%
  { year: 1967, priceReturn:  0.200921, dividendReturn: 0.038879 },  //  20.09% + 3.89% = 23.98%
  { year: 1968, priceReturn:  0.076604, dividendReturn: 0.033996 },  //   7.66% + 3.40% = 11.06%
  { year: 1969, priceReturn: -0.113614, dividendReturn: 0.028614 },  // -11.36% + 2.86% = -8.50%
  { year: 1970, priceReturn:  0.000978, dividendReturn: 0.039122 },  //   0.10% + 3.91% =  4.01%
  { year: 1971, priceReturn:  0.107868, dividendReturn: 0.035232 },  //  10.79% + 3.52% = 14.31%
  { year: 1972, priceReturn:  0.156333, dividendReturn: 0.033467 },  //  15.63% + 3.35% = 18.98%
  { year: 1973, priceReturn: -0.173655, dividendReturn: 0.027055 },  // -17.37% + 2.71% = -14.66%
  { year: 1974, priceReturn: -0.297181, dividendReturn: 0.032481 },  // -29.72% + 3.25% = -26.47%
  { year: 1975, priceReturn:  0.315490, dividendReturn: 0.056510 },  //  31.55% + 5.65% = 37.20%
  { year: 1976, priceReturn:  0.191485, dividendReturn: 0.046915 },  //  19.15% + 4.69% = 23.84%
  { year: 1977, priceReturn: -0.115020, dividendReturn: 0.043220 },  // -11.50% + 4.32% = -7.18%
  { year: 1978, priceReturn:  0.010620, dividendReturn: 0.054980 },  //   1.06% + 5.50% =  6.56%
  { year: 1979, priceReturn:  0.123088, dividendReturn: 0.061312 },  //  12.31% + 6.13% = 18.44%
  { year: 1980, priceReturn:  0.257736, dividendReturn: 0.066464 },  //  25.77% + 6.65% = 32.42%
  { year: 1981, priceReturn: -0.097304, dividendReturn: 0.048204 },  //  -9.73% + 4.82% = -4.91%
  { year: 1982, priceReturn:  0.147613, dividendReturn: 0.067887 },  //  14.76% + 6.79% = 21.55%
  { year: 1983, priceReturn:  0.172710, dividendReturn: 0.052890 },  //  17.27% + 5.29% = 22.56%
  { year: 1984, priceReturn:  0.014006, dividendReturn: 0.048694 },  //   1.40% + 4.87% =  6.27%
  { year: 1985, priceReturn:  0.263334, dividendReturn: 0.053966 },  //  26.33% + 5.40% = 31.73%
  { year: 1986, priceReturn:  0.146204, dividendReturn: 0.040496 },  //  14.62% + 4.05% = 18.67%
  { year: 1987, priceReturn:  0.020275, dividendReturn: 0.032225 },  //   2.03% + 3.22% =  5.25%
  { year: 1988, priceReturn:  0.124008, dividendReturn: 0.042092 },  //  12.40% + 4.21% = 16.61%
  { year: 1989, priceReturn:  0.272505, dividendReturn: 0.044395 },  //  27.25% + 4.44% = 31.69%
  { year: 1990, priceReturn: -0.065591, dividendReturn: 0.034591 },  //  -6.56% + 3.46% = -3.10%
  { year: 1991, priceReturn:  0.263067, dividendReturn: 0.041633 },  //  26.31% + 4.16% = 30.47%
  { year: 1992, priceReturn:  0.044643, dividendReturn: 0.031557 },  //   4.46% + 3.16% =  7.62%
  { year: 1993, priceReturn:  0.070552, dividendReturn: 0.030248 },  //   7.06% + 3.02% = 10.08%
  { year: 1994, priceReturn: -0.015393, dividendReturn: 0.028593 },  //  -1.54% + 2.86% =  1.32%
  { year: 1995, priceReturn:  0.341107, dividendReturn: 0.034693 },  //  34.11% + 3.47% = 37.58%
  { year: 1996, priceReturn:  0.202637, dividendReturn: 0.026963 },  //  20.26% + 2.70% = 22.96%
  { year: 1997, priceReturn:  0.310082, dividendReturn: 0.023518 },  //  31.01% + 2.35% = 33.36%
  { year: 1998, priceReturn:  0.266686, dividendReturn: 0.019114 },  //  26.67% + 1.91% = 28.58%
  { year: 1999, priceReturn:  0.195260, dividendReturn: 0.015140 },  //  19.53% + 1.51% = 21.04%
  { year: 2000, priceReturn: -0.101392, dividendReturn: 0.010392 },  // -10.14% + 1.04% = -9.10%
  { year: 2001, priceReturn: -0.130427, dividendReturn: 0.011527 },  // -13.04% + 1.15% = -11.89%
  { year: 2002, priceReturn: -0.233660, dividendReturn: 0.012660 },  // -23.37% + 1.27% = -22.10%
  { year: 2003, priceReturn:  0.263804, dividendReturn: 0.022996 },  //  26.38% + 2.30% = 28.68%
  { year: 2004, priceReturn:  0.089935, dividendReturn: 0.018865 },  //   8.99% + 1.89% = 10.88%
  { year: 2005, priceReturn:  0.030010, dividendReturn: 0.019090 },  //   3.00% + 1.91% =  4.91%
  { year: 2006, priceReturn:  0.136194, dividendReturn: 0.021706 },  //  13.62% + 2.17% = 15.79%
  { year: 2007, priceReturn:  0.035296, dividendReturn: 0.019604 },  //   3.53% + 1.96% =  5.49%
  { year: 2008, priceReturn: -0.384858, dividendReturn: 0.014858 },  // -38.49% + 1.49% = -37.00%
  { year: 2009, priceReturn:  0.234542, dividendReturn: 0.030058 },  //  23.45% + 3.01% = 26.46%
  { year: 2010, priceReturn:  0.127827, dividendReturn: 0.022773 },  //  12.78% + 2.28% = 15.06%
  { year: 2011, priceReturn: -0.000032, dividendReturn: 0.021132 },  //  -0.00% + 2.11% =  2.11%
  { year: 2012, priceReturn:  0.134057, dividendReturn: 0.025943 },  //  13.41% + 2.59% = 16.00%
  { year: 2013, priceReturn:  0.296013, dividendReturn: 0.027887 },  //  29.60% + 2.79% = 32.39%
  { year: 2014, priceReturn:  0.113906, dividendReturn: 0.022994 },  //  11.39% + 2.30% = 13.69%
  { year: 2015, priceReturn: -0.007266, dividendReturn: 0.021066 },  //  -0.73% + 2.11% =  1.38%
  { year: 2016, priceReturn:  0.095350, dividendReturn: 0.024250 },  //   9.54% + 2.42% = 11.96%
  { year: 2017, priceReturn:  0.194200, dividendReturn: 0.024100 },  //  19.42% + 2.41% = 21.83%
  { year: 2018, priceReturn: -0.062373, dividendReturn: 0.018573 },  //  -6.24% + 1.86% = -4.38%
  { year: 2019, priceReturn:  0.288781, dividendReturn: 0.026119 },  //  28.88% + 2.61% = 31.49%
  { year: 2020, priceReturn:  0.162589, dividendReturn: 0.021411 },  //  16.26% + 2.14% = 18.40%
  { year: 2021, priceReturn:  0.268927, dividendReturn: 0.018173 },  //  26.89% + 1.82% = 28.71%
  { year: 2022, priceReturn: -0.194428, dividendReturn: 0.013328 },  // -19.44% + 1.33% = -18.11%
  { year: 2023, priceReturn:  0.242305, dividendReturn: 0.020595 },  //  24.23% + 2.06% = 26.29%
  { year: 2024, priceReturn:  0.233090, dividendReturn: 0.017110 },  //  23.31% + 1.71% = 25.02%
  { year: 2025, priceReturn:  0.163878, dividendReturn: 0.014922 },  //  16.39% + 1.49% = 17.88%
] as const;

/**
 * Validate the dataset integrity.  Throws if any record is malformed, if years
 * are not strictly ascending, if any year in [EARLIEST_HISTORICAL_YEAR,
 * LATEST_HISTORICAL_YEAR] is missing, or if any duplicate year exists.
 */
export function validateHistoricalMarketData(data: readonly HistoricalMarketYear[]): void {
  if (data.length === 0) {
    throw new Error('Historical data array is empty');
  }

  const expectedCount = LATEST_HISTORICAL_YEAR - EARLIEST_HISTORICAL_YEAR + 1;
  if (data.length !== expectedCount) {
    throw new Error(
      `Expected ${expectedCount} records (${EARLIEST_HISTORICAL_YEAR}–${LATEST_HISTORICAL_YEAR}), got ${data.length}`,
    );
  }

  for (let i = 0; i < data.length; i++) {
    const rec = data[i];
    const expectedYear = EARLIEST_HISTORICAL_YEAR + i;

    if (!Number.isInteger(rec.year)) {
      throw new Error(`Record at index ${i}: year is not an integer (${rec.year})`);
    }
    if (rec.year !== expectedYear) {
      throw new Error(
        `Record at index ${i}: expected year ${expectedYear}, got ${rec.year}`,
      );
    }
    if (!Number.isFinite(rec.priceReturn)) {
      throw new Error(`Year ${rec.year}: priceReturn is not a finite number`);
    }
    if (!Number.isFinite(rec.dividendReturn)) {
      throw new Error(`Year ${rec.year}: dividendReturn is not a finite number`);
    }
    if (rec.dividendReturn < 0) {
      throw new Error(`Year ${rec.year}: dividendReturn must be non-negative (${rec.dividendReturn})`);
    }
  }
}

/**
 * Clamp `endYear` to the valid range for a given `horizonYears`:
 * `[EARLIEST_HISTORICAL_YEAR + horizonYears - 1, LATEST_HISTORICAL_YEAR]`.
 *
 * @throws If horizonYears < 1 or exceeds the total dataset length.
 */
export function clampHistoricalEndYear(endYear: number, horizonYears: number): number {
  const totalYears = LATEST_HISTORICAL_YEAR - EARLIEST_HISTORICAL_YEAR + 1;

  if (!Number.isInteger(horizonYears) || horizonYears < 1) {
    throw new Error(`horizonYears must be a positive integer, got ${horizonYears}`);
  }
  if (horizonYears > totalYears) {
    throw new Error(
      `horizonYears (${horizonYears}) exceeds total available years (${totalYears})`,
    );
  }

  const minEnd = EARLIEST_HISTORICAL_YEAR + horizonYears - 1;
  return Math.max(minEnd, Math.min(LATEST_HISTORICAL_YEAR, endYear));
}

/**
 * Return exactly `horizonYears` contiguous records ending at `endYear`
 * (clamped via `clampHistoricalEndYear`). Callers can derive start and end
 * years from the first and last records.
 *
 * @param endYear       Requested end year of the historical window.
 * @param horizonYears  Number of records to return (window length = H).
 * @returns             Exactly H records in ascending year order.
 * @throws              If horizonYears < 1 or exceeds the total dataset length.
 */
export function getHistoricalWindow(
  endYear: number,
  horizonYears: number,
): HistoricalMarketYear[] {
  const clampedEnd = clampHistoricalEndYear(endYear, horizonYears);
  const startYear = clampedEnd - horizonYears + 1;
  const startIndex = startYear - EARLIEST_HISTORICAL_YEAR;
  return HISTORICAL_MARKET_DATA.slice(startIndex, startIndex + horizonYears) as HistoricalMarketYear[];
}
