# calculator-interface Specification

## Purpose

Defines the interactive single-page interface for the calculator: the investor input control panel, the historical period control, the historical result context, the portfolio balance and tax-drag charts, the summary dashboard with itemised fees, the expandable year-by-year breakdown drill-down, NZD/percentage formatting, and memoised recomputation.

## Requirements

### Requirement: Calculator Mode Selector

The system SHALL present an accessible calculator selector with `PIE vs US ETF` and `US ETF vs Irish ETF` options. `PIE vs US ETF` SHALL be selected by default.

#### Scenario: Existing calculator is the default

- **WHEN** the application first loads
- **THEN** the selector identifies PIE-vs-US as selected and the existing comparison is displayed

#### Scenario: Investor switches calculator

- **WHEN** the investor selects US-vs-Irish
- **THEN** the heading, controls, summaries, charts, and breakdown update to the US and Irish ETF comparison

#### Scenario: Selector is keyboard accessible

- **WHEN** the investor operates the selector with a keyboard or assistive technology
- **THEN** both choices and the selected state are available through native radio-group semantics

### Requirement: Active Comparison Labels

The system SHALL derive platform names and chart labels from the active calculator result instead of hard-coding InvestNow and IBKR labels in shared result components.

#### Scenario: PIE mode labels

- **WHEN** PIE-vs-US mode is active
- **THEN** shared output components identify InvestNow PIE and the direct US ETF

#### Scenario: ETF domicile labels

- **WHEN** US-vs-Irish mode is active
- **THEN** shared output components identify the US-domiciled ETF and Irish-domiciled ETF

### Requirement: Investor Input Control Panel

The system SHALL present a control panel allowing the investor to configure all simulation inputs, each with the specified range or options and default value.

Shared controls:

- Initial Investment: $0 to $500,000 (default $100,000).
- Periodic Contribution: $0 to $10,000 (default $250).
- Contribution Frequency: dropdown [Weekly, Fortnightly, Monthly, Annually] (default Weekly).
- Investment Horizon: 1 to 50 years (default 20).
- Historical End Year: range defined by the available 1957-onward dataset and current investment horizon (default latest completed year).
- Marginal Income Tax Rate: dropdown [10.5%, 17.5%, 30%, 33%, 39%] (default 39%).

Mode-specific controls:

- PIE-vs-US SHALL show PIE PIR: dropdown [10.5%, 17.5%, 28%] (default 28%).
- US-vs-Irish SHALL show FX Conversion: [Auto Conversion, Manual Spot] (default Auto Conversion).
- Hidden mode-specific values SHALL be preserved when switching modes.

The control panel SHALL NOT expose expected market return, dividend yield, crash count, crash severity, re-roll, per-year market override, exchange-rate, ETF ticker, expense-ratio, or estate-tax controls.

#### Scenario: Defaults on first load

- **WHEN** the application first loads
- **THEN** every PIE-vs-US input displays its specified default value, including a 20-year investment horizon and the latest valid 20-year historical period

#### Scenario: Input change re-runs the simulation

- **WHEN** the investor changes any visible input within its allowed range
- **THEN** the active simulation recomputes and all charts and summary figures update accordingly

#### Scenario: Inputs constrained to valid ranges

- **WHEN** the investor attempts to set a numeric input
- **THEN** the value is constrained to the specified minimum and maximum for that input

#### Scenario: Mode-specific controls change

- **WHEN** the investor switches from PIE-vs-US to US-vs-Irish
- **THEN** the PIE PIR control is hidden and the FX conversion control is shown

#### Scenario: Input values survive mode switching

- **WHEN** the investor changes common and mode-specific inputs, switches modes, and later switches back
- **THEN** the previously selected values are restored

#### Scenario: Removed market controls are absent

- **WHEN** the control panel is displayed in either mode
- **THEN** no expected-return, dividend-yield, crash-count, crash-severity, re-roll, manual return override, or configurable tax-constant control is present

