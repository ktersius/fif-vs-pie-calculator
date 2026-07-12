# calculator-interface Specification

## Purpose

Defines the interactive single-page interface for the calculator: the investor input control panel, the crash-year re-roll control, the portfolio balance and tax-drag charts, the summary dashboard with itemised fees, the expandable year-by-year breakdown drill-down, NZD/percentage formatting, and memoised recomputation.

## Requirements

### Requirement: Investor Input Control Panel

The system SHALL present a control panel allowing the investor to configure all simulation inputs, each with the specified range or options and default value.

- Initial Investment: $0 to $500,000 (default $100,000).
- Periodic Contribution: $0 to $10,000 (default $250).
- Contribution Frequency: dropdown [Weekly, Fortnightly, Monthly, Annually] (default Weekly).
- Investment Horizon: 1 to 50 years (default 20).
- Expected Annual Market Return (excluding dividends): 4% to 15% (default 8%).
- Dividend Yield: 0% to 5% (default 1.5%).
- Marginal Income Tax Rate: dropdown [10.5%, 17.5%, 30%, 33%, 39%] (default 39%).
- PIE PIR: dropdown [10.5%, 17.5%, 28%] (default 28%).
- Number of Crash Years: 0 to the lesser of 5 and the investment horizon (default 3).
- Crash Severity Band: a dual-thumb range slider in positive drop percentage, outer bounds 5% to 60% (default 10%–35%), with the guardrail that the minimum thumb never exceeds the maximum thumb. When the two thumbs coincide, all crash defaults collapse to that single depth.

#### Scenario: Defaults on first load

- **WHEN** the application first loads
- **THEN** every input displays its specified default value, including a 20-year investment horizon and a 10%–35% crash severity band

#### Scenario: Input change re-runs the simulation

- **WHEN** the investor changes any input within its allowed range
- **THEN** the simulation recomputes and all charts and summary figures update accordingly

#### Scenario: Inputs constrained to valid ranges

- **WHEN** the investor attempts to set a numeric input
- **THEN** the value is constrained to the specified minimum and maximum for that input

#### Scenario: Crash years cannot exceed the horizon

- **WHEN** the investor sets an investment horizon shorter than the current number of crash years
- **THEN** the number of crash years is clamped to the investment horizon so crash years never exceed the number of simulated years

#### Scenario: Severity band thumbs cannot cross

- **WHEN** the investor drags the minimum severity thumb past the maximum thumb (or vice versa)
- **THEN** the thumbs are constrained so that `min ≤ max` is always maintained within the 5%–60% outer bounds

### Requirement: Responsive Calculator Layout

The system SHALL present the investor input control panel in a left sidebar alongside the calculator outputs on wider screens, while preserving a single-column controls-first layout on smaller screens.

#### Scenario: Desktop layout shows inputs beside outputs

- **WHEN** the application is viewed on a wide screen
- **THEN** the control panel is displayed in a left column and the summary, charts, and year-by-year breakdown are displayed in a right content column

#### Scenario: Mobile layout remains stacked

- **WHEN** the application is viewed on a small screen
- **THEN** the control panel is displayed before the output sections in a single-column layout

#### Scenario: Control panel remains readable in sidebar

- **WHEN** the control panel is displayed in the left sidebar
- **THEN** its inputs remain full-width within the sidebar so labels, sliders, dropdowns, and hints are readable

### Requirement: Wide-Screen Space Utilization

The system SHALL use available horizontal space on large and high-resolution screens so the calculator layout does not feel unnecessarily squeezed in the center of the viewport.

#### Scenario: High-resolution layout expands beyond the default desktop width

- **WHEN** the application is viewed on a high-resolution screen
- **THEN** the page shell uses a wider maximum content area than the standard desktop layout while preserving comfortable outer margins

#### Scenario: Results receive primary horizontal space

- **WHEN** the application is viewed in the desktop sidebar layout
- **THEN** the result column receives the majority of additional horizontal space so charts, summary content, and tables have more room than the control sidebar

#### Scenario: Small-screen layout is unchanged

- **WHEN** the application is viewed on a small screen
- **THEN** the page remains a single-column layout with the control panel before the output sections

