## Why

The current desktop layout caps the calculator at `max-w-6xl`, which leaves large unused margins on higher-resolution displays and makes the two-column content feel squeezed in the middle. The layout should scale up more gracefully so charts, tables, and the control sidebar have room to breathe.

## What Changes

- Increase the main page's usable width on large and extra-large screens.
- Tune the sidebar and content column proportions so the results area gets more horizontal space.
- Preserve the current small-screen stacked layout and the existing left-sidebar pattern on desktop.
- Keep all calculator inputs, outputs, simulation behavior, and data models unchanged.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `calculator-interface`: Adds a wide-screen layout requirement so the calculator uses available high-resolution viewport width without feeling cramped.

## Impact

- Affected code: `src\App.tsx`, and potentially nearby presentation-only component classes if chart/table containers need width adjustments.
- APIs and data models: no changes.
- Dependencies: no changes.
- Validation: existing build should continue to pass; layout should be checked at small, desktop, and high-resolution widths.
