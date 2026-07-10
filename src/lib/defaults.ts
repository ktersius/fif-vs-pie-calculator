import type { Frequency, SimulationInputs } from './types';

export const DEFAULT_INPUTS: SimulationInputs = {
  initialInvestment: 100_000,
  periodicContribution: 250,
  frequency: 'Weekly',
  horizonYears: 20,
  marketReturn: 0.08,
  dividendYield: 0.015,
  marginalRate: 0.39,
  pir: 0.28,
  crashYears: 3,
  crashSeed: 1337,
  crashSeverityMin: 0.1,
  crashSeverityMax: 0.35,
  crashOverrides: {},
};

export const FREQUENCIES: Frequency[] = ['Weekly', 'Fortnightly', 'Monthly', 'Annually'];

export const MARGINAL_RATES = [0.105, 0.175, 0.3, 0.33, 0.39];

export const PIR_RATES = [0.105, 0.175, 0.28];

/** Generate a new random seed for a crash-year re-roll. */
export function newSeed(): number {
  return Math.floor(Math.random() * 0x7fffffff);
}
