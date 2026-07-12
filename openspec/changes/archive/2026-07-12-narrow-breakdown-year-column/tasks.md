## 1. Year Column Layout

- [x] 1.1 Update `BreakdownTable` so the Year header and row cells use tighter width and spacing than the tax/action columns.
- [x] 1.2 Make crash-year indicators compact while keeping the year and effective crash depth readable.
- [x] 1.3 Preserve mobile compact columns, desktop columns, row expansion, and local table overflow fallback.

## 2. Verification

- [x] 2.1 Run the project test suite and confirm existing simulation/tax/fee tests still pass.
- [x] 2.2 Verify in a mobile-width viewport that the Year column consumes less horizontal space and crash rows remain readable.
- [x] 2.3 Verify in a desktop-width viewport that the Year column remains readable and row expansion still works.