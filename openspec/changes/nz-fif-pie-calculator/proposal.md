## Why

New Zealand investors choosing between a locally-domiciled PIE fund (InvestNow Foundation Series) and a directly-held US ETF (via Interactive Brokers, taxed under the FIF regime) face materially different fee and tax outcomes that are hard to reason about intuitively — especially the way the FIF Comparative Value (CV) method softens tax during market crashes while PIE Fair Dividend Rate (FDR) tax is levied even in down years. There is no accessible tool that projects these two vehicles side by side over a long horizon, so investors cannot see the true long-term impact of fee structures and tax regimes on their capital.

## What Changes

- Introduce a single-page React application that simulates a 20-year investment comparison between an InvestNow PIE fund and an IBKR direct US ETF holding.
- Add a control panel of investor inputs (initial investment, periodic contribution, frequency, investment horizon, market return, dividend yield, marginal tax rate, PIR, and number of simulated crash years).
- Implement platform-specific fee models: InvestNow buy/sell transaction fees; IBKR per-contribution FX auto-conversion fees and tiered USD brokerage minimums converted to NZD.
- Implement the two tax regimes: PIE FDR taxation using the PIR, and FIF taxation with a $100,000 NZD de minimis threshold, choosing the lesser of the FDR and CV methods with foreign tax credits.
- Add visualisations: a portfolio balance line/area chart over the investment horizon, a per-year tax drag bar chart, and a summary dashboard (principal contributed, final net balances, total fees, total NZ tax).
- Handle edge cases such as IBKR transaction minimums, randomised placement of crash years across the horizon, and a configurable investment horizon (default 20 years).

## Capabilities

### New Capabilities
- `investment-simulation`: The 20-year iterative projection engine that grows both portfolios year by year — contributions, market growth, dividends, withholding tax, management fees, platform entry/exit fees, and crash-year handling.
- `fif-pie-taxation`: The New Zealand tax algorithms applied to each portfolio annually — PIE FDR tax via PIR, and FIF de minimis / FDR vs CV method selection with foreign tax credits.
- `calculator-interface`: The React single-page UI — input control panel, charts (portfolio balance and tax drag), and the summary dashboard.

### Modified Capabilities
<!-- None — this is a greenfield project with no existing specs. -->

## Impact

- New React single-page application (Tailwind CSS for styling, Recharts or Chart.js for visualisation).
- New client-side calculation modules for simulation and taxation; heavy iterative work memoised with `useMemo`.
- No backend, persistence, or external API dependencies — all computation runs in the browser.
- Establishes the project's initial tech stack and build tooling (currently an empty workspace).
