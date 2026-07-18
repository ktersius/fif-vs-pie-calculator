import { describe, expect, it } from 'vitest';
import {
  HISTORICAL_MARKET_DATA,
  LATEST_HISTORICAL_YEAR,
} from './historicalMarketData';
import { runSimulation, runUsIrishSimulation } from './simulation';
import type { SimulationInputs } from './types';

const base: SimulationInputs = {
  initialInvestment: 100_000,
  periodicContribution: 250,
  frequency: 'Weekly',
  horizonYears: 20,
  historicalEndYear: LATEST_HISTORICAL_YEAR,
  marginalRate: 0.39,
  pir: 0.28,
  fxMode: 'auto',
};

const marketYear = (year: number) =>
  HISTORICAL_MARKET_DATA.find((record) => record.year === year)!;

describe('runSimulation structure', () => {
  it('produces H + 1 records per platform for the default horizon', () => {
    const result = runSimulation(base);
    expect(result.mode).toBe('pie-vs-us');
    expect(result.left.shortLabel).toBe('InvestNow');
    expect(result.right.shortLabel).toBe('US ETF');
    expect(result.left.records).toHaveLength(21);
    expect(result.right.records).toHaveLength(21);
    expect(result.left.records[0].year).toBe(0);
    expect(result.left.records[0].calendarYear).toBeNull();
    expect(result.left.records[20].year).toBe(20);
    expect(result.left.records[20].calendarYear).toBe(LATEST_HISTORICAL_YEAR);
  });

  it('honours a custom horizon', () => {
    const result = runSimulation({ ...base, horizonYears: 10 });
    expect(result.right.records).toHaveLength(11);
  });

  it('computes total principal as initial + periodic x instances x horizon', () => {
    const result = runSimulation(base);
    expect(result.totalPrincipal).toBe(100_000 + 250 * 52 * 20);
  });

  it('maps a contiguous historical window to portfolio years', () => {
    const result = runSimulation({ ...base, horizonYears: 3, historicalEndYear: 2025 });
    expect(result.historicalStartYear).toBe(2023);
    expect(result.historicalEndYear).toBe(2025);
    expect(result.right.records.slice(1).map((record) => record.calendarYear)).toEqual([
      2023, 2024, 2025,
    ]);
  });
});

describe('historical returns', () => {
  it('applies the selected price and dividend returns to both platforms', () => {
    const historical = marketYear(2008);
    const result = runSimulation({ ...base, horizonYears: 1, historicalEndYear: 2008 });
    const investNow = result.left.records[1];
    const ibkr = result.right.records[1];

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
    const record = result.left.records[1];

    expect(record.netAnnualContribution).toBe(995);
    expect(record.growth).toBeCloseTo(995 * historical.priceReturn, 10);
    expect(record.grossDividends).toBeCloseTo(995 * historical.dividendReturn, 10);
  });

  it('credits InvestNow withholding tax exactly once', () => {
    const result = runSimulation({
      ...base,
      initialInvestment: 220_000,
      periodicContribution: 1_000,
      frequency: 'Weekly',
      horizonYears: 1,
      historicalEndYear: 1991,
    });
    const record = result.left.records[1];
    const detail = record.taxDetail!;
    expect(detail.kind).toBe('pie');
    if (detail.kind !== 'pie') throw new Error('Expected PIE tax detail');

    expect(record.openingBalance).toBe(218_900);
    expect(record.grossDividends).toBeCloseTo(11_267.55512, 6);
    expect(record.netDividends).toBeCloseTo(
      record.grossDividends - detail.withholdingTax,
      6,
    );
    expect(detail.grossTax).toBeCloseTo(3_064.6, 6);
    expect(detail.foreignTaxCredit).toBeCloseTo(1_690.133268, 6);
    expect(record.tax).toBeCloseTo(1_374.466732, 6);
    expect(record.tax + detail.withholdingTax).toBeCloseTo(detail.grossTax, 6);
    expect(result.left.summary.totalTax).toBeCloseTo(record.tax, 6);
  });
});

