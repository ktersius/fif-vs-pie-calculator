## 1. Expanded Row Layout Stability

- [x] 1.1 Update `BreakdownTable` so the expanded detail row does not alter mobile summary-row column sizing.
- [x] 1.2 Preserve the compact mobile summary columns, hidden mobile balance columns, and local table overflow fallback.
- [x] 1.3 Preserve desktop table columns, desktop row expansion, and expanded detail content.

## 2. Verification

- [x] 2.1 Run the project test suite and confirm existing simulation/tax/fee tests still pass.
- [x] 2.2 Verify in a mobile-width viewport that summary column widths are stable before and after expanding a row.
- [x] 2.3 Verify in a mobile-width viewport that expanded tax, fee, and crash-depth detail remains visible and usable.
- [x] 2.4 Verify in a desktop-width viewport that table columns and row expansion remain aligned and readable.