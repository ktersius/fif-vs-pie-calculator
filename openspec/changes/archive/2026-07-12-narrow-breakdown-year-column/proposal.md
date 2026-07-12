## Why

The mobile year-by-year breakdown table dedicates more horizontal space than necessary to the Year column, especially when crash badges are present. Tightening that column gives the remaining tax and action columns more room in the compact view.

## What Changes

- Reduce the visual width consumed by the Year column in the year-by-year breakdown table.
- Keep the year value and crash indicator visible and readable.
- Preserve the existing mobile compact columns and desktop table behavior.
- Preserve row expansion and the table's local horizontal-scroll fallback.
- No breaking changes.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `calculator-interface`: Refine responsive breakdown table layout so the Year column remains compact and does not unnecessarily crowd tax/action columns.

## Impact

- Affected UI: `src/components/BreakdownTable.tsx`.
- Affected specs: `openspec/specs/calculator-interface/spec.md` via a delta spec for compact Year column behavior.
- No API, simulation, data model, dependency, or analytics changes expected.