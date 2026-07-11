## Context

The current React single-page calculator renders every section in a single vertical flow in `src\App.tsx`: the control panel appears first, followed by the summary, balance chart, tax-drag chart, year-by-year breakdown, and footer. `ControlPanel` currently uses a two-column grid from the `sm` breakpoint upward, which works in the full-width top panel but would be cramped inside a narrower sidebar.

The requested change is presentation-only. The simulation state, input definitions, chart behavior, crash override logic, and formatting should remain unchanged.

## Goals / Non-Goals

**Goals:**

- Present the control panel as a left sidebar on wider screens.
- Keep the result sections in a main content column to the right of the controls.
- Preserve the current stacked, controls-first layout on small screens.
- Keep every existing input, range, default, label, hint, and re-roll behavior intact.

**Non-Goals:**

- Changing simulation calculations, tax rules, fee logic, or chart data.
- Adding or removing inputs.
- Introducing new UI dependencies.
- Redesigning the visual style beyond the layout adjustment needed for the sidebar.

## Decisions

1. Use a responsive page-level grid in `App`.

   The main content below the header should become a single-column grid by default and a two-column grid on large screens. The left column contains the existing "Control Panel" section, and the right column contains Summary, Portfolio Balance, Tax Drag, and Year-by-Year Breakdown in their current order.

   Alternative considered: keep all sections stacked and only left-align controls inside the existing panel. That would not solve the main usability issue because users would still scroll away from inputs when reviewing results.

2. Make the sidebar sticky on wider screens.

   The control panel section should remain visible near the top of the viewport while users scroll through result sections, using existing Tailwind utilities. This improves iterative comparison without changing any business logic.

   Alternative considered: a non-sticky sidebar. This is simpler but loses much of the benefit once users scroll down to charts or the year-by-year breakdown.

3. Change `ControlPanel` to accept layout through classes or use a sidebar-friendly default.

   Inside the sidebar, controls should use one column to preserve readable labels and slider width. If the component remains reusable in wide contexts later, the parent can pass a class name or variant; for the current app, a one-column control grid is sufficient.

   Alternative considered: leave `sm:grid-cols-2`. This would create narrow half-width controls in the sidebar on many desktop widths.

## Risks / Trade-offs

- Narrow desktop widths could squeeze charts if the sidebar is too wide -> Use responsive breakpoints so the two-column layout only activates when enough horizontal space is available.
- Sticky sidebar may be taller than the viewport -> Allow normal page scrolling; sticky should enhance access without trapping content.
- Changing the control grid to one column increases sidebar height -> Acceptable because the sidebar is scrollable as part of the page and preserves control readability.
