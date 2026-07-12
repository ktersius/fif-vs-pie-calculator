## 1. Breakdown Table Overflow

- [x] 1.1 Update `BreakdownTable` so the year-by-year table container allows horizontal scrolling instead of clipping overflow on narrow screens.
- [x] 1.2 Ensure the table keeps a readable intrinsic/minimum width so columns remain usable when the container scrolls.
- [x] 1.3 Preserve existing rounded border styling, table columns, row click handling, and expanded detail rendering.

## 2. Verification

- [x] 2.1 Run the project test suite and confirm existing simulation/tax/fee tests still pass.
- [x] 2.2 Verify in a mobile-width viewport that every breakdown column is accessible within the table section and the page itself does not gain unwanted horizontal overflow.
- [x] 2.3 Verify in a desktop-width viewport that the breakdown table layout and row expansion behavior remain unchanged.