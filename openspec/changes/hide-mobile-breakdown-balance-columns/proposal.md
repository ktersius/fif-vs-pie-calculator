## Why

The mobile year-by-year breakdown table still contains both balance columns, making the table wider and less focused on the tax comparison users are likely inspecting in the compact view. Hiding balance columns on small screens reduces horizontal scrolling while keeping the detailed balance information available elsewhere in the calculator.

## What Changes

- Hide the `InvestNow balance` and `IBKR balance` columns in the year-by-year breakdown table on small screens.
- Keep the balance columns visible on wider screens.
- Preserve the `Year`, `InvestNow tax`, `IBKR tax`, and expand/collapse columns on mobile.
- Preserve row expansion behavior and detailed expanded content.
- No breaking changes.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `calculator-interface`: Update responsive breakdown table behavior so balance columns are hidden in the compact mobile table while remaining available on larger screens.

## Impact

- Affected UI: `src/components/BreakdownTable.tsx`.
- Affected specs: `openspec/specs/calculator-interface/spec.md` via a delta spec for mobile breakdown table column visibility.
- No API, simulation, data model, dependency, or analytics changes expected.