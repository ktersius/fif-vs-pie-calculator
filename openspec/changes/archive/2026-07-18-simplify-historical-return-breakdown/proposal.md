## Why

The year-by-year breakdown repeats price and dividend returns in expanded detail even though price return is already visible in the summary row. Showing both return types directly in the table removes duplication and makes dividend return discoverable without expanding a year.

## What Changes

- Keep one compact return column whose header identifies the values as `Price / Dividend`.
- Show the price and dividend percentages as two stacked values within each historical row.
- Remove the repeated historical-returns panel from expanded rows.
- Keep expanded rows focused on platform tax and fee details.
- Preserve the initial-state row with no historical return values.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `calculator-interface`: Changes the year-by-year breakdown columns and removes duplicated historical-return detail from expanded rows.

## Impact

- Updates `src/components/BreakdownTable.tsx` column header and row-cell presentation.
- Updates calculator-interface requirements and focused presentation checks.
- Does not change simulation data, tax calculations, analytics, or other result components.