### Requirement: Crash Severity Adjustment Control

The system SHALL provide a single reusable crash-depth adjustment control that edits the effective depth of one crash year, mounted in two places — the year-by-year breakdown row and the portfolio balance chart marker popover — both writing the same per-year override state so the two surfaces never diverge.

The control SHALL let the investor move a crash's depth across the outer bounds (5% to 60% drop), display the current effective depth, indicate whether the value is a band default or a manual override, and offer a reset to the band default. Adjusting the control SHALL re-run the simulation and update all outputs live.

#### Scenario: Adjusting a crash updates the simulation live

- **WHEN** the investor moves the crash-depth control for a given year
- **THEN** that year's effective depth changes and the charts, summary, and breakdown recompute immediately

#### Scenario: Both surfaces stay in sync

- **WHEN** the investor adjusts a crash's depth from the balance-chart popover and then opens that year's breakdown row
- **THEN** the breakdown row shows the same adjusted depth, because both surfaces edit one shared override state

#### Scenario: Reset control reverts to the band default

- **WHEN** a crash's depth has been manually overridden and the investor activates its reset control
- **THEN** the depth reverts to the band-generated default and the override indicator clears

### Requirement: Crash Year Re-roll Control

The system SHALL provide an explicit "Re-roll crash years" control that recomputes the crash-year placement, while keeping the placement stable across all other input changes.

#### Scenario: Re-roll produces a new crash-year placement

- **WHEN** the investor clicks the re-roll control
- **THEN** a new crash-year seed is generated, the crash years are recomputed, and the simulation and all outputs update

#### Scenario: Changing other inputs does not re-roll

- **WHEN** the investor changes any input other than the re-roll control or the number of crash years
- **THEN** the crash-year placement is preserved and only the affected calculations change

### Requirement: Portfolio Balance Chart

The system SHALL render a line or area chart mapping year (X-axis) to portfolio balance (Y-axis) for both the InvestNow and IBKR portfolios, and SHALL mark crash years on the chart with an interactive indicator for inspecting and adjusting each crash's depth.

- A crash marker SHALL be rendered at each crash year's position.
- Hovering a crash marker SHALL reveal that year's effective crash depth.
- Clicking a crash marker SHALL open a popover hosting the shared crash-depth adjustment control (slider plus reset) for that year.

#### Scenario: Both portfolios plotted over the horizon

- **WHEN** the simulation completes
- **THEN** the chart shows one series per platform across Year 0 through the final year of the investment horizon with balances on the Y-axis

#### Scenario: Crash markers rendered at crash years

- **WHEN** the simulation has one or more crash years
- **THEN** a crash marker appears at each crash year's position on the balance chart

#### Scenario: Hovering a marker reveals its depth

- **WHEN** the investor hovers a crash marker
- **THEN** the marker reveals that crash year's effective depth

#### Scenario: Clicking a marker opens the adjustment control

- **WHEN** the investor clicks a crash marker
- **THEN** a popover opens containing the shared crash-depth slider and reset for that year, and adjusting it re-runs the simulation

### Requirement: Tax Drag Chart

The system SHALL render a bar chart showing the tax paid in each year by platform, making the CV method advantage during crash years visible.

#### Scenario: Per-year tax by platform

- **WHEN** the simulation completes
- **THEN** the bar chart shows annual tax paid for each platform per year

#### Scenario: Crash-year tax advantage visible

- **WHEN** a crash year occurs and the IBKR CV method reduces tax
- **THEN** the tax drag chart reflects the lower IBKR tax for that year relative to InvestNow

### Requirement: Summary Dashboard

The system SHALL display a summary dashboard with the key aggregate outcomes for both platforms, with fees itemised by category.

- Total Principal Contributed.
- Final Net Balance: InvestNow vs IBKR.
- Total Fees Paid, itemised per platform into: transaction fees (InvestNow buy/sell), FX fees (IBKR), brokerage fees (IBKR), and management fees (both), plus a combined total per platform.
- Total NZ Tax Paid: InvestNow vs IBKR.

#### Scenario: Summary metrics displayed

- **WHEN** the simulation completes
- **THEN** the dashboard shows total principal contributed and, for each platform, the final net balance, total NZ tax paid, and fees broken down into transaction, FX, brokerage, and management categories with a combined per-platform total

