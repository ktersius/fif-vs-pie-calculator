## Context

The compact year-by-year breakdown currently shows the Year column alongside tax and expansion columns on mobile. The Year column includes both the numeric year and, for crash years, a crash-depth badge. Its default padding and unconstrained width can consume more space than needed, leaving less room for the tax columns.

Recent responsive changes hide balance columns on mobile and retain local horizontal scrolling. This change fine-tunes the remaining compact table by making the Year column deliberately narrow while keeping its content understandable.

## Goals / Non-Goals

**Goals:**

- Reduce the horizontal width consumed by the Year column in the breakdown table.
- Keep year numbers readable and crash indicators recognizable.
- Preserve the mobile compact table columns and desktop table behavior.
- Preserve row expansion and the table overflow fallback.

**Non-Goals:**

- Hide the Year column or crash indicator.
- Change the meaning, formatting, or calculation of crash depth values.
- Redesign the table into cards or add configurable columns.
- Change charts, summary cards, simulation logic, or tax/fee calculations.

## Decisions

- Use CSS utility classes to constrain and tighten the Year column.
  - Rationale: this is a presentational layout refinement and should stay local to `BreakdownTable`.
  - Alternative considered: removing the crash-depth text from table rows. That would save more width but lose useful context directly in the row.
- Allow crash indicators to use a compact presentation in the Year cell.
  - Rationale: crash years must remain identifiable, but the badge should not force excessive column width on mobile.
- Keep responsive behavior CSS-only.
  - Rationale: avoiding viewport JavaScript keeps the implementation simple and consistent with the existing Tailwind-based responsive table approach.

## Risks / Trade-offs

- If the Year cell is too narrow, crash badges may wrap or feel cramped. → Use a compact but readable layout and verify on mobile crash-year rows.
- Desktop may not need the narrower treatment. → Use responsive classes where needed so desktop readability and spacing remain comfortable.
- Over-tightening could make row taps feel cramped. → Preserve adequate cell padding and ensure expansion still works.