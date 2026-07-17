## Why

The synthetic crash-year model mixes configurable steady returns with randomly placed, randomly sized losses, so it does not represent any real market period and makes the FIF comparative-value outcome harder to evaluate credibly. Replaying actual S&P 500 price and dividend returns provides a simpler, deterministic comparison grounded in complete historical calendar years.

## What Changes

- **BREAKING** Replace configurable market-return, dividend-yield, crash-count, crash-severity, seed, re-roll, and per-year override inputs with a historical period selector.
- Add a static, attributed annual S&P 500 dataset covering completed calendar years from 1957 onward, with separate price-return and dividend-return values.
- Apply the selected historical price return and dividend return to both portfolios for every simulated year.
- Add a historical end-year slider whose window length is locked to the investment horizon and defaults to the latest complete period.
- Preserve the selected end year when the horizon changes, clamping it to the nearest valid complete window when necessary.
- Use calendar years as the primary result labels, retain portfolio-year context, and show each year's applied price return in result tooltips and breakdowns.
- Remove crash markers, crash adjustment controls, random selection helpers, and their analytics events.
- Document that periodic contributions retain the calculator's existing annual timing approximation.

## Capabilities

### New Capabilities

- `historical-market-data`: Defines the static S&P 500 annual price/dividend dataset, attribution, completed-year policy, selected historical window, and annual update expectations.

### Modified Capabilities

- `investment-simulation`: Replaces synthetic crash and constant market/dividend assumptions with the selected sequence of historical annual price and dividend returns.
- `calculator-interface`: Replaces return, dividend, and crash controls with a horizon-locked historical date-range control and historical result context.
- `fif-pie-taxation`: Reframes CV/FDR scenarios around actual historical annual returns rather than designated crash years.
- `site-analytics`: Removes events for controls that no longer exist without adding tracking for the historical controls.

## Impact

- Affects simulation inputs/results, annual portfolio expansion, historical-year mapping, defaults, constants, and tests under `src/lib/`.
- Affects the control panel, balance-chart tooltip, summary context, and year-by-year breakdown under `src/components/` and `src/App.tsx`.
- Removes the crash utility and crash-depth component when no longer referenced.
- Updates OpenSpec requirements, README feature documentation, and analytics definitions.
- Adds no runtime dependency or external API; historical data is committed to the repository and manually updated after each calendar year.