#### Scenario: Itemised fees sum to the combined total

- **WHEN** the itemised fee categories are displayed for a platform
- **THEN** the sum of the categories equals the combined total fees shown for that platform

### Requirement: Year-by-Year Breakdown Drill-Down

The system SHALL provide an expandable year-by-year breakdown that lets the investor inspect, for any simulated year, the full tax calculation and the per-order fee calculation for each platform. It SHALL be presented as an accordion table with one row per year (Year 0 through the horizon), where each row expands inline to reveal the detail without leaving the page.

Tax detail per year SHALL show:
- InvestNow (PIE): opening balance, FDR taxable income (opening balance × 5%), PIR, and PIE tax owed.
- IBKR (FIF): cost base with de minimis status (exempt or FIF); gross dividends and foreign tax credit; when FIF-exempt, the dividend-only computation (NZ gross tax, FTC, net); when the FIF regime applies, both the FDR method and CV method figures with the selected (lesser) method highlighted and the resulting net tax owed.

Fee detail per year SHALL show a representative single-order breakdown rather than repeating identical periodic orders:
- IBKR: gross order amount → FX fee (0.03%) → brokerage fee (capped) → net invested, plus the number of orders in the year and the annual fee totals.
- InvestNow: the annual contribution and the aggregate 0.50% buy fee, plus the management fee for the year.
- Year 0 SHALL show the one-off initial-investment order breakdown, and the final horizon year SHALL show the one-off exit-fee breakdown.

Crash years SHALL be visually flagged in the breakdown, SHALL display the effective crash depth for that year (e.g. `crash −38%`), and SHALL host the shared crash-depth adjustment control (slider plus reset) inline so the investor can change that crash's depth from the row.

#### Scenario: Expand a year to view tax breakdown

- **WHEN** the investor expands a year's row in the breakdown table
- **THEN** the row reveals, for each platform, the full tax calculation for that year while neighbouring year rows remain visible

#### Scenario: Selected FIF method highlighted

- **WHEN** a year's IBKR breakdown is shown while the FIF regime applies
- **THEN** both the FDR and CV method figures are displayed and the method producing the lesser net tax is highlighted as the one applied

#### Scenario: Representative order avoids duplication

- **WHEN** the fee breakdown for a year with multiple identical periodic orders is shown
- **THEN** a single representative order breakdown is displayed alongside the order count and annual fee totals, rather than one row per order

#### Scenario: Chart click opens the corresponding year

- **WHEN** the investor clicks a bar for a given year in the tax drag chart
- **THEN** the breakdown table expands (or scrolls to) that year's row

#### Scenario: Crash row shows and adjusts depth

- **WHEN** the investor expands a crash year's row
- **THEN** the row displays the effective crash depth and provides the shared crash-depth control to adjust or reset it, updating the simulation on change

### Requirement: Mobile Breakdown Table Accessibility

The system SHALL ensure the year-by-year breakdown table remains accessible on small screens when its visible columns exceed the available horizontal space. Visible columns SHALL be reachable within the breakdown section without clipping content or requiring page-level horizontal scrolling.

#### Scenario: Narrow screen exposes visible breakdown columns

- **WHEN** the application is viewed on a small screen and the year-by-year breakdown table is wider than its container
- **THEN** the investor can access every visible table column, including the year, crash indicator when present, both tax columns, and the expand/collapse control

#### Scenario: Desktop breakdown layout remains unchanged

- **WHEN** the application is viewed on a wide screen
- **THEN** the year-by-year breakdown continues to display as a full-width table within the results column with the desktop columns and row expansion behavior

#### Scenario: Expanded rows remain usable after horizontal access

- **WHEN** the investor expands a year from the breakdown table on a small screen
- **THEN** the expanded tax, fee, and crash-depth detail remains visible within the breakdown section and does not cause hidden page-level overflow

### Requirement: Mobile Breakdown Compact Columns

The system SHALL simplify the year-by-year breakdown table on small screens by hiding the `InvestNow balance` and `IBKR balance` columns. The compact mobile table SHALL continue to show the year, crash-year indicator when present, InvestNow tax, IBKR tax, and expand/collapse control.

