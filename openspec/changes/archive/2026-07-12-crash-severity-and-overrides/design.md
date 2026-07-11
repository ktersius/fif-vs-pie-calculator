## Context

The current model applies a single hard-coded `CRASH_RETURN = -0.15` to every crash year ([src/lib/constants.ts](../../../src/lib/constants.ts), consumed in [src/lib/simulation.ts](../../../src/lib/simulation.ts)). Crash *year selection* is already deterministic and seed-driven ([src/lib/crash.ts](../../../src/lib/crash.ts)); this change keeps that selection behaviour untouched and layers on a configurable per-year *depth* plus targeted manual overrides. The determinism philosophy of the existing app (everything is a pure function of the inputs, memoised in `App.tsx`) is preserved.

## Goals / Non-Goals

**Goals:**
- Per-crash-year depth drawn uniformly from a configurable severity band, deterministically hashed from `(seed, year)` so depths are stable as crash count changes.
- A manual override layer letting the investor set an individual crash's depth, editable from two surfaces (breakdown row and balance-chart marker) backed by one shared state.
- Preserve reproducibility: a scenario is fully described by `(seed, band, overrides)`.
- Backward-compatible collapse: `min = max` reproduces a fixed depth (15%–15% ≡ legacy −15%).

**Non-Goals:**
- Changing crash-*year* selection (explicitly kept as-is, including the current horizon-reshuffle behaviour).
- Skewed/realistic severity distributions — the band is uniform only.
- Persisting scenarios beyond in-memory React state (no URL/state serialization in this change).
- A separate "re-roll depths only" action — re-roll always regenerates both years and depths.

## Decisions

**1. Depth keyed to `(seed, year)`, not draw order.**
Deriving each crash year's default from a hash of `(seed, year)` makes depth independent of how many crash years exist or their ordering, so adding/removing crashes never shifts an existing year's depth. Alternative — drawing depths sequentially from the same PRNG stream used for year selection — was rejected because inserting a crash would re-index the stream and perturb previously-shown depths.

**2. Effective depth = override ?? band default.**
State is split into band-generated defaults (a pure function) and an explicit `overrides: Map<year, depth>`. `effectiveDepth(year)` prefers the override. This keeps the "generator" and the "manual pokes" cleanly separable and makes reset trivial (delete the map entry).

**3. Band generates defaults; overrides may exceed the band (interpretation b).**
The band is a *default generator*, not a hard clamp. A manual override is a deliberate act and may range the full outer bounds (5%–60%), enabling a deeper "black swan" than the default band. Consequently the individual adjustment slider is bounded by the outer bounds, while the band slider is bounded 5%–60% with `min ≤ max`. Alternative (a) — band as hard limits on all crashes — is simpler but strictly less expressive; rejected for that reason.

**4. Override lifecycle.**
- Re-roll (new seed) clears all overrides and regenerates defaults — re-roll means "fresh scenario".
- Changing crash count keeps overrides for years that remain crashes; overrides for removed years are held dormant (kept in the map, inert) and restored losslessly if the year returns. Cheap and non-surprising.
- Per-crash reset removes just that year's override.

**5. Two edit surfaces, one shared control component.**
A single `CrashDepthControl` (slider + current depth + default/override indicator + reset) is mounted in both the breakdown row and the balance-chart marker popover. Both write the same `overrides` state in `App.tsx`, guaranteeing the surfaces cannot diverge.

**6. Balance-chart marker: hover reveals, click adjusts.**
Rather than a fragile slider-inside-hover-tooltip, crash markers (Recharts `ReferenceDot` or a custom dot layer) reveal the depth on hover and open a click-anchored popover hosting the shared control. This avoids the "hover-intent" problem of moving the cursor into a floating slider. Alternative — a vertically draggable marker handle — was rejected for weaker discoverability and touch precision.

## Risks / Trade-offs

- **[Interactive popover on a Recharts chart is fiddly]** → Anchor the popover to the marker via a click handler and render it as a normal positioned React element outside the SVG, reusing the shared control; keep hover limited to a cheap depth readout.
- **[Default numeric outputs change vs the archived model]** → Documented as BREAKING in the proposal; `min = max = 15%` provides an explicit path to reproduce legacy figures for comparison/tests.
- **[Overrides drifting far outside the band could confuse]** → The control shows a clear default/override indicator and a one-click reset; dormant overrides are invisible until their year is a crash again.
- **[Hashing quality for `(seed, year)`]** → Reuse the existing `mulberry32`-style approach seeded by a combined `(seed, year)` value to get a well-distributed uniform draw; unit-test distribution bounds and determinism.
- **[State grows with dormant overrides]** → Negligible (bounded by MAX_CRASH_YEARS history); acceptable for the lossless-restore benefit.
