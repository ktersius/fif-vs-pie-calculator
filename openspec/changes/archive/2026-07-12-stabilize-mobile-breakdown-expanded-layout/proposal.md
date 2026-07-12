## Why

On mobile, expanding a year in the breakdown table causes the visible summary columns to shrink and jump left. This makes the table feel unstable and can obscure tax values even though the unexpanded layout fits the available width.

## What Changes

- Stabilize the mobile year-by-year breakdown table layout when a row is expanded.
- Keep the visible mobile summary columns aligned and at consistent widths before and after expansion.
- Preserve expanded tax, fee, and crash-depth detail content.
- Preserve desktop table layout and row expansion behavior.
- No breaking changes.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `calculator-interface`: Add a requirement that expanding a mobile breakdown row must not cause visible summary columns to collapse, shift, or lose alignment.

## Impact

- Affected UI: `src/components/BreakdownTable.tsx`.
- Affected specs: `openspec/specs/calculator-interface/spec.md` via a delta spec for stable mobile expanded-row layout.
- No API, simulation, data model, dependency, or analytics changes expected.