### Requirement: Historical Period Control

The system SHALL provide a single native range control for selecting the historical end year. The selected historical window length SHALL always equal the investment horizon. The interface SHALL show the derived start year to the left of the slider and the selected end year to the right.

The slider minimum SHALL equal `earliest dataset year + horizon - 1`; its maximum SHALL equal the latest completed dataset year. The default SHALL select the latest completed year.

#### Scenario: Latest range selected by default

- **WHEN** the calculator loads with a 20-year horizon and 2025 is the latest dataset year
- **THEN** the historical control displays the range 2006-2025 with end year 2025 selected

#### Scenario: Sliding changes the contiguous range

- **WHEN** the investor moves the historical end-year slider
- **THEN** the start year changes to remain exactly one investment horizon before the selected end year and the simulation recomputes

#### Scenario: Slider shows both range boundaries

- **WHEN** the historical period control is displayed
- **THEN** the derived start year is visible on the left and the selected end year is visible on the right

#### Scenario: Horizon change preserves end year

- **WHEN** the investor changes the investment horizon and the current historical end year remains valid
- **THEN** the end year stays selected and the start year moves to maintain the new horizon

#### Scenario: Invalid end year is clamped

- **WHEN** a longer horizon makes the selected end year too early to provide a complete window
- **THEN** the end year is clamped to the nearest valid complete window without reducing the investment horizon

### Requirement: Historical Result Context

The system SHALL display a compact historical-period context line above the summary results identifying the selected calendar-year range and attributing the market data to SlickCharts.

#### Scenario: Result context identifies period

- **WHEN** the selected historical range is 2006-2025
- **THEN** the results identify 2006-2025 as the historical period before presenting aggregate outcomes

#### Scenario: Result context updates with slider

- **WHEN** the historical end year changes
- **THEN** the displayed historical range updates with the recomputed results

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

### Requirement: Portfolio Balance Chart

The system SHALL render a line or area chart mapping calendar year (X-axis) to portfolio balance (Y-axis) for both platforms in the active comparison.

The chart SHALL NOT render crash markers or return-adjustment popovers. Its tooltip SHALL show the calendar year, corresponding portfolio year, annual price return, and both active platform balances.

#### Scenario: Both active platforms plotted

- **WHEN** the active simulation completes
- **THEN** the chart shows one series per active platform across the selected calendar-year range with balances on the Y-axis

#### Scenario: Tooltip shows historical return

- **WHEN** the investor inspects a year on the balance chart
- **THEN** the tooltip shows that calendar year's applied price return, corresponding portfolio year, and both active platform labels

#### Scenario: Chart has no crash controls

- **WHEN** the balance chart is displayed
- **THEN** it contains no crash markers, crash-depth popovers, or per-year return adjustment controls

### Requirement: Tax Drag Chart

The system SHALL render a bar chart showing the tax paid in each calendar year by both platforms in the active comparison, making years where a CV method reduces tax visible through the plotted values.

#### Scenario: Per-year tax by active platform

- **WHEN** the active simulation completes
- **THEN** the bar chart shows annual tax paid for each active platform per selected calendar year

#### Scenario: Historical CV advantage visible

- **WHEN** a historical year causes either active platform's CV method to produce lower tax
- **THEN** the tax drag chart reflects that platform's lower tax for the calendar year

#### Scenario: Chart click opens active breakdown

- **WHEN** the investor clicks a tax bar for a calendar year
- **THEN** the breakdown table opens that year for the active comparison

### Requirement: Summary Dashboard

The system SHALL display a summary dashboard with key aggregate outcomes for both platforms in the active comparison, with fees itemised by category.

- Total Principal Contributed.
- Ordinary Final Net Balance for both active platforms.
- Total Fees Paid, itemised into applicable transaction, FX, brokerage, and management categories, plus a combined total per platform.
- Total NZ Tax Paid for both active platforms.
- In US-vs-Irish mode only, inherited wealth and US estate tax for both platforms.

