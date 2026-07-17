import { describe, it, expect } from 'vitest';
import {
  EARLIEST_HISTORICAL_YEAR,
  LATEST_HISTORICAL_YEAR,
  HISTORICAL_MARKET_DATA,
  validateHistoricalMarketData,
  clampHistoricalEndYear,
  getHistoricalWindow,
  type HistoricalMarketYear,
} from './historicalMarketData';

// ---------------------------------------------------------------------------
// Dataset integrity (task 1.3)
// ---------------------------------------------------------------------------

describe('HISTORICAL_MARKET_DATA', () => {
  it('starts at EARLIEST_HISTORICAL_YEAR (1957) and ends at LATEST_HISTORICAL_YEAR (2025)', () => {
    expect(HISTORICAL_MARKET_DATA[0].year).toBe(EARLIEST_HISTORICAL_YEAR);
    expect(HISTORICAL_MARKET_DATA[HISTORICAL_MARKET_DATA.length - 1].year).toBe(LATEST_HISTORICAL_YEAR);
  });

  it('contains exactly LATEST_HISTORICAL_YEAR - EARLIEST_HISTORICAL_YEAR + 1 records', () => {
    expect(HISTORICAL_MARKET_DATA.length).toBe(LATEST_HISTORICAL_YEAR - EARLIEST_HISTORICAL_YEAR + 1);
  });

  it('has strictly ascending, contiguous years with no gaps', () => {
    for (let i = 1; i < HISTORICAL_MARKET_DATA.length; i++) {
      expect(HISTORICAL_MARKET_DATA[i].year).toBe(HISTORICAL_MARKET_DATA[i - 1].year + 1);
    }
  });

  it('has finite numeric priceReturn and dividendReturn for every record', () => {
    for (const rec of HISTORICAL_MARKET_DATA) {
      expect(Number.isFinite(rec.priceReturn)).toBe(true);
      expect(Number.isFinite(rec.dividendReturn)).toBe(true);
    }
  });

  it('has non-negative dividendReturn for every record', () => {
    for (const rec of HISTORICAL_MARKET_DATA) {
      expect(rec.dividendReturn).toBeGreaterThanOrEqual(0);
    }
  });

  it('passes validateHistoricalMarketData without throwing', () => {
    expect(() => validateHistoricalMarketData(HISTORICAL_MARKET_DATA)).not.toThrow();
  });

  // Spot-check several well-known years against the published SlickCharts values
  it.each([
    // [year, expectedPriceReturn %, expectedDividendReturn %, note]
    [2008, -38.49, 1.49, '2008 financial crisis'],
    [2020,  16.26, 2.14, '2020 pandemic rebound'],
    [1974, -29.72, 3.25, '1974 bear market'],
    [1995,  34.11, 3.47, '1995 bull run'],
    [2025,  16.39, 1.49, '2025 latest year'],
    [1957, -14.31, 3.53, '1957 earliest year'],
  ] as [number, number, number, string][])(
    'year %i: priceReturn ≈ %f%%, dividendReturn ≈ %f%% (%s)',
    (year, expectedPr, expectedDr) => {
      const rec = HISTORICAL_MARKET_DATA.find(r => r.year === year)!;
      expect(rec).toBeDefined();
      expect(rec.priceReturn * 100).toBeCloseTo(expectedPr, 1);
      expect(rec.dividendReturn * 100).toBeCloseTo(expectedDr, 1);
    },
  );
});

// ---------------------------------------------------------------------------
// validateHistoricalData – rejection cases (task 1.3)
// ---------------------------------------------------------------------------

