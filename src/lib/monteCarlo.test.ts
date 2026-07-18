import { describe, expect, it } from 'vitest';
import { DEFAULT_INPUTS } from './defaults';
import type { HistoricalMarketYear } from './historicalMarketData';
import {
  MONTE_CARLO_RUNS,
  buildHistogram,
  createSeededRandom,
  generateStationaryBootstrapPath,
  percentile,
  runMonteCarlo,
} from './monteCarlo';

const source: HistoricalMarketYear[] = [
  { year: 1, priceReturn: 0.1, dividendReturn: 0.01 },
  { year: 2, priceReturn: 0.2, dividendReturn: 0.02 },
  { year: 3, priceReturn: 0.3, dividendReturn: 0.03 },
];

function sequenceRandom(values: number[]): () => number {
  let index = 0;
  return () => {
    if (index === values.length) throw new Error('Random sequence exhausted');
    return values[index++];
  };
}

describe('stationary block bootstrap', () => {
  it('returns the requested number of paired observations', () => {
    const path = generateStationaryBootstrapPath(20, createSeededRandom(42), source);
    expect(path).toHaveLength(20);
    for (const observation of path) {
      expect(source).toContain(observation);
      expect(observation.dividendReturn).toBe(observation.priceReturn / 10);
    }
  });

  it('continues chronologically, wraps, and can restart a block', () => {
    const path = generateStationaryBootstrapPath(
      4,
      sequenceRandom([0.9, 0.5, 0.5, 0.1, 0.7]),
      source,
    );
    expect(path.map((observation) => observation.year)).toEqual([3, 1, 2, 3]);
  });

  it('is deterministic for a seed', () => {
    const first = generateStationaryBootstrapPath(20, createSeededRandom(42), source);
    const second = generateStationaryBootstrapPath(20, createSeededRandom(42), source);
    expect(first).toEqual(second);
  });
});

describe('Monte Carlo aggregation', () => {
  it('uses linear percentiles', () => {
    expect(percentile([0, 10, 20, 30, 40], 0.1)).toBe(4);
    expect(percentile([0, 10, 20, 30, 40], 0.5)).toBe(20);
    expect(percentile([0, 10, 20, 30, 40], 0.9)).toBe(36);
  });

  it('accounts for every value in histogram buckets', () => {
    const histogram = buildHistogram([-10, -5, 0, 5, 10], 4);
    expect(histogram.reduce((total, bucket) => total + bucket.count, 0)).toBe(5);
  });

  it('runs 5,000 deterministic shared-path scenarios', () => {
    const first = runMonteCarlo({ ...DEFAULT_INPUTS, horizonYears: 1 });
    const second = runMonteCarlo({ ...DEFAULT_INPUTS, horizonYears: 1 });

    expect(first).toEqual(second);
    expect(first.runCount).toBe(MONTE_CARLO_RUNS);
    expect(
      first.wins.pie.count + first.wins.direct.count + first.wins.ties.count,
    ).toBe(MONTE_CARLO_RUNS);
    expect(first.histogram.reduce((total, bucket) => total + bucket.count, 0)).toBe(
      MONTE_CARLO_RUNS,
    );
    expect(first.finalBalances.pie.p10).toBeLessThanOrEqual(first.finalBalances.pie.p50);
    expect(first.finalBalances.pie.p50).toBeLessThanOrEqual(first.finalBalances.pie.p90);
  });
});
