## Context

The application is a client-only React calculator with one hard-coded comparison: InvestNow PIE versus a direct US ETF held through IBKR. `App` owns the input state and simulation memoisation, while the dashboard, charts, and breakdown table read platform-specific `investNow` and `ibkr` result properties.

The new comparison is a separate investor question rather than a replacement for the existing calculator. It must reuse the historical dataset and presentation without duplicating the application or weakening the existing tax tests. The model continues to use a fixed NZD/USD rate and annual timing approximation.

## Goals / Non-Goals

**Goals:**

- Add an accessible selector between PIE-vs-US and US-vs-Irish modes.
- Preserve the existing mode as the default with unchanged calculations.
- Reuse common inputs, historical windows, charts, summaries, and breakdown behaviour.
- Model US distributing and Irish accumulating ETFs under FIF with distinct fees, tax credits, expense ratios, and estate-tax exposure.
- Keep ordinary terminal wealth separate from the inherited-wealth scenario.
- Keep all calculations deterministic and testable in the existing client-side test suite.

**Non-Goals:**

- No third calculator page, client-side route, backend, persistence, or shareable URL state.
- No de minimis calculation in the US-vs-Irish mode; the mode explicitly assumes FIF applies.
- No configurable exchange rate, ETF ticker, expense ratio, tax treaty, or estate-tax schedule.
- No intra-year contribution timing, live ETF prices, live brokerage fees, or external market-data API.
- No annual brokerage charge for selling units to fund New Zealand tax; tax remains a direct portfolio deduction, matching the existing model.

## Decisions

**Use one application shell with a native radio-group selector.**

`App` stores a `CalculatorMode` value with `pie-vs-us` as the default. A visually segmented native radio group switches modes. This preserves browser accessibility without adding a tabs framework or routes. Alternative considered: separate pages or routes. Rejected because both calculators share nearly the entire interface and no shareable URL requirement exists.

**Use one shared UI result contract.**

Both simulation runners return a common `CalculatorResult` shape containing `left` and `right` platform results plus display metadata such as label, short label, colour, annual records, summary, and optional inherited balance. Existing calculation-specific tax detail remains a discriminated union for the breakdown panel.

This removes hard-coded `investNow` and `ibkr` assumptions from the dashboard, charts, and table without forcing the tax engines into one generic algorithm. Alternative considered: duplicate every result component for the second mode. Rejected because it would create parallel UI paths for identical presentation.

**Keep separate simulation runners and reuse existing helpers.**

The existing PIE-vs-US runner remains responsible for its current behaviour. A US-vs-Irish runner reuses the historical-window, contribution-frequency, formatting, and common balance helpers while applying domicile-specific annual progression. A speculative simulation framework or new module hierarchy is unnecessary for two concrete modes.

**Keep balances in NZD.**

Historical returns and percentage expenses are currency-independent while the exchange rate is fixed. Balances therefore remain in NZD, and USD conversion is used only where a charge or threshold is denominated in USD. Alternative considered: converting the entire simulation state to USD and translating tax back to NZD each year. Rejected because it produces the same result under a fixed exchange rate with more unit conversions.

**Preserve one input state across modes.**

Common investment inputs remain unchanged when switching. PIE PIR and FX conversion mode remain in the state but only the relevant control is shown. Hidden mode-specific values are preserved so switching back restores the investor's prior selection.

**Apply the selected FX method to each IBKR order.**

Auto conversion costs 0.03% of the converted amount with no separate minimum. Manual spot conversion costs the greater of 0.002% of converted USD or USD 2, capped at the gross converted amount. Both compared ETFs use the same FX method; their brokerage differs by exchange.

**Reuse the existing US brokerage approximation.**

US orders use the existing USD 0.35 minimum capped at 1% of trade value. The model does not invent a fixed ETF share price solely to calculate a per-share commission that would normally remain at the minimum for the supported retail order range. Irish ETF orders use 0.05% of trade value with a USD 2 minimum, capped at the gross order amount.

**Model accumulating dividends as unit-value growth.**

For the Irish ETF, gross index dividends incur 15% internal withholding and the net amount remains inside the fund. No external distribution or investor-level foreign tax credit is recorded. Its CV income is floored at zero after price growth, net internally accumulated dividends, and the Irish ETF expense ratio. A negative price-only return does not guarantee zero CV income if net accumulated dividends offset the decline.

**Calculate estate tax as a separate terminal scenario.**

Ordinary final balances continue to represent liquidation after exit fees. The inherited-wealth summary uses the terminal pre-exit holding value. The US ETF applies the statutory progressive estate-tax schedule and USD 13,000 unified credit for a nonresident noncitizen; the Irish ETF applies no US estate tax. Estate tax does not alter annual records, charts, ordinary final balance, or total NZ tax.

## Risks / Trade-offs

- [Shared result refactor changes every output component] → Keep the default mode and existing simulation tests unchanged, then add component tests for labels and mode switching.
- [Tax or fee constants become outdated] → Keep them named and centralised, cite their effective assumptions in the interface, and update through a later spec change when regulations or pricing change.
- [Assuming FIF applies may not match every investor] → State the assumption beside the mode selector and in the results; do not imply the simulated holding determines aggregate FIF status.
- [Estate tax depends on deductions, gifts, domicile, and future law] → Label it as an illustrative no-deductions scenario and keep it separate from ordinary investment performance.
- [Fixed FX and annual contribution timing reduce realism] → Retain the existing documented approximations so the comparison isolates domicile effects rather than adding an unrelated forecasting model.

## Migration Plan

1. Introduce the mode and shared result types while adapting the existing runner to the shared UI contract.
2. Update the existing output components to use platform metadata and verify the default mode remains visually and numerically unchanged.
3. Add domicile tax, fee, and simulation functions with focused deterministic tests.
4. Add the selector, conditional controls, inherited-wealth summary, and new-mode breakdown panels.
5. Deploy as the same static application. Rollback consists of reverting the change; no persisted data or migration is involved.

## Open Questions

- None. The comparison is a second mode, FIF applies throughout it, and estate tax is shown only as a separate inherited-wealth scenario.