#### Scenario: Summary metrics displayed

- **WHEN** the active simulation completes
- **THEN** the dashboard shows total principal and, for each active platform, ordinary final balance, total NZ tax, applicable itemised fees, and combined total fees

#### Scenario: Itemised fees sum to the combined total

- **WHEN** the itemised fee categories are displayed for a platform
- **THEN** the sum of the categories equals the combined total fees shown for that platform

#### Scenario: Inherited wealth is separate

- **WHEN** US-vs-Irish mode is active
- **THEN** the dashboard shows inherited wealth and estate tax separately from ordinary final net balance

#### Scenario: PIE mode omits estate summary

- **WHEN** PIE-vs-US mode is active
- **THEN** no inherited-wealth or estate-tax row is displayed

### Requirement: Year-by-Year Breakdown Drill-Down

The system SHALL provide an expandable year-by-year breakdown that lets the investor inspect, for any simulated year, the full tax calculation and per-order fee calculation for each active platform. It SHALL be presented as an accordion table with one row per state (Year 0 through the horizon), where each row expands inline without leaving the page.

Calendar year SHALL be the primary label for Years 1 through H, with portfolio year shown as secondary context. Each historical summary row SHALL show the applied price return and dividend return together in one compact return column headed `Price / Dividend`. Year 0 SHALL remain labelled as the initial state and show no historical return.

Tax detail SHALL match the active platform:

- InvestNow PIE: opening balance, gross dividends, US withholding, FDR income, PIR, gross PIE tax, foreign tax credit, and net PIE tax.
- Direct US ETF in PIE-vs-US mode: cost base, de minimis regime, gross dividends, foreign tax credit, exempt dividend tax or FIF FDR/CV calculations, selected method, and net tax.
- US-domiciled ETF in US-vs-Irish mode: opening balance, gross external dividends, withholding, foreign tax credit, FDR and CV calculations, selected method, and net tax.
- Irish-domiciled ETF: opening balance, gross internal dividends, internal withholding, net accumulated dividends, zero investor credit, FDR and CV calculations, selected method, and net tax.

Fee detail SHALL show one representative periodic order, its order count, annual totals, the initial order in Year 0, and the exit order in the final year. It SHALL identify the active FX method and applicable InvestNow, US, or LSE brokerage.

The expanded detail SHALL NOT repeat historical returns already visible in the summary row and SHALL NOT provide per-year return adjustment controls.

#### Scenario: Summary row shows both historical returns compactly

- **WHEN** a historical calendar year is displayed
- **THEN** its summary row shows price return above dividend return in one `Price / Dividend` column

#### Scenario: Initial state has no historical returns

- **WHEN** the Year 0 initial-state row is displayed
- **THEN** the return column shows that no historical value applies

#### Scenario: Active platform details are shown

- **WHEN** the investor expands a calendar year
- **THEN** the row reveals tax and fee calculations for the two active platforms while neighbouring rows remain visible

#### Scenario: InvestNow tax shows the withholding credit

- **WHEN** an InvestNow historical year is expanded
- **THEN** the PIE tax panel shows Gross PIE Tax minus the applied Foreign Tax Credit producing Net PIE Tax Owed

#### Scenario: Selected FIF method highlighted

- **WHEN** an expanded platform uses FIF taxation
- **THEN** both FDR and CV figures are displayed and the selected lower-tax method is highlighted

#### Scenario: Irish accumulation is visible

- **WHEN** an Irish ETF year is expanded
- **THEN** its panel distinguishes internal withholding and accumulated net dividends from external distributions and investor credits

#### Scenario: Representative order avoids duplication

- **WHEN** a year contains multiple identical periodic orders
- **THEN** one representative order is displayed with the order count and annual totals

#### Scenario: Chart click opens the corresponding calendar year