#### Scenario: Mobile breakdown hides balance columns

- **WHEN** the application is viewed on a small screen
- **THEN** the year-by-year breakdown table does not display the `InvestNow balance` or `IBKR balance` columns
- **AND** the table still displays the year, InvestNow tax, IBKR tax, and expand/collapse control

#### Scenario: Desktop breakdown shows balance columns

- **WHEN** the application is viewed on a wide screen
- **THEN** the year-by-year breakdown table displays both platform balance columns along with the existing tax columns and expand/collapse control

#### Scenario: Mobile row expansion remains available

- **WHEN** the investor expands a year from the mobile breakdown table
- **THEN** the expanded tax, fee, and crash-depth detail remains available for that year

### Requirement: Compact Breakdown Year Column

The system SHALL keep the Year column in the year-by-year breakdown table compact so it does not consume unnecessary horizontal space in the mobile table. The Year column SHALL continue to show the year number and crash-year indicator when applicable.

#### Scenario: Mobile year column preserves space

- **WHEN** the application is viewed on a small screen
- **THEN** the year-by-year breakdown table uses a compact Year column so the tax and expand/collapse columns receive more available horizontal space

#### Scenario: Crash indicator remains visible

- **WHEN** a crash year appears in the mobile breakdown table
- **THEN** the Year column still identifies the row as a crash year and displays the effective crash depth in a readable compact form

#### Scenario: Desktop table remains readable

- **WHEN** the application is viewed on a wide screen
- **THEN** the Year column remains readable and the breakdown table preserves its desktop columns and row expansion behavior

### Requirement: Stable Mobile Breakdown Expansion Layout

The system SHALL preserve the visible mobile breakdown table column widths and alignment when a year row is expanded or collapsed. Expanding a row SHALL NOT cause neighbouring summary rows, headers, tax columns, or the expand/collapse control to jump horizontally or collapse into narrower widths.

#### Scenario: Expanding mobile row preserves summary column widths

- **WHEN** the application is viewed on a small screen
- **AND** the investor expands a year in the year-by-year breakdown table
- **THEN** the visible summary table columns retain their widths and horizontal alignment
- **AND** neighbouring rows do not jump left or collapse horizontally

#### Scenario: Expanded detail remains available on mobile

- **WHEN** the investor expands a year from the mobile breakdown table
- **THEN** the expanded tax, fee, and crash-depth detail remains visible and usable below that year's summary row

#### Scenario: Desktop expansion remains unchanged

- **WHEN** the application is viewed on a wide screen
- **AND** the investor expands a year in the breakdown table
- **THEN** the desktop table columns and expanded detail layout remain readable and aligned

### Requirement: Mobile Section Space Efficiency

The system SHALL use compact section-card spacing on small screens so borders, padding, rounding, and shadows do not unnecessarily reduce usable content width. Wider screens SHALL preserve comfortable card spacing and visual separation.

#### Scenario: Mobile sections preserve content width

- **WHEN** the application is viewed on a small screen
- **THEN** output sections use reduced padding and lightweight card chrome so tables and charts receive more horizontal space

#### Scenario: Desktop sections preserve comfortable spacing

- **WHEN** the application is viewed on a wide screen
- **THEN** output sections retain the larger padding, rounded corners, and subtle shadow used by the desktop layout

### Requirement: NZD Currency and Percentage Formatting

The system SHALL format all monetary values as New Zealand Dollars and all rates as percentages for display, without mutating the underlying computed values.

#### Scenario: Monetary values formatted as NZD

- **WHEN** a monetary value is rendered in a chart, tooltip, or dashboard card
- **THEN** it is displayed in NZD format with thousands separators (e.g. $1,234,567)

#### Scenario: Rates formatted as percentages

- **WHEN** a rate input or derived rate is displayed
- **THEN** it is shown as a percentage (e.g. 8%, 1.5%)

### Requirement: Performance of Iterative Calculations

The system SHALL memoise the heavy iterative simulation so it only recomputes when inputs change.

#### Scenario: Recompute only on input change

- **WHEN** the component re-renders without any input change
- **THEN** the cached simulation result is reused rather than recomputed
