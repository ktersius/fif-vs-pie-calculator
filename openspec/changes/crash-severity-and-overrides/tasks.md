## 1. Model core: types, constants, defaults

- [x] 1.1 Replace `CRASH_RETURN` in `src/lib/constants.ts` with severity bounds (`CRASH_SEVERITY_OUTER_MIN = 0.05`, `CRASH_SEVERITY_OUTER_MAX = 0.60`) and default band (`DEFAULT_CRASH_SEVERITY_MIN = 0.10`, `DEFAULT_CRASH_SEVERITY_MAX = 0.35`)
- [x] 1.2 Extend `SimulationInputs` in `src/lib/types.ts` with `crashSeverityMin: number`, `crashSeverityMax: number`, and `crashOverrides: Record<number, number>` (year → drop fraction)
- [x] 1.3 Update `DEFAULT_INPUTS` in `src/lib/defaults.ts` with the default band (0.10–0.35) and an empty overrides map
- [x] 1.4 Add a `YearRecordBase.crashDepth` (effective depth for the year, 0 when not a crash) so charts/rows can display it

## 2. Model core: depth derivation and resolution

- [x] 2.1 Add `crashDepthDefault(seed, year, min, max)` in `src/lib/crash.ts` using a `(seed, year)`-seeded `mulberry32` draw mapped uniformly into [min, max]
- [x] 2.2 Add `effectiveCrashDepth(year, overrides, seed, min, max)` returning `overrides[year] ?? crashDepthDefault(...)`, clamped to the outer bounds
- [x] 2.3 Update `simulateInvestNow` and `simulateIbkr` in `src/lib/simulation.ts` to compute the year's rate from `effectiveCrashDepth` instead of the fixed `CRASH_RETURN`, and record `crashDepth` on each year record
- [x] 2.4 Ensure `min = max` collapses to a single fixed depth (verify legacy 15%–15% reproduces prior numbers)

## 3. Override lifecycle (App state)

- [x] 3.1 Hold `crashOverrides` in `App.tsx` state and thread it into `runSimulation` inputs
- [x] 3.2 On re-roll, generate a new seed AND clear all overrides
- [x] 3.3 On crash-count decrease, keep overrides in state (dormant) so re-adding a year restores its override; only effective when the year is a crash
- [x] 3.4 Add setter/reset handlers: `setCrashOverride(year, depth)` and `resetCrashOverride(year)`, clamping to outer bounds

## 4. Shared adjustment control

- [x] 4.1 Create `src/components/CrashDepthControl.tsx`: slider across outer bounds (5%–60%), current effective depth readout, default/override indicator, and reset button
- [x] 4.2 Wire the control to `setCrashOverride`/`resetCrashOverride` so any change re-runs the simulation live
- [x] 4.3 Ensure the control is presentation-only over shared state so both mount points stay in sync

## 5. Control panel: severity band slider

- [x] 5.1 Add a dual-thumb crash severity range slider to `src/components/ControlPanel.tsx` (positive drop %, outer bounds 5%–60%, default 10%–35%)
- [x] 5.2 Enforce the `min ≤ max` guardrail so the thumbs cannot cross
- [x] 5.3 Display the band (e.g. "Crash severity: 10% – 40%") and re-run the simulation on change

## 6. Balance chart crash markers

- [x] 6.1 Render crash markers at crash-year positions in `src/components/BalanceChart.tsx` (Recharts `ReferenceDot` or custom dot layer)
- [x] 6.2 Show the effective depth on hover of a marker
- [x] 6.3 Open a click-anchored popover hosting `CrashDepthControl` for that year, positioned outside the SVG
- [x] 6.4 Confirm adjusting from the chart updates the shared state and re-simulates

## 7. Breakdown row depth display + adjust

- [x] 7.1 In `src/components/BreakdownTable.tsx`, show the effective crash depth in the crash flag (e.g. `crash −38%`)
- [x] 7.2 Mount `CrashDepthControl` inline in an expanded crash year's row
- [x] 7.3 Verify editing from the row and from the chart popover reflect the same value

## 8. Tests

- [x] 8.1 `crash.test.ts`: default depth is deterministic for `(seed, year)` and lies within the band
- [x] 8.2 `crash.test.ts`: default depth is stable when crash count changes; overrides take precedence; override may exceed band within outer bounds; reset reverts to default
- [x] 8.3 `simulation.test.ts`: `min = max = 0.15` reproduces the legacy fixed −15% outputs
- [x] 8.4 `simulation.test.ts`: an override changes only its own crash year's growth; re-roll (new seed, cleared overrides) yields fresh depths
- [x] 8.5 Run `npm test` and `npm run build`; fix any type or lint errors

## 9. Verification

- [x] 9.1 Manually verify in the browser: band slider, per-crash adjust from both the breakdown row and the chart marker popover, reset, and re-roll clearing overrides
- [x] 9.2 Confirm charts, summary, and breakdown all reflect adjusted depths live
