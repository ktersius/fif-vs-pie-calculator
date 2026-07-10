## Why

Today every crash year applies an identical, hard-coded −15% market return, so the investor cannot explore how the *depth* of a downturn changes long-run outcomes, nor stress-test a single bad year. Allowing a severity range plus targeted per-crash adjustment turns the crash mechanic from a fixed constant into an interactive what-if tool while preserving the deterministic, reproducible philosophy of the model.

## What Changes

- Replace the single `CRASH_RETURN = -0.15` constant with a **configurable severity band** (min/max drop %). Each crash year draws its own depth **uniformly** from the band, derived deterministically by hashing `(seed, year)` so depths are stable as crash count changes.
- Add a **manual override layer**: the investor can adjust an individual crash's depth. Overrides are stored per year and take precedence over the band-generated default; `effectiveDepth(year)` prefers an override, else the hashed default.
- **Band semantics**: the band generates defaults only; a manual override may exceed the band, bounded by outer limits (5%–60%).
- **Override lifecycle**: re-roll (new seed) regenerates defaults **and clears overrides**; changing crash count keeps overrides for years that remain crashes and holds others **dormant** (restored losslessly if re-added); each crash offers a **reset to default**.
- Add a **dual-thumb severity slider** to the control panel (positive drop %, outer bounds 5%–60%, guardrail `min ≤ max`; `min = max` collapses to a fixed depth). Default band **10%–35%**.
- Show each crash year's **actual depth** in the year-by-year breakdown row (e.g. `crash −38%`), with an inline adjust slider and reset.
- Add **crash markers** to the portfolio balance chart at crash years: hovering reveals the depth; clicking opens a popover hosting the **same** slider + reset. Both edit surfaces write one shared override state and re-run the simulation live.
- **BREAKING** (model output): scenario reproducibility is now defined by `(seed, band, overrides)` and default numeric outputs change unless the band is collapsed to `15%–15%`.

## Capabilities

### New Capabilities
<!-- None. -->

### Modified Capabilities
- `investment-simulation`: the "Crash Year Modelling" requirement changes from a fixed −15% return to a per-year depth drawn from a severity band and resolved against manual overrides; adds depth determinism and override-resolution behavior.
- `calculator-interface`: the control panel gains a crash-severity range slider; the year-by-year breakdown displays and can adjust per-crash depth; the portfolio balance chart gains interactive crash markers sharing the adjust control.

## Impact

- **Model core**: `src/lib/crash.ts` (add per-year depth derivation + override resolution), `src/lib/simulation.ts` (use `effectiveDepth(year)` instead of `CRASH_RETURN`), `src/lib/constants.ts` (band bounds/defaults replacing the fixed constant), `src/lib/types.ts` and `src/lib/defaults.ts` (new inputs: `crashSeverityMin`, `crashSeverityMax`, `crashOverrides`).
- **UI**: `src/components/ControlPanel.tsx` (severity range slider), a new shared crash-depth slider component, `src/components/BreakdownTable.tsx` (depth display + inline adjust/reset), `src/components/BalanceChart.tsx` (crash markers with hover/click popover), `src/App.tsx` (override state + lifecycle wiring).
- **Tests**: new determinism/stability tests (depth stable across count changes, override precedence, re-roll clears overrides, `min = max` reproduces legacy −15% outputs when band collapsed).
- No new runtime dependencies; reuses existing React/Recharts/Tailwind stack.
