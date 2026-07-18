import {
  HISTORICAL_MARKET_DATA,
  type HistoricalMarketYear,
} from './historicalMarketData';
import { runPieDirectMarketPath } from './simulation';
import type { SimulationInputs } from './types';

export const MONTE_CARLO_RUNS = 5_000;
export const MONTE_CARLO_SEED = 42;
export const MONTE_CARLO_MEAN_BLOCK_LENGTH = 4;

export interface Percentiles {
  p10: number;
  p50: number;
  p90: number;
}

export interface PlatformPercentiles {
  pie: Percentiles;
  direct: Percentiles;
}

export interface HistogramBucket {
  min: number;
  max: number;
  count: number;
}

export interface MonteCarloResult {
  runCount: number;
  seed: number;
  meanBlockLength: number;
  wins: {
    pie: { count: number; rate: number };
    direct: { count: number; rate: number };
    ties: { count: number; rate: number };
  };
  finalBalances: PlatformPercentiles;
  finalValueDifference: Percentiles;
  totalTax: PlatformPercentiles;
  totalFees: PlatformPercentiles;
  histogram: HistogramBucket[];
}

export function createSeededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(1_664_525, state) + 1_013_904_223) >>> 0;
    return state / 4_294_967_296;
  };
}

export function generateStationaryBootstrapPath(
  horizonYears: number,
  random: () => number,
  source: readonly HistoricalMarketYear[] = HISTORICAL_MARKET_DATA,
): HistoricalMarketYear[] {
  if (!Number.isInteger(horizonYears) || horizonYears < 1) {
    throw new Error(`horizonYears must be a positive integer, got ${horizonYears}`);
  }
  if (source.length === 0) {
    throw new Error('Bootstrap source data is empty');
  }

  let index = Math.floor(random() * source.length);
  const path: HistoricalMarketYear[] = [];
  for (let year = 0; year < horizonYears; year++) {
    if (year > 0) {
      index =
        random() < 1 / MONTE_CARLO_MEAN_BLOCK_LENGTH
          ? Math.floor(random() * source.length)
          : (index + 1) % source.length;
    }
    path.push(source[index]);
  }
  return path;
}

export function percentile(values: readonly number[], probability: number): number {
  if (values.length === 0) throw new Error('Cannot calculate a percentile of an empty array');
  if (probability < 0 || probability > 1) {
    throw new Error(`Percentile probability must be between 0 and 1, got ${probability}`);
  }
  return percentileFromSorted([...values].sort((a, b) => a - b), probability);
}

function percentileFromSorted(values: readonly number[], probability: number): number {
  const position = (values.length - 1) * probability;
  const lower = Math.floor(position);
  const upper = Math.ceil(position);
  const weight = position - lower;
  return values[lower] + (values[upper] - values[lower]) * weight;
}

function summarize(values: number[]): Percentiles {
  values.sort((a, b) => a - b);
  return {
    p10: percentileFromSorted(values, 0.1),
    p50: percentileFromSorted(values, 0.5),
    p90: percentileFromSorted(values, 0.9),
  };
}

export function buildHistogram(values: readonly number[], bucketCount = 20): HistogramBucket[] {
  if (values.length === 0) throw new Error('Cannot build a histogram from an empty array');
  if (!Number.isInteger(bucketCount) || bucketCount < 1) {
    throw new Error(`bucketCount must be a positive integer, got ${bucketCount}`);
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  if (min === max) return [{ min, max, count: values.length }];

  const width = (max - min) / bucketCount;
  const buckets = Array.from({ length: bucketCount }, (_, index) => ({
    min: min + index * width,
    max: min + (index + 1) * width,
    count: 0,
  }));
  for (const value of values) {
    buckets[Math.min(Math.floor((value - min) / width), bucketCount - 1)].count++;
  }
  return buckets;
}

export function runMonteCarlo(inputs: SimulationInputs): MonteCarloResult {
  const random = createSeededRandom(MONTE_CARLO_SEED);
  const pieBalances: number[] = [];
  const directBalances: number[] = [];
  const differences: number[] = [];
  const pieTaxes: number[] = [];
  const directTaxes: number[] = [];
  const pieFees: number[] = [];
  const directFees: number[] = [];
  let pieWins = 0;
  let directWins = 0;
  let ties = 0;

  for (let run = 0; run < MONTE_CARLO_RUNS; run++) {
    const path = generateStationaryBootstrapPath(inputs.horizonYears, random);
    const result = runPieDirectMarketPath(inputs, path);
    const pie = result.left.summary;
    const direct = result.right.summary;
    const difference = direct.finalBalance - pie.finalBalance;

    pieBalances.push(pie.finalBalance);
    directBalances.push(direct.finalBalance);
    differences.push(difference);
    pieTaxes.push(pie.totalTax);
    directTaxes.push(direct.totalTax);
    pieFees.push(pie.fees.total);
    directFees.push(direct.fees.total);

    if (difference > 0) directWins++;
    else if (difference < 0) pieWins++;
    else ties++;
  }

  return {
    runCount: MONTE_CARLO_RUNS,
    seed: MONTE_CARLO_SEED,
    meanBlockLength: MONTE_CARLO_MEAN_BLOCK_LENGTH,
    wins: {
      pie: { count: pieWins, rate: pieWins / MONTE_CARLO_RUNS },
      direct: { count: directWins, rate: directWins / MONTE_CARLO_RUNS },
      ties: { count: ties, rate: ties / MONTE_CARLO_RUNS },
    },
    finalBalances: { pie: summarize(pieBalances), direct: summarize(directBalances) },
    finalValueDifference: summarize(differences),
    totalTax: { pie: summarize(pieTaxes), direct: summarize(directTaxes) },
    totalFees: { pie: summarize(pieFees), direct: summarize(directFees) },
    histogram: buildHistogram(differences),
  };
}
