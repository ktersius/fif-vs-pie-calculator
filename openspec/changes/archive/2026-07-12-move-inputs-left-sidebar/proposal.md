## Why

The calculator currently stacks the investor input controls above every result section, forcing users to scroll away from the controls while comparing outputs. Moving the controls into a left sidebar improves the desktop layout by keeping inputs and results visible together.

## What Changes

- Rework the main calculator page into a responsive layout where the control panel appears in a left column on larger screens and the summary, charts, and breakdown appear in the main content column.
- Preserve the existing single-column stacked layout on small screens so mobile users still see the control panel first.
- Adjust the control panel's internal grid so inputs remain readable within a narrower sidebar.
- Keep all existing inputs, ranges, defaults, recomputation behavior, and crash-year controls unchanged.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `calculator-interface`: Adds a responsive layout requirement for presenting investor inputs in a left sidebar alongside results on larger screens.

## Impact

- Affected code: `src\App.tsx` and `src\components\ControlPanel.tsx`.
- APIs and data models: no changes.
- Dependencies: no changes.
- Validation: existing build should continue to pass; behavior is presentation-only.
