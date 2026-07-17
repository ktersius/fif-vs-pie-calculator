import { describe, expect, it } from 'vitest';
import {
  HISTORICAL_MARKET_DATA,
  LATEST_HISTORICAL_YEAR,
} from './historicalMarketData';
import { runSimulation } from './simulation';
import type { SimulationInputs } from './types';

const base: SimulationInputs = {
  initialInvestment: 100_000,
  periodicContribution: 250,
  frequency: 'Weekly',
  horizonYears: 20,
  historicalEndYear: LATEST_HISTORICAL_YEAR,
  marginalRate: 0.39,
  pir: 0.28,
};

const marketYear = (year: number) =>
  HISTORICAL_MARKET_DATA.find((record) => record.year === year)!;

describe('runSimulation structure', () => {
  it('produces H + 1 records per platform for the default horizon', () => {
    const result = runSimulation(base);
    expect(result.investNow.records).toHaveLength(21);
    expect(result.ibkr.records).toHaveLength(21);
    expect(result.investNow.records[0].year).toBe(0);
    expect(result.investNow.records[0].calendarYear).toBeNull();
    expect(result.investNow.records[20].year).toBe(20);
    expect(result.investNow.records[20].calendarYear).toBe(LATEST_HISTORICAL_YEAR);
  });

  it('honours a custom horizon', () => {
    const result = runSimulation({ ...base, horizonYears: 10 });
    expect(result.ibkr.records).toHaveLength(11);
  });

  it('computes total principal as initial + periodic x instances x horizon', () => {
    const result = runSimulation(base);
    expect(result.totalPrincipal).toBe(100_000 + 250 * 52 * 20);
  });

  it('maps a contiguous historical window to portfolio years', () => {
    const result = runSimulation({ ...base, horizonYears: 3, historicalEndYear: 2025 });
    expect(result.historicalStartYear).toBe(2023);
    expect(result.historicalEndYear).toBe(2025);
    expect(result.ibkr.records.slice(1).map((record) => record.calendarYear)).toEqual([
      2023, 2024, 2025,
    ]);
  });
});

describe('historical returns', () => {
  it('applies the selected price and dividend returns to both platforms', () => {
    const historical = marketYear(2008);
    const result = runSimulation({ ...base, horizonYears: 1, historicalEndYear: 2008 });
    const investNow = result.investNow.records[1];
    const ibkr = result.ibkr.records[1];

    expect(investNow.priceReturn).toBe(historical.priceReturn);
    expect(investNow.dividendReturn).toBe(historical.dividendReturn);
    expect(ibkr.priceReturn).toBe(historical.priceReturn);
    expect(ibkr.dividendReturn).toBe(historical.dividendReturn);
  });

  it('is deterministic for the same inputs and historical period', () => {
    expect(runSimulation(base)).toEqual(runSimulation(base));
  });

  it('applies the full annual return to the full net annual contribution', () => {
    const historical = marketYear(2008);
    const result = runSimulation({
      ...base,
      initialInvestment: 0,
      periodicContribution: 1_000,
      frequency: 'Annually',
      horizonYears: 1,
      historicalEndYear: 2008,
    });
    const record = result.investNow.records[1];

    expect(record.netAnnualContribution).toBe(995);
    expect(record.growth).toBeCloseTo(995 * historical.priceReturn, 10);
    expect(record.grossDividends).toBeCloseTo(995 * historical.dividendReturn, 10);
  });
});

describe('FIF de minimis behaviour', () => {
  it('drags a $100k initial investment into FIF from Year 1', () => {
    const result = runSimulation(base);
    expect(result.ibkr.records[1].taxDetail?.regime).toBe('fif');
  });

  it('keeps a portfolio FIF-exempt when only unrealised growth lifts the balance', () => {
    const result = runSimulation({
      ...base,
      initialInvestment: 80_000,
      periodicContribution: 0,
      horizonYears: 1,
      historicalEndYear: 1958,
    });
    expect(result.ibkr.summary.finalBalance).toBeGreaterThan(100_000);
    expect(result.ibkr.records[1].taxDetail?.regime).toBe('exempt');
  });
});

describe('balance flooring', () => {
  it('never produces a negative closing balance through a severe historical period', () => {
    const result = runSimulation({
      ...base,
      initialInvestment: 5_000,
      periodicContribution: 0,
      horizonYears: 10,
      historicalEndYear: 2009,
      marginalRate: 0.39,
    });
    for (const rec of result.investNow.records) {
      expect(rec.closingBalance).toBeGreaterThanOrEqual(0);
    }
    for (const rec of result.ibkr.records) {
      expect(rec.closingBalance).toBeGreaterThanOrEqual(0);
    }
  });
});

describe('historical-period stability across inputs', () => {
  it('keeps the same calendar years when a financial input changes', () => {
    const a = runSimulation(base);
    const b = runSimulation({ ...base, marginalRate: 0.33 });
    expect(a.ibkr.records.map((record) => record.calendarYear)).toEqual(
      b.ibkr.records.map((record) => record.calendarYear),
    );
  });

  it('uses CV in a historical downturn when it produces lower tax', () => {
    const result = runSimulation({ ...base, horizonYears: 1, historicalEndYear: 2008 });
    expect(result.ibkr.records[1].taxDetail?.selectedMethod).toBe('CV');
  });
});
