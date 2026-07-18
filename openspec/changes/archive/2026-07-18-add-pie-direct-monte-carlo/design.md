## Context

The application currently has two comparison modes, both driven by one selected contiguous historical S&P 500 window. That deterministic path is useful evidence, but the page title and output do not clearly say that it is a backtest of one actual period.

The PIE-versus-direct simulation already contains the required tax and fee behavior. Monte Carlo should supply alternative annual market paths to that same engine, not create another investment model. The repository has 69 paired annual price and dividend observations, which is too small for a credible high-parameter forecasting model but sufficient for a historically conditioned block bootstrap.

## Goals / Non-Goals

**Goals:**

- Clearly distinguish Historical Backtest (“what would have happened”) from Monte Carlo Simulation (“a range conditioned on historical behavior”).
- Generate reproducible synthetic multi-year paths while preserving short-term sequencing and same-year price/dividend relationships.
- Compare InvestNow PIE and direct US holdings on exactly the same path in every run.
- Show distribution outcomes rather than a misleading representative annual path.
- Preserve all existing historical results and both historical comparison modes.

**Non-Goals:**

- Predicting future returns or assigning confidence to tax-law assumptions.
- Monte Carlo support for US-versus-Irish domicile comparison in this change.
- Normal-distribution, GARCH, regime-switching, or user-entered return models.
- Runtime market-data downloads, background services, or new dependencies.
- Displaying year-by-year drill-down for thousands of synthetic scenarios.

## Decisions

### Add an analysis-method selector above the comparison selector

`Historical Backtest` remains the default. It retains the existing PIE-versus-US and US-versus-Irish comparison selector, historical-period slider, charts, and breakdown.

`Monte Carlo Simulation` is explicitly labelled as PIE fund versus direct US ETF. The historical comparison selector and historical-period slider are hidden because they do not affect generated paths. Returning to Historical Backtest restores the previously selected comparison and end year.

Alternative considered: add Monte Carlo as a third comparison mode. Rejected because it mixes the question being compared with the method used to generate market paths.

### Extract one PIE-versus-direct market-path runner

The existing deterministic PIE and direct-ETF calculations will be called through a small shared function that accepts an explicit array of annual price/dividend observations. The existing `runSimulation(inputs)` remains a wrapper that obtains the selected contiguous historical window and decorates the historical result exactly as today.

Monte Carlo calls the same market-path runner and retains only aggregate outcomes from each run. Tax, fee, contribution, de minimis, FDR/CV, FTC, balance-floor, and exit behavior remain single-sourced.

### Use a seeded stationary block bootstrap

Use the local paired annual observations as circular source data. For each synthetic year:

1. Start at a random historical index.
2. Continue to the following source year with probability 0.75.
3. Start a new random block with probability 0.25.
4. Wrap from the latest source year to the earliest when continuing a block.

This produces geometric block lengths averaging four years. Price and dividend returns always come from the same source record. A small deterministic pseudorandom generator seeded with `42` makes identical inputs produce identical results.

Alternative considered: sample individual years independently. Rejected because it removes crash/recovery sequences and short-term dependence. More complex fitted statistical models are rejected because the annual dataset is too small to support their added assumptions.

### Fix sampling settings for the first version

Run 5,000 scenarios with seed 42 and mean block length four years. Display these assumptions but do not expose tuning controls. Existing investor inputs and horizon remain configurable.

Five thousand runs keep maximum Monte Carlo sampling error for a win rate near ±1.4 percentage points at 95% confidence while remaining small enough for synchronous client-side execution. Add a worker or configurable run count only if measured performance requires it.

### Present distributions, not synthetic timelines

The Monte Carlo view will show:

- PIE/direct win counts and rates.
- 10th percentile, median, and 90th percentile final balances.
- 10th percentile, median, and 90th percentile direct-minus-PIE value difference, explicitly labelled so positive means direct ahead and negative means PIE ahead.
- Corresponding tax and fee distributions.
- A histogram of final-value differences with text-backed PIE-ahead, near-tie, and direct-ahead range indicators.

Historical balance charts, tax-drag charts, and year-by-year breakdowns remain exclusive to Historical Backtest because Monte Carlo has no single authoritative path.

### Keep interpretation explicit

The interface will state that paths are resampled from observed annual S&P 500 data and are not forecasts. Win rates describe the bootstrap model under current calculator assumptions, not the probability of future legal or market outcomes.

## Risks / Trade-offs

- **Fixed four-year block length is an assumption** → Display it with the result and keep the generator isolated so later evidence can justify another value.
- **Synchronous simulation could pause slower devices** → Retain only per-run summaries, use 5,000 runs, and move computation to a worker only if profiling shows a problem.
- **Synthetic paths reuse a short historical record** → Label results as historically conditioned and keep the actual Historical Backtest available alongside them.
- **Refactoring could change historical outputs** → Keep `runSimulation` as the public wrapper and add regression tests asserting existing results remain identical.
- **Users may read win rate as a forecast** → Use explicit method labels and a visible interpretation warning in the Monte Carlo result.
