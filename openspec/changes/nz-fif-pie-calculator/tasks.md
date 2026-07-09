## 1. Project Scaffolding

- [ ] 1.1 Initialise a Vite React + TypeScript project in the workspace root
- [ ] 1.2 Install and configure Tailwind CSS (config, directives in main stylesheet)
- [ ] 1.3 Install Recharts for charting
- [ ] 1.4 Install and configure Vitest for unit testing
- [ ] 1.5 Verify the dev server runs and renders a placeholder App

## 2. Calculation Core — Types and Constants

- [ ] 2.1 Create `src/lib/constants.ts` with exchange rate, ETF management fee, withholding tax, and InvestNow/IBKR fee constants
- [ ] 2.2 Create `src/lib/types.ts` with `SimulationInputs` (including investment horizon), per-year `YearRecord`, per-platform result, and aggregate `Summary` types
- [ ] 2.3 Add a frequency-to-instances map (Weekly 52, Fortnightly 26, Monthly 12, Annually 1)

## 3. Fee Helpers

- [ ] 3.1 Implement InvestNow buy-fee and sell-fee helpers (0.50%)
- [ ] 3.2 Implement IBKR FX fee (0.03% of NZD amount) helper
- [ ] 3.3 Implement IBKR brokerage fee helper: min(USD $0.35, 1% of order value) converted to NZD (strict 1% cap)
- [ ] 3.4 Implement per-contribution net-amount helper (FX + capped brokerage deducted; always positive under the strict cap)

## 4. Taxation Module (`fif-pie-taxation`)

- [ ] 4.1 Implement PIE FDR tax: Taxable Income = Opening Balance × 0.05, PIE Tax = Taxable Income × PIR (levied even in crash years)
- [ ] 4.2 Implement FIF cost-base tracking (cumulative net contributions + cumulative net post-withholding reinvested dividends; excludes unrealised growth)
- [ ] 4.3 Implement FIF-exempt dividend-only tax with capped foreign tax credit (year-end cost base ≤ $100,000)
- [ ] 4.4 Implement FIF FDR method net tax (floored at zero)
- [ ] 4.5 Implement FIF CV method net tax using GROSS dividends, with CV Income floored at zero
- [ ] 4.6 Implement continuous de minimis test (year-end cost base > $100,000 → FIF for whole year) and method selection: Net Tax Owed = min(FDR Net Tax, CV Net Tax)

## 5. Simulation Engine (`investment-simulation`)

- [ ] 5.1 Implement a seedable PRNG and deterministic crash-year selection: N distinct years in [1, H] (H = horizon) derived from a seed, shared by both portfolios, stable unless the seed changes, resized (keep-and-add / trim) when N changes, and capped at min(5, H)
- [ ] 5.2 Implement portfolio initialisation (Year 0) applying InvestNow and IBKR entry fees
- [ ] 5.3 Implement annual contribution computation for InvestNow (aggregate 0.50% fee)
- [ ] 5.4 Implement annual contribution computation for IBKR (per-instance FX + capped brokerage fee loop)
- [ ] 5.5 Implement the annual loop over Years 1..H with balance expansion (contribution → growth/crash → dividends → withholding → management fee), flooring the closing balance at $0
- [ ] 5.6 Wire taxation into each year and record the closing balance and per-year detail (including per-category fees and FDR/CV method used)
- [ ] 5.7 Apply final-year (Year H) exit fees (InvestNow 0.50% sell; IBKR single FX + capped brokerage)
- [ ] 5.8 Expose a single `runSimulation(inputs)` returning H + 1 per-year records for both platforms plus aggregates

## 6. Aggregation

- [ ] 6.1 Compute Total Principal Contributed
- [ ] 6.2 Compute Final Net Balance per platform
- [ ] 6.3 Compute itemised fees per platform (transaction, FX, brokerage, management) plus a combined per-platform total
- [ ] 6.4 Compute Total NZ Tax Paid per platform

## 7. UI — Control Panel (`calculator-interface`)

- [ ] 7.1 Build input controls with specified ranges/options and defaults (initial investment, periodic contribution, frequency, investment horizon, market return, dividend yield, marginal rate, PIR, crash years)
- [ ] 7.2 Constrain numeric inputs to their min/max and clamp crash years to min(5, horizon)
- [ ] 7.3 Hold a crash-year seed in state and add a "Re-roll crash years" button that advances the seed (crash years stable across other input changes)
- [ ] 7.4 Hold inputs in React state and pass to a memoised `runSimulation` via `useMemo`

## 8. UI — Charts and Dashboard

- [ ] 8.1 Build the portfolio balance line/area chart (Year 0 through the horizon year, one series per platform)
- [ ] 8.2 Build the tax drag bar chart (per-year tax by platform)
- [ ] 8.3 Build the summary dashboard cards (principal, final balances, itemised fees with combined total, tax)
- [ ] 8.4 Add NZD currency and percentage formatters and use them across charts and dashboard without mutating computed values

## 9. Tests and Verification

- [ ] 9.1 Add unit tests for PIE FDR tax (positive and crash years)
- [ ] 9.2 Add unit tests for FIF de minimis (unrealised growth excluded; $100k initial breaches in Year 1) and dividend-only tax with FTC cap
- [ ] 9.3 Add unit tests for FDR vs CV selection (CV using gross dividends), including CV advantage in crash years
- [ ] 9.4 Add unit tests for balance flooring at $0 in extreme multi-crash scenarios and IBKR capped-brokerage fees
- [ ] 9.5 Add unit tests for deterministic crash-year selection (same seed reproduces the set; stable when non-seed inputs change; keep-and-add on count increase)
- [ ] 9.6 Manually verify the app updates all outputs on input change, defaults load correctly, and re-roll changes crash years while other input changes do not
