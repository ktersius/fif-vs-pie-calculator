import { describe, expect, it } from 'vitest';
import { runSimulation } from './simulation';
import type { SimulationInputs } from './types';

const base: SimulationInputs = {
  initialInvestment: 100_000,
  periodicContribution: 250,
  frequency: 'Weekly',
  horizonYears: 20,
  marketReturn: 0.08,
  dividendYield: 0.015,
  marginalRate: 0.39,
  pir: 0.28,
  crashYears: 3,
  crashSeed: 42,
};

describe('runSimulation structure', () => {
  it('produces H + 1 records per platform for the default horizon', () => {
    const result = runSimulation(base);
    expect(result.investNow.records).toHaveLength(21);
    expect(result.ibkr.records).toHaveLength(21);
    expect(result.investNow.records[0].year).toBe(0);
    expect(result.investNow.records[20].year).toBe(20);
  });

  it('honours a custom horizon', () => {
    const result = runSimulation({ ...base, horizonYears: 10 });
    expect(result.ibkr.records).toHaveLength(11);
  });

  it('computes total principal as initial + periodic x instances x horizon', () => {
    const result = runSimulation(base);
    expect(result.totalPrincipal).toBe(100_000 + 250 * 52 * 20);
  });
});

describe('FIF de minimis behaviour', () => {
  it('drags a $100k initial investment into FIF from Year 1', () => {
    const result = runSimulation(base);
    expect(result.ibkr.records[1].taxDetail?.regime).toBe('fif');
  });

  it('keeps a portfolio FIF-exempt when only unrealised growth lifts the balance', () => {
    // No contributions, no dividends -> cost base stays at the initial net (< $100k).
    const result = runSimulation({
      ...base,
      initialInvestment: 90_000,
      periodicContribution: 0,
      dividendYield: 0,
      marketReturn: 0.15,
      crashYears: 0,
    });
    // Balance grows well past $100k, but every year remains exempt.
    const finalBalance = result.ibkr.summary.finalBalance;
    expect(finalBalance).toBeGreaterThan(100_000);
    for (let year = 1; year <= 20; year++) {
      expect(result.ibkr.records[year].taxDetail?.regime).toBe('exempt');
    }
  });
});

describe('balance flooring', () => {
  it('never produces a negative closing balance in an all-crash scenario', () => {
    const result = runSimulation({
      ...base,
      initialInvestment: 5_000,
      periodicContribution: 0,
      horizonYears: 5,
      crashYears: 5,
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

describe('crash-year stability across inputs', () => {
  it('keeps the same crash years when a non-seed input changes', () => {
    const a = runSimulation(base);
    const b = runSimulation({ ...base, marketReturn: 0.12, marginalRate: 0.33 });
    expect(a.crashYears).toEqual(b.crashYears);
  });
});
