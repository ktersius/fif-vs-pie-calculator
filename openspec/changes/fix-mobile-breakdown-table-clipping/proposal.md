## Why

On narrow screens, the year-by-year breakdown table is wider than its container, but the container clips overflow instead of allowing horizontal access. This hides balance and tax columns from mobile users and makes the breakdown incomplete on limited-width devices.

## What Changes

- Ensure the year-by-year breakdown remains fully accessible on small screens when its columns exceed the available width.
- Preserve the existing desktop table layout and expandable row behavior.
- Use a simple responsive treatment, such as horizontal scrolling for the table container, rather than redesigning the table into a mobile card layout.
- No breaking changes.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `calculator-interface`: Add a requirement that the year-by-year breakdown table does not clip columns on small screens and provides access to all columns within the section.

## Impact

- Affected UI: `src/components/BreakdownTable.tsx`.
- Affected specs: `openspec/specs/calculator-interface/spec.md` via a delta spec for responsive breakdown table behavior.
- No API, data model, simulation, dependency, or analytics changes expected.