## Context

The workspace is currently empty apart from the OpenSpec scaffolding and the source specification document. We are building a greenfield, client-only React single-page application that projects two NZ investment vehicles over a configurable horizon (default 20 years) and compares their fee and tax outcomes. All computation is deterministic given the inputs (with the exception of crash-year placement, which is randomised) and runs entirely in the browser — there is no backend, persistence, or external API.

The domain is tax-sensitive: the FIF CV method and PIE FDR method must be implemented precisely per the source specification, since the entire value of the tool is demonstrating their divergence, especially in crash years.

## Goals / Non-Goals

**Goals:**
- Establish a minimal, modern React + Tailwind + charting toolchain (Vite).
- Implement a pure, well-tested calculation core (simulation + taxation) decoupled from React.
- Render an interactive control panel, a portfolio balance chart, a tax drag chart, and a summary dashboard.
- Memoise the iterative simulation so it only recomputes on input change.
- Correctly handle edge cases (micro-contributions consumed by IBKR minimums, crash-year selection, de minimis boundary).

**Non-Goals:**
- No user accounts, persistence, or saving/loading scenarios.
- No backend or server-side computation.
- No handling of investment vehicles beyond the two specified (InvestNow PIE and IBKR direct US ETF).
- No tax advice disclaimers workflow beyond a simple static note (optional).
- No support for changing the fixed economic constants (exchange rate, fee rates, withholding, FDR rate) via the UI; only the documented inputs (including investment horizon) are configurable.

## Decisions

**Build tooling: Vite + React + TypeScript.**
Vite gives a fast, zero-config SPA setup. TypeScript is chosen over plain JS because the tax/fee math benefits from typed input and result models to prevent unit and sign errors. Alternative considered: Create React App (deprecated/slower) — rejected.

**Styling: Tailwind CSS.**
Specified by the source document; utility classes keep the control panel and dashboard layout fast to build without a component library. Alternative: a component library (MUI) — rejected as heavier than needed.

**Charting: Recharts.**
The source allows Recharts or Chart.js. Recharts is React-native (declarative components, `ResponsiveContainer`) which fits the component model better than the imperative Chart.js canvas API. Alternative: Chart.js via react-chartjs-2 — acceptable fallback if Recharts bundle size becomes a concern.

**Pure calculation core separated from UI.**
The simulation and taxation logic live in framework-agnostic TypeScript modules (`src/lib/`) returning a per-year result array plus aggregate summary. This makes the tax algorithms unit-testable in isolation and keeps React components thin. The UI calls a single `runSimulation(inputs)` entry point wrapped in `useMemo`. Tests use Vitest (native to the Vite toolchain) with one test per spec scenario.

**Data model: per-year records.**
`runSimulation` returns, for each platform, an array of H + 1 yearly records (Year 0..H, where H is the configurable investment horizon, default 20) each capturing opening balance, contributions, growth, dividends, fees, tax, and closing balance, plus method-selection detail (FDR vs CV) for the tax drag chart and debugging. Aggregates are derived from these records.

**Crash-year selection is deterministic with explicit re-roll.**
Crash years are a set of N distinct integers in [1, H] (where H is the investment horizon) held in React state, not re-derived on every input change. They are computed once on initial load and only recomputed when the investor clicks an explicit "Re-roll crash years" button. This lets the investor vary other inputs (return, contribution, tax rate, etc.) while holding the crash-year placement fixed, so changes in outcome are attributable to the input they changed rather than to shifting crash years. Both portfolios share the same crash-year set for an apples-to-apples comparison. Selection uses a seedable PRNG so a given seed reproduces the same set; the re-roll button advances to a new seed. When the number-of-crash-years input changes, the set is resized deterministically from the current seed (trimming the most recently added years or extending with new distinct years) rather than fully re-rolled, so increasing 3→4 keeps the original 3 and adds 1. Alternative considered: re-rolling inside the memoised `runSimulation` on every input change — rejected because it makes comparisons noisy and non-reproducible.

**IBKR brokerage fee: strict 1% cap.**
The brokerage fee is USD $0.35 per order, strictly capped at 1% of the order value, converted to NZD. Because the 1% cap binds below the $0.35 minimum for any order under ~USD $35, the effective fee is `min(0.35 USD, 0.01 × orderUSD)` converted to NZD. Consequently fees can never exceed ~1.03% of a contribution (1% brokerage + 0.03% FX), so per-instance net amounts are always positive and there is no micro-contribution consumption case to handle. Alternative considered: treating $0.35 as an absolute floor (which would let fees exceed a tiny contribution) — rejected per decision to use the strict cap.

**Cost-base tracking (FIF de minimis).**
Cost base = cumulative net contributions + cumulative net (post-withholding) reinvested dividends, and explicitly excludes unrealised market growth. The $100,000 threshold is tested continuously; since the cost base is monotonically non-decreasing, the year's end-of-year cost base is its maximum, so the FIF-vs-exempt decision for a year uses the end-of-year cost base (including that year's contributions and reinvested dividends). A $100,000 initial investment therefore breaches in Year 1 on the first contribution.

**Balance flooring and fee itemisation.**
Portfolio balances are floored at $0 each year (cash account, no margin), preventing negative compounding in multi-crash scenarios. Fees are tracked per category (InvestNow transaction, IBKR FX, IBKR brokerage, management) so the dashboard can itemise them and show a per-platform combined total.

**IBKR per-contribution fee loop.**
Because IBKR fees apply per order, the annual contribution is split into `frequency` instances and each is charged the FX fee (0.03% of NZD amount) plus the 1%-capped brokerage fee converted to NZD. Net per-instance amounts are summed for the year and, by the strict cap, remain positive.

## Risks / Trade-offs

- [Tax logic misinterpretation] → The specs encode the exact formulas from the source document as testable scenarios; implement Vitest unit tests mirroring each scenario, including the crash-year CV advantage and de minimis boundary.
- [Non-reproducible outputs / noisy comparisons] → Crash years are deterministic state driven by a seed and only change on explicit re-roll, so results are stable while other inputs vary; the seed reproduces the same set.
- [Floating-point rounding across 20 iterative years] → Keep money as numbers but round only for display; avoid premature rounding inside the loop to prevent compounding drift.
- [Extreme multi-crash scenarios] → Floor balances at $0 so a total loss wipes out the portfolio rather than compounding negatively.
- [Recharts bundle size] → Acceptable for a single-page tool; if it becomes an issue, tree-shake imports or switch to Chart.js.

## Open Questions

- None outstanding. All prior questions (brokerage cap, cost-base semantics, CV dividends, contribution timing, negative-balance handling, fee itemisation, testing framework, crash-year resize) have been resolved.
