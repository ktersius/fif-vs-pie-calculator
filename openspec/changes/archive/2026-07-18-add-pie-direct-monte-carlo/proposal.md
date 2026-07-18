## Why

The current calculator replays one contiguous historical period, but its naming does not clearly distinguish that “what would have happened” backtest from a probabilistic range of historically conditioned outcomes. Investors comparing a PIE fund with direct US holdings need both views without mistaking either for a forecast.

## What Changes

- Rename and describe the existing experience as a `Historical Backtest` that compares two investment structures over one actual S&P 500 period.
- Add a separate `Monte Carlo Simulation` for InvestNow PIE versus a direct US ETF held through IBKR.
- Generate independent synthetic market paths by resampling paired historical price and dividend returns with a stationary block bootstrap.
- Run both investment structures through the same generated path so results isolate tax and fee differences rather than market selection.
- Present win rates, percentile balances, value differences, tax, and fees across the generated scenarios.
- Keep historical backtesting as the default and retain both existing historical comparisons unchanged.

## Capabilities

### New Capabilities

- `monte-carlo-analysis`: Historically conditioned stationary-block-bootstrap simulation and aggregate PIE-versus-direct outcome reporting.

### Modified Capabilities

- `calculator-interface`: Distinguish Historical Backtest from Monte Carlo Simulation, show method-appropriate controls and explanations, and present Monte Carlo distribution results.

## Impact

- Refactors the PIE-versus-direct simulation path so it can consume either the existing contiguous historical window or an explicit synthetic return path without changing tax or fee formulas.
- Adds a deterministic seeded bootstrap generator, aggregate result types, Monte Carlo result components, and focused tests.
- Updates application headings, analysis-method controls, and historical explanatory text.
- Uses existing TypeScript, React, Recharts, and local market data; no new dependency or runtime network request is required.
