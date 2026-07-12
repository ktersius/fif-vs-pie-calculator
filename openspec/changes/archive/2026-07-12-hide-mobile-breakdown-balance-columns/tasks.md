## 1. Responsive Column Visibility

- [x] 1.1 Update `BreakdownTable` balance column headers so `InvestNow balance` and `IBKR balance` are hidden on small screens and visible on wider screens.
- [x] 1.2 Update matching balance cells in each year row with the same responsive visibility behavior.
- [x] 1.3 Preserve the visible mobile columns: year, crash indicator, InvestNow tax, IBKR tax, and expand/collapse control.
- [x] 1.4 Preserve desktop table columns, row expansion, and the existing table overflow fallback.

## 2. Verification

- [x] 2.1 Run the project test suite and confirm existing simulation/tax/fee tests still pass.
- [x] 2.2 Verify in a mobile-width viewport that balance columns are hidden while tax and expansion columns remain visible.
- [x] 2.3 Verify in a desktop-width viewport that both balance columns remain visible and row expansion still works.