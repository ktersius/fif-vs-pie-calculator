## Context

The mobile breakdown table uses a compact four-column visible layout while the desktop table has six columns. Expanding a year currently inserts a detail row with `colSpan={6}`. In combination with hidden mobile balance columns and mobile fixed table sizing, the browser's table layout algorithm recalculates the grid as if hidden columns still participate, causing the visible tax columns to shrink and jump left.

Measured behavior during exploration showed the mobile tax columns changing from roughly `84.8px` each before expansion to roughly `42.4px` each after expansion, even though the table wrapper width stayed constant.

## Goals / Non-Goals

**Goals:**

- Keep mobile summary-row column widths stable before and after expanding a row.
- Preserve the compact mobile visible columns: year, crash indicator, InvestNow tax, IBKR tax, and expand/collapse control.
- Preserve expanded detail content and row toggling behavior.
- Preserve desktop table columns and desktop expansion behavior.

**Non-Goals:**

- Redesign the breakdown table into cards.
- Change simulation, tax, fee, or formatting calculations.
- Add user-configurable columns.
- Remove expanded detail content.

## Decisions

- Avoid allowing the expanded detail row to change the mobile summary table's column sizing.
  - Rationale: the bug is caused by the expanded detail row participating in table column calculations differently than the compact summary rows.
  - Candidate implementation paths include using responsive/mobile-safe `colSpan`, isolating expanded detail from the fixed table layout, or adjusting table layout rules so the expanded row cannot collapse visible columns.
- Verify using measured column widths rather than only visual inspection.
  - Rationale: the bug is a layout regression where the table still technically fits but visible columns shrink unexpectedly.
- Keep the existing compact labels and mobile card spacing.
  - Rationale: those changes solved previous mobile-width issues and should not be reverted unless required.

## Risks / Trade-offs

- A quick fix that changes `table-layout` may reintroduce earlier mobile width pressure. → Verify the compact table still fits without page-level horizontal overflow.
- Responsive `colSpan` logic can add complexity if implemented with viewport state. → Prefer CSS/table-structure options first where feasible.
- Moving detail content outside table semantics could affect accessibility or keyboard navigation. → Preserve row/detail association if a structural approach is chosen.