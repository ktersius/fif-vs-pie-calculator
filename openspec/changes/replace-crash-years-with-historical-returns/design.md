## Context

The calculator currently applies one investor-configured market return and dividend yield in ordinary years, then replaces the market return in randomly selected crash years with seeded, configurable losses. Crash placement, severity bands, per-year overrides, chart markers, and analytics all depend on that model.

The replacement uses one contiguous sequence of completed S&P 500 calendar years. Each year provides a price return and dividend return, allowing the existing tax engine to compare FDR and CV against observed annual market conditions without runtime data fetching or synthetic crash rules.

## Goals / Non-Goals

**Goals:**

- Replay annual S&P 500 price and dividend returns from 1957 onward.
- Keep both platform simulations on the same contiguous historical window.
- Let the investor slide a window whose length always equals the investment horizon.
- Default to the latest complete historical window and preserve the selected end year when the horizon changes.
- Remove all random crash selection, severity, override, and re-roll behavior.
- Make calendar years and annual returns visible without cluttering the charts.
- Keep the existing annual contribution timing approximation and tax formulas.

**Non-Goals:**

- Fetching live or partial-year market data.
- Simulating monthly or daily returns or contribution timing.
- Forecasting future market returns.
- Allowing manual per-year return or dividend overrides.
- Changing FIF, PIE, fee, withholding-tax, or contribution-fee rules.

## Decisions

### Store a small static annual dataset

Add a repository-owned TypeScript data module containing sorted records shaped like:

```ts
interface HistoricalMarketYear {
  year: number;
  priceReturn: number;
  dividendReturn: number;
}
```

The dataset starts in 1957, ends at the latest completed calendar year, and is attributed to SlickCharts in code-adjacent documentation and the user-facing historical-period context. Static data keeps simulations deterministic, avoids CORS/network failures, and needs no new dependency.

Alternative considered: runtime or build-time fetching. Rejected because it adds failure modes and makes results change outside a code/data update.

### Select a contiguous window by end year

Store `historicalEndYear` as the only market-period simulation input. Derive:

```text
startYear = historicalEndYear - horizonYears + 1
```

The valid end-year range is `earliestDataYear + horizonYears - 1` through `latestDataYear`. The default is the latest data year. When the horizon changes, retain the selected end year if valid; otherwise clamp it to the nearest valid end year.

Alternative considered: a dual-thumb range. Rejected because the horizon already fixes the window length.

### Map portfolio years directly to calendar years

Simulation Year 1 uses the first selected calendar year and Simulation Year H uses the selected end year. Both platforms receive the same historical record. Year 0 remains the initial state and has no market return.

Annual result records replace crash metadata with `calendarYear`, `priceReturn`, and `dividendReturn`. The result also exposes the selected start and end years for summary context.

### Apply historical price and dividend returns through the existing annual expansion

For each year:

```text
Base = Opening Balance + Net Annual Contribution
Growth = Base x Historical Price Return
Gross Dividends = Base x Historical Dividend Return
Net Dividends = Gross Dividends x (1 - withholding rate)
```

The remaining management-fee and tax order stays unchanged. Using the dividend-return component as gross dividend income keeps FTC and CV calculations tied to the same historical year as price growth.

The model deliberately retains its existing simplification that all annual contributions participate in the full annual return. This limitation is documented rather than expanding the change into monthly simulation.

### Simplify the control panel and results

Remove expected market return, dividend yield, crash count, crash severity, re-roll, and manual override controls. Add one native range input for the historical end year, displayed with the derived start/end range and placed near the investment horizon.

Show a compact `Historical period: YYYY-YYYY` line above the summary. Use calendar years as primary labels and portfolio years as secondary context. Balance-chart tooltips and breakdown rows show the annual price return; the chart has no special crash markers or popovers.

### Delete obsolete crash behavior instead of adapting it

Remove seeded PRNG selection, crash-depth calculation, crash override state, the shared crash-depth component, related constants/types/tests, and obsolete analytics events. No compatibility layer is needed because inputs live only in client state and are not persisted.

## Risks / Trade-offs

- **SlickCharts is a secondary data source and the underlying index is proprietary** -> Store only the small annual values required by the calculator, provide visible attribution, and document the source and update date.
- **Dividend return may not exactly match every investor's cash dividend timing** -> Treat the published annual dividend component consistently as gross dividend income and document the annual model.
- **Historical replay is not a forecast** -> Keep the existing illustrative-model disclaimer and identify the selected historical period prominently.
- **Annual contribution timing overstates exposure for later contributions** -> Preserve the existing approximation explicitly and leave monthly simulation out of scope.
- **Removing configurable returns reduces scenario flexibility** -> Prefer one coherent historical model over synthetic combinations that are harder to interpret.

## Migration Plan

1. Add and validate the historical dataset and window-selection helper.
2. Replace simulation inputs and annual record metadata, then update simulation tests.
3. Replace control-panel and result presentation while deleting crash-specific UI/state.
4. Remove obsolete analytics events, utilities, constants, and tests.
5. Update README and source attribution.
6. Run targeted tests and the existing production build.

Rollback is a normal source revert; there is no persisted user data or server-side migration.

## Open Questions

None. Dataset values and attribution text must be verified during implementation.