describe('validateHistoricalMarketData', () => {
  function makeYear(year: number): HistoricalMarketYear {
    return { year, priceReturn: 0.1, dividendReturn: 0.02 };
  }

  it('rejects an empty array', () => {
    expect(() => validateHistoricalMarketData([])).toThrow(/empty/i);
  });

  it('rejects when count does not match EARLIEST_HISTORICAL_YEAR..LATEST_HISTORICAL_YEAR range', () => {
    const short = [makeYear(1957)];
    expect(() => validateHistoricalMarketData(short)).toThrow(/Expected \d+ records/);
  });

  it('rejects a dataset with a missing year (gap)', () => {
    const data = Array.from(
      { length: LATEST_HISTORICAL_YEAR - EARLIEST_HISTORICAL_YEAR + 1 },
      (_, i) => makeYear(EARLIEST_HISTORICAL_YEAR + i),
    );
    // Replace year at index 5 with a duplicate to create a gap at index 6
    data[5] = makeYear(EARLIEST_HISTORICAL_YEAR + 4); // duplicate of index 4
    expect(() => validateHistoricalMarketData(data)).toThrow(/expected year/i);
  });

  it('rejects a dataset with a duplicate year', () => {
    const data = Array.from(
      { length: LATEST_HISTORICAL_YEAR - EARLIEST_HISTORICAL_YEAR + 1 },
      (_, i) => makeYear(EARLIEST_HISTORICAL_YEAR + i),
    );
    data[10] = makeYear(EARLIEST_HISTORICAL_YEAR + 9); // year repeated
    expect(() => validateHistoricalMarketData(data)).toThrow(/expected year/i);
  });

  it('rejects a dataset with out-of-order years', () => {
    const data = Array.from(
      { length: LATEST_HISTORICAL_YEAR - EARLIEST_HISTORICAL_YEAR + 1 },
      (_, i) => makeYear(EARLIEST_HISTORICAL_YEAR + i),
    );
    [data[0], data[1]] = [data[1], data[0]]; // swap first two records
    expect(() => validateHistoricalMarketData(data)).toThrow(/expected year/i);
  });

  it('rejects a record with a non-integer year', () => {
    const data = Array.from(
      { length: LATEST_HISTORICAL_YEAR - EARLIEST_HISTORICAL_YEAR + 1 },
      (_, i) => makeYear(EARLIEST_HISTORICAL_YEAR + i),
    );
    (data[0] as unknown as { year: number }).year = 1957.5;
    expect(() => validateHistoricalMarketData(data)).toThrow(/not an integer/i);
  });

  it('rejects a record with NaN priceReturn', () => {
    const data = Array.from(
      { length: LATEST_HISTORICAL_YEAR - EARLIEST_HISTORICAL_YEAR + 1 },
      (_, i) => makeYear(EARLIEST_HISTORICAL_YEAR + i),
    );
    data[0] = { year: EARLIEST_HISTORICAL_YEAR, priceReturn: NaN, dividendReturn: 0.02 };
    expect(() => validateHistoricalMarketData(data)).toThrow(/priceReturn is not a finite/i);
  });

  it('rejects a record with Infinity dividendReturn', () => {
    const data = Array.from(
      { length: LATEST_HISTORICAL_YEAR - EARLIEST_HISTORICAL_YEAR + 1 },
      (_, i) => makeYear(EARLIEST_HISTORICAL_YEAR + i),
    );
    data[0] = { year: EARLIEST_HISTORICAL_YEAR, priceReturn: 0.1, dividendReturn: Infinity };
    expect(() => validateHistoricalMarketData(data)).toThrow(/dividendReturn is not a finite/i);
  });

  it('rejects a record with a negative dividendReturn', () => {
    const data = Array.from(
      { length: LATEST_HISTORICAL_YEAR - EARLIEST_HISTORICAL_YEAR + 1 },
      (_, i) => makeYear(EARLIEST_HISTORICAL_YEAR + i),
    );
    data[0] = { year: EARLIEST_HISTORICAL_YEAR, priceReturn: 0.1, dividendReturn: -0.01 };
    expect(() => validateHistoricalMarketData(data)).toThrow(/dividendReturn must be non-negative/i);
  });
});

// ---------------------------------------------------------------------------
// clampHistoricalEndYear (task 1.4)
// ---------------------------------------------------------------------------

describe('clampHistoricalEndYear', () => {
  it('returns endYear unchanged when within valid range', () => {
    expect(clampHistoricalEndYear(2020, 10)).toBe(2020);
  });

  it('clamps above LATEST_HISTORICAL_YEAR down to LATEST_HISTORICAL_YEAR', () => {
    expect(clampHistoricalEndYear(LATEST_HISTORICAL_YEAR + 5, 10)).toBe(LATEST_HISTORICAL_YEAR);
  });

  it('clamps below minEnd up to EARLIEST_HISTORICAL_YEAR + horizonYears - 1', () => {
    const H = 10;
    expect(clampHistoricalEndYear(EARLIEST_HISTORICAL_YEAR, H)).toBe(EARLIEST_HISTORICAL_YEAR + H - 1);
  });

  it('throws when horizonYears is zero', () => {
    expect(() => clampHistoricalEndYear(2025, 0)).toThrow(/positive integer/i);
  });

  it('throws when horizonYears is negative', () => {
    expect(() => clampHistoricalEndYear(2025, -1)).toThrow(/positive integer/i);
  });

  it('throws when horizonYears exceeds total available years', () => {
    const tooMany = LATEST_HISTORICAL_YEAR - EARLIEST_HISTORICAL_YEAR + 2;
    expect(() => clampHistoricalEndYear(2025, tooMany)).toThrow(/exceeds total available/i);
  });
});

