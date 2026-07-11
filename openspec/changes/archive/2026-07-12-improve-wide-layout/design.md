## Context

The app currently centers its page shell with `max-w-6xl`. After moving inputs into a left sidebar, that cap leaves high-resolution displays with large empty margins while the sidebar and result column compete for a relatively narrow middle area. This is especially noticeable for charts and the year-by-year table, which benefit from horizontal room.

The layout should remain responsive and presentation-only. The existing controls-first mobile layout and desktop left-sidebar pattern should be preserved.

## Goals / Non-Goals

**Goals:**

- Let the calculator use more viewport width on large and extra-large screens.
- Keep the sidebar readable without over-consuming horizontal space.
- Give the main result column more room for charts, summary content, and wide tables.
- Preserve comfortable margins so the page does not feel edge-to-edge.

**Non-Goals:**

- Changing inputs, calculations, chart data, table data, or simulation behavior.
- Adding layout libraries or new dependencies.
- Creating a fundamentally different navigation or multi-page experience.

## Decisions

1. Increase the page shell max width at larger breakpoints.

   Replace the current `max-w-6xl`-style cap with a wider responsive maximum so high-resolution displays can show the two-column layout with less squeezing. Keep horizontal padding so the interface still has breathing room.

   Alternative considered: remove the max width entirely. That would use all available space, but charts and tables can become too stretched on ultra-wide displays and the page can feel disconnected.

2. Use a sidebar width that is stable but not dominant.

   The sidebar should remain wide enough for full-width sliders and dropdowns, while the result column gets most of the additional space at high resolutions. A slightly narrower desktop sidebar with larger content max width is preferable to widening both equally.

   Alternative considered: keep the current `20rem`/`22rem` sidebar and only widen the outer container. This helps, but can still leave too much visual weight in the sidebar compared with results.

3. Keep the main content column unconstrained within the page grid.

   The main column should use `minmax(0, 1fr)` so charts and tables can expand into available space without grid overflow. Existing section cards should stay in their current vertical order.

## Risks / Trade-offs

- Very wide monitors can make chart lines span a long distance -> Keep a maximum page width rather than full-bleed layout.
- A narrower sidebar can make controls feel cramped -> Preserve full-width controls and choose a sidebar width that still supports readable labels and sliders.
- More horizontal space may expose overflow issues in existing chart/table components -> Use `min-w-0` on the main column and validate the build after layout changes.
