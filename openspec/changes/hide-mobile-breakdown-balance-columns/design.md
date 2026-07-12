## Context

The year-by-year breakdown table currently shows six columns: year, two platform balances, two platform tax values, and the expand/collapse control. On mobile, the balance columns consume a large share of the available horizontal space even though the compact view's main comparison task is usually tax and row drill-down access.

The previous mobile overflow fix makes all columns reachable through local horizontal scrolling. This change further improves the compact view by reducing the number of visible columns on small screens while preserving the complete desktop table.

## Goals / Non-Goals

**Goals:**

- Hide `InvestNow balance` and `IBKR balance` columns in the year-by-year breakdown table on small screens.
- Keep balance columns visible at the existing wider responsive breakpoint.
- Preserve mobile access to year, tax values, crash flag, and expand/collapse behavior.
- Preserve expanded detail rows and desktop table layout.

**Non-Goals:**

- Remove balance data from the simulation or desktop UI.
- Redesign the mobile table into cards.
- Change chart, summary, tax, fee, or simulation calculations.
- Add user-configurable column visibility.

## Decisions

- Use responsive CSS utility classes on the balance column headers and cells.
  - Rationale: column visibility is purely presentational and can be handled locally in `BreakdownTable` without changing data flow or rendering structure.
  - Alternative considered: conditionally render columns based on viewport state. This would introduce JavaScript viewport logic for a CSS-only concern.
- Hide only the two balance columns on small screens.
  - Rationale: year identifies the row, tax columns preserve the tax comparison, and the expand/collapse control remains needed for drill-down.
- Keep the table's horizontal-scroll safety net.
  - Rationale: hiding balance columns reduces width but does not guarantee every future label or viewport will fit; local scrolling remains a robust fallback.

## Risks / Trade-offs

- Mobile users lose immediate row-level balance values in the compact table. → Balances remain visible in charts, summary, and desktop table; expanded details continue to provide drill-down context.
- Responsive column visibility can make mobile and desktop table screenshots differ. → This is intentional and should be verified at both widths.
- Hidden cells must stay aligned with hidden headers. → Apply the same responsive visibility classes to each balance header and matching balance body cell.