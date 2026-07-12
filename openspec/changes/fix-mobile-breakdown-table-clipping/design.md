## Context

The year-by-year breakdown is rendered as an accordion-style HTML table in `BreakdownTable`. On narrow screens the table's natural width exceeds the available section width, but its current wrapper hides overflow. This causes the right-side balance, tax, and expand/collapse columns to be clipped instead of reachable.

The broader responsive layout already stacks the control panel and outputs on small screens. This change focuses specifically on preserving access to the breakdown table columns inside that existing layout.

## Goals / Non-Goals

**Goals:**

- Allow mobile and narrow-width users to access every year-by-year breakdown column.
- Preserve the existing table semantics, row click behavior, and expanded detail rows.
- Keep the fix simple and localized to the breakdown table presentation.
- Avoid page-level horizontal scrolling; scrolling should be scoped to the table container.

**Non-Goals:**

- Redesign the breakdown into mobile cards.
- Change table columns, labels, calculations, or expanded detail content.
- Change chart, summary dashboard, simulation, or input behavior.

## Decisions

- Use container-level horizontal scrolling for the breakdown table.
  - Rationale: the current issue is caused by clipping at the table wrapper, and a scrollable wrapper directly restores access to hidden columns while preserving the table layout.
  - Alternative considered: convert each mobile row to a card layout. This would improve mobile ergonomics but is larger than necessary for the clipping fix and risks duplicating table presentation logic.
- Preserve the rounded bordered container styling.
  - Rationale: the current visual treatment works well on desktop; the overflow behavior should change without making the section look materially different.
- Keep the implementation localized to `BreakdownTable`.
  - Rationale: the summary fee tables are compact and were not observed to have the same clipping issue.

## Risks / Trade-offs

- Horizontal scrolling can be less discoverable than a stacked mobile layout. → Keep the interaction scoped to a familiar table container and avoid hiding content; future polish can add visual affordances if needed.
- Very long labels, such as crash badges, may still pressure the first column width. → Maintain readable cell spacing and allow the table to keep a sensible intrinsic/minimum width rather than compressing columns into illegibility.
- Touch users may accidentally trigger row expansion while trying to scroll horizontally. → Preserve existing row click behavior and verify horizontal swiping on the table area does not introduce page-level clipping.