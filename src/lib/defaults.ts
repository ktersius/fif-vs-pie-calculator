import type { Frequency, SimulationInputs } from './types';
import { LATEST_HISTORICAL_YEAR } from './historicalMarketData';

export const DEFAULT_INPUTS: SimulationInputs = {
  initialInvestment: 100_000,
  periodicContribution: 250,
  frequency: 'Weekly',
  horizonYears: 20,
  historicalEndYear: LATEST_HISTORICAL_YEAR,
  marginalRate: 0.39,
  pir: 0.28,
  fxMode: 'auto',
};

export const FREQUENCIES: Frequency[] = ['Weekly', 'Fortnightly', 'Monthly', 'Annually'];

export const MARGINAL_RATES = [0.105, 0.175, 0.3, 0.33, 0.39];

export const PIR_RATES = [0.105, 0.175, 0.28];
