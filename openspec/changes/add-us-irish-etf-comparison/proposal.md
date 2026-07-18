## Why

The calculator currently compares a PIE fund with a directly held US ETF, but it cannot answer the separate question of whether a New Zealand investor is better served by a US-domiciled distributing ETF or an Irish-domiciled accumulating ETF. Adding this as a second calculator mode preserves the existing comparison while exposing the materially different withholding-tax, FIF CV, brokerage, and US estate-tax outcomes.

## What Changes

- Add a calculator selector for the existing PIE-vs-US mode and a new US-vs-Irish ETF mode.
- Reuse the existing investment inputs, historical market windows, charts, summaries, and year-by-year presentation across both modes.
- Add the domicile-specific ETF simulation rules: US distributing dividends and foreign tax credits, Irish internal dividend accumulation without investor-level credits, different expense ratios, and US-versus-LSE brokerage.
- Add automatic versus manual IBKR currency-conversion costs to the new mode.
- Assume the FIF regime applies throughout the new mode instead of inferring the investor's aggregate de minimis status from the simulated holding.
- Show ordinary final wealth separately from an inherited-wealth scenario that applies progressive US estate tax to the US-domiciled ETF only.
- Preserve inputs when switching modes and show only controls relevant to the active comparison.

## Capabilities

### New Capabilities

- `etf-domicile-taxation`: Defines the FIF, withholding-tax, foreign-tax-credit, accumulating-fund, and US estate-tax treatment for US- and Irish-domiciled ETFs.

### Modified Capabilities

- `investment-simulation`: Add a second deterministic simulation mode with domicile-specific fees, returns, tax deductions, and inherited-wealth results.
- `calculator-interface`: Add the calculator selector, mode-specific controls and labels, and presentation of the inherited-wealth comparison.

## Impact

- Affects the React application shell, control panel, summary dashboard, charts, and year-by-year breakdown.
- Extends the client-side calculation types, fee helpers, tax logic, and simulation orchestration.
- Adds no backend, persistence, routing, or third-party dependency.
- Preserves the existing PIE-vs-US calculator behavior and default mode.