// ---------------------------------------------------------------------------
// getHistoricalWindow (task 1.4)
// ---------------------------------------------------------------------------

describe('getHistoricalWindow', () => {
  it('returns exactly H records for a valid end year', () => {
    const window = getHistoricalWindow(2025, 20);
    expect(window.length).toBe(20);
  });

  it('maps first record to startYear and last record to endYear', () => {
    const endYear = 2025;
    const horizon = 20;
    const window = getHistoricalWindow(endYear, horizon);
    expect(window[0].year).toBe(endYear - horizon + 1);    // 2006
    expect(window[horizon - 1].year).toBe(endYear);         // 2025
  });

  it('returns records in ascending year order', () => {
    const window = getHistoricalWindow(2020, 10);
    for (let i = 1; i < window.length; i++) {
      expect(window[i].year).toBe(window[i - 1].year + 1);
    }
  });

  it('returns the latest H years when endYear equals LATEST_HISTORICAL_YEAR', () => {
    const H = 10;
    const window = getHistoricalWindow(LATEST_HISTORICAL_YEAR, H);
    expect(window[0].year).toBe(LATEST_HISTORICAL_YEAR - H + 1);
    expect(window[window.length - 1].year).toBe(LATEST_HISTORICAL_YEAR);
  });

  it('clamps endYear above LATEST_HISTORICAL_YEAR down to LATEST_HISTORICAL_YEAR', () => {
    const H = 5;
    const window = getHistoricalWindow(LATEST_HISTORICAL_YEAR + 10, H);
    expect(window[window.length - 1].year).toBe(LATEST_HISTORICAL_YEAR);
    expect(window.length).toBe(H);
  });

  it('clamps endYear below minEnd up to EARLIEST_HISTORICAL_YEAR + horizonYears - 1', () => {
    const H = 10;
    const window = getHistoricalWindow(EARLIEST_HISTORICAL_YEAR, H);
    expect(window[0].year).toBe(EARLIEST_HISTORICAL_YEAR);
    expect(window[window.length - 1].year).toBe(EARLIEST_HISTORICAL_YEAR + H - 1);
    expect(window.length).toBe(H);
  });

  it('works for a single-year horizon', () => {
    const window = getHistoricalWindow(2000, 1);
    expect(window.length).toBe(1);
    expect(window[0].year).toBe(2000);
  });

  it('works for the full dataset horizon', () => {
    const totalYears = LATEST_HISTORICAL_YEAR - EARLIEST_HISTORICAL_YEAR + 1;
    const window = getHistoricalWindow(LATEST_HISTORICAL_YEAR, totalYears);
    expect(window.length).toBe(totalYears);
    expect(window[0].year).toBe(EARLIEST_HISTORICAL_YEAR);
    expect(window[window.length - 1].year).toBe(LATEST_HISTORICAL_YEAR);
  });

  it('throws when horizonYears is zero', () => {
    expect(() => getHistoricalWindow(2025, 0)).toThrow(/positive integer/i);
  });

  it('throws when horizonYears is negative', () => {
    expect(() => getHistoricalWindow(2025, -1)).toThrow(/positive integer/i);
  });

  it('throws when horizonYears exceeds total available years', () => {
    const tooMany = LATEST_HISTORICAL_YEAR - EARLIEST_HISTORICAL_YEAR + 2;
    expect(() => getHistoricalWindow(2025, tooMany)).toThrow(/exceeds total available/i);
  });

  it('records are the actual dataset values (not copies with wrong data)', () => {
    const window = getHistoricalWindow(2008, 1);
    const direct = HISTORICAL_MARKET_DATA.find(r => r.year === 2008)!;
    expect(window[0].priceReturn).toBe(direct.priceReturn);
    expect(window[0].dividendReturn).toBe(direct.dividendReturn);
  });
});