describe('FIF de minimis behaviour', () => {
  it('drags a $100k initial investment into FIF from Year 1', () => {
    const result = runSimulation(base);
    const detail = result.right.records[1].taxDetail;
    expect(detail?.kind).toBe('direct-fif');
    if (detail?.kind !== 'direct-fif') throw new Error('Expected direct FIF detail');
    expect(detail.regime).toBe('fif');
  });

  it('keeps a portfolio FIF-exempt when only unrealised growth lifts the balance', () => {
    const result = runSimulation({
      ...base,
      initialInvestment: 80_000,
      periodicContribution: 0,
      horizonYears: 1,
      historicalEndYear: 1958,
    });
    expect(result.right.summary.finalBalance).toBeGreaterThan(100_000);
    const detail = result.right.records[1].taxDetail;
    expect(detail?.kind).toBe('direct-fif');
    if (detail?.kind !== 'direct-fif') throw new Error('Expected direct FIF detail');
    expect(detail.regime).toBe('exempt');
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
    for (const rec of result.left.records) {
      expect(rec.closingBalance).toBeGreaterThanOrEqual(0);
    }
    for (const rec of result.right.records) {
      expect(rec.closingBalance).toBeGreaterThanOrEqual(0);
    }
  });
});

describe('historical-period stability across inputs', () => {
  it('keeps the same calendar years when a financial input changes', () => {
    const a = runSimulation(base);
    const b = runSimulation({ ...base, marginalRate: 0.33 });
    expect(a.right.records.map((record) => record.calendarYear)).toEqual(
      b.right.records.map((record) => record.calendarYear),
    );
  });

  it('uses CV in a historical downturn when it produces lower tax', () => {
    const result = runSimulation({ ...base, horizonYears: 1, historicalEndYear: 2008 });
    const detail = result.right.records[1].taxDetail;
    expect(detail?.kind).toBe('direct-fif');
    if (detail?.kind !== 'direct-fif') throw new Error('Expected direct FIF detail');
    expect(detail.selectedMethod).toBe('CV');
  });
});

describe('US vs Irish ETF simulation', () => {
  it('uses the same historical years and distinct expense ratios', () => {
    const result = runUsIrishSimulation({ ...base, horizonYears: 1, historicalEndYear: 2025 });
    const us = result.left.records[1];
    const irish = result.right.records[1];
    expect(result.mode).toBe('us-vs-irish');
    expect(us.calendarYear).toBe(2025);
    expect(irish.calendarYear).toBe(2025);
    expect(us.priceReturn).toBe(irish.priceReturn);
    expect(us.dividendReturn).toBe(irish.dividendReturn);
    expect(irish.managementFee).toBeGreaterThan(us.managementFee);
  });

  it('applies FIF from Year 1 and records external versus internal dividends', () => {
    const result = runUsIrishSimulation({
      ...base,
      initialInvestment: 10_000,
      periodicContribution: 0,
      horizonYears: 1,
      historicalEndYear: 2025,
    });
    const us = result.left.records[1];
    const irish = result.right.records[1];
    expect(us.taxDetail?.kind).toBe('us-fif');
    expect(irish.taxDetail?.kind).toBe('irish-fif');
    expect('externalDividends' in us && us.externalDividends).toBeGreaterThan(0);
    expect('externalDividends' in irish && irish.externalDividends).toBe(0);
  });

  it('applies the selected FX mode and keeps estate tax out of annual balances', () => {
    const auto = runUsIrishSimulation({ ...base, horizonYears: 1, fxMode: 'auto' });
    const manual = runUsIrishSimulation({ ...base, horizonYears: 1, fxMode: 'manual' });
    expect(auto.left.records[0].fees.fxMode).toBe('auto');
    expect(manual.left.records[0].fees.fxMode).toBe('manual');
    expect(auto.left.summary.inheritedWealth?.estateTax).toBeGreaterThan(0);
    expect(auto.right.summary.inheritedWealth?.estateTax).toBe(0);
    expect(auto.left.summary.finalBalance).toBe(
      auto.left.records[auto.left.records.length - 1].closingBalance,
    );
  });

  it('is deterministic', () => {
    expect(runUsIrishSimulation(base)).toEqual(runUsIrishSimulation(base));
  });
});