- **WHEN** the investor clicks a bar for a calendar year in the tax drag chart
- **THEN** the breakdown table expands or scrolls to that calendar year's row

#### Scenario: Historical returns are read-only

- **WHEN** a summary row displays price and dividend returns
- **THEN** it provides no slider, reset button, or override state

### Requirement: Mobile Breakdown Table Accessibility

The system SHALL ensure the year-by-year breakdown table remains accessible on small screens when its visible columns exceed the available horizontal space. Visible columns SHALL be reachable within the breakdown section without clipping content or requiring page-level horizontal scrolling.

#### Scenario: Narrow screen exposes visible breakdown columns

- **WHEN** the application is viewed on a small screen and the year-by-year breakdown table is wider than its container
- **THEN** the investor can access every visible table column, including the calendar year, combined price/dividend return column, both tax columns, and the expand/collapse control

#### Scenario: Desktop breakdown layout remains unchanged

- **WHEN** the application is viewed on a wide screen
- **THEN** the year-by-year breakdown continues to display as a full-width table within the results column with the desktop columns and row expansion behavior

#### Scenario: Expanded rows remain usable after horizontal access

- **WHEN** the investor expands a year from the breakdown table on a small screen
- **THEN** the expanded tax and fee detail remains visible within the breakdown section and does not cause hidden page-level overflow

### Requirement: Mobile Breakdown Compact Columns

The system SHALL simplify the year-by-year breakdown table on small screens by hiding both active platform balance columns. The compact mobile table SHALL continue to show the calendar year, combined price/dividend return column, both active platform tax columns, and expand/collapse control.

#### Scenario: Mobile breakdown hides balance columns

- **WHEN** the application is viewed on a small screen
- **THEN** the breakdown table does not display either active platform balance column
- **AND** it still displays calendar year, combined returns, both labelled tax columns, and expand/collapse control

#### Scenario: Desktop breakdown shows balance columns

- **WHEN** the application is viewed on a wide screen
- **THEN** the table displays both active platform balance columns with the calendar-year, combined-return, tax, and expand/collapse columns

#### Scenario: Mobile row expansion remains available

- **WHEN** the investor expands a year from the mobile breakdown table
- **THEN** the active platform tax and fee detail remains available for that year

### Requirement: Compact Breakdown Year Column

The system SHALL keep the calendar-year column in the year-by-year breakdown table compact so it does not consume unnecessary horizontal space in the mobile table. The column SHALL show the calendar year as its primary label and the portfolio-year number as secondary context.

#### Scenario: Mobile year column preserves space

- **WHEN** the application is viewed on a small screen
- **THEN** the year-by-year breakdown table uses a compact calendar-year column so the tax and expand/collapse columns receive more available horizontal space

#### Scenario: Calendar year remains visible

- **WHEN** a historical row appears in the mobile breakdown table
- **THEN** the year column identifies its calendar year and portfolio year in a readable compact form

#### Scenario: Desktop table remains readable

- **WHEN** the application is viewed on a wide screen
- **THEN** the calendar-year column remains readable and the breakdown table preserves its desktop columns and row expansion behavior

### Requirement: Stable Mobile Breakdown Expansion Layout

The system SHALL preserve the visible mobile breakdown table column widths and alignment when a year row is expanded or collapsed. Expanding a row SHALL NOT cause neighbouring summary rows, headers, the return column, tax columns, or the expand/collapse control to jump horizontally or collapse into narrower widths.

#### Scenario: Expanding mobile row preserves summary column widths

- **WHEN** the application is viewed on a small screen
- **AND** the investor expands a year in the year-by-year breakdown table
- **THEN** the visible summary table columns retain their widths and horizontal alignment
- **AND** neighbouring rows do not jump left or collapse horizontally

#### Scenario: Expanded detail remains available on mobile

- **WHEN** the investor expands a year from the mobile breakdown table
- **THEN** the expanded tax and fee detail remains visible and usable below that year's summary row

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
