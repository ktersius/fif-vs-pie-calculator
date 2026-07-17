## ADDED Requirements

### Requirement: Historical Period Control

The system SHALL provide a single native range control for selecting the historical end year. The selected historical window length SHALL always equal the investment horizon, and the interface SHALL display the derived start and end years.

The slider minimum SHALL equal `earliest dataset year + horizon - 1`; its maximum SHALL equal the latest completed dataset year. The default SHALL select the latest completed year.

#### Scenario: Latest range selected by default

- **WHEN** the calculator loads with a 20-year horizon and 2025 is the latest dataset year
- **THEN** the historical control displays the range 2006-2025 with end year 2025 selected

#### Scenario: Sliding changes the contiguous range

- **WHEN** the investor moves the historical end-year slider
- **THEN** the start year changes to remain exactly one investment horizon before the selected end year and the simulation recomputes

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

## MODIFIED Requirements

### Requirement: Investor Input Control Panel

The system SHALL present a control panel allowing the investor to configure all simulation inputs, each with the specified range or options and default value.

- Initial Investment: $0 to $500,000 (default $100,000).
- Periodic Contribution: $0 to $10,000 (default $250).
- Contribution Frequency: dropdown [Weekly, Fortnightly, Monthly, Annually] (default Weekly).
- Investment Horizon: 1 to 50 years (default 20).
- Historical End Year: range defined by the available 1957-onward dataset and current investment horizon (default latest completed year).
- Marginal Income Tax Rate: dropdown [10.5%, 17.5%, 30%, 33%, 39%] (default 39%).
- PIE PIR: dropdown [10.5%, 17.5%, 28%] (default 28%).

The control panel SHALL NOT expose expected market return, dividend yield, crash count, crash severity, re-roll, or per-year market override controls.

#### Scenario: Defaults on first load

- **WHEN** the application first loads
- **THEN** every input displays its specified default value, including a 20-year investment horizon and the latest valid 20-year historical period

#### Scenario: Input change re-runs the simulation

- **WHEN** the investor changes any input within its allowed range
- **THEN** the simulation recomputes and all charts and summary figures update accordingly

#### Scenario: Inputs constrained to valid ranges

- **WHEN** the investor attempts to set a numeric input
- **THEN** the value is constrained to the specified minimum and maximum for that input

#### Scenario: Removed market controls are absent

- **WHEN** the control panel is displayed
- **THEN** no expected-return, dividend-yield, crash-count, crash-severity, re-roll, or manual return override control is present

### Requirement: Portfolio Balance Chart

The system SHALL render a line or area chart mapping calendar year (X-axis) to portfolio balance (Y-axis) for both the InvestNow and IBKR portfolios.

The chart SHALL NOT render crash markers or return-adjustment popovers. Its tooltip SHALL show the calendar year, corresponding portfolio year, annual price return, and both portfolio balances.

#### Scenario: Both portfolios plotted over the historical period

- **WHEN** the simulation completes
- **THEN** the chart shows one series per platform across the selected calendar-year range with balances on the Y-axis

#### Scenario: Tooltip shows historical return

- **WHEN** the investor inspects a year on the balance chart
- **THEN** the tooltip shows that calendar year's applied price return and corresponding portfolio year

#### Scenario: Chart has no crash controls

- **WHEN** the balance chart is displayed
- **THEN** it contains no crash markers, crash-depth popovers, or per-year return adjustment controls

### Requirement: Tax Drag Chart

The system SHALL render a bar chart showing the tax paid in each calendar year by platform, making years where the CV method reduces IBKR tax visible through the plotted values.

#### Scenario: Per-year tax by platform

- **WHEN** the simulation completes
- **THEN** the bar chart shows annual tax paid for each platform per selected calendar year

#### Scenario: Historical CV advantage visible

- **WHEN** a historical year causes the IBKR CV method to produce lower tax
- **THEN** the tax drag chart reflects the lower IBKR tax for that calendar year relative to InvestNow

### Requirement: Year-by-Year Breakdown Drill-Down

The system SHALL provide an expandable year-by-year breakdown that lets the investor inspect, for any simulated year, the full tax calculation and the per-order fee calculation for each platform. It SHALL be presented as an accordion table with one row per state (Year 0 through the horizon), where each row expands inline to reveal the detail without leaving the page.

Calendar year SHALL be the primary label for Years 1 through H, with portfolio year shown as secondary context. Each historical row SHALL show the applied price return and dividend return. Year 0 SHALL remain labelled as the initial state and SHALL NOT claim a historical return.

Tax detail per year SHALL show:
- InvestNow (PIE): opening balance, FDR taxable income (opening balance x 5%), PIR, and PIE tax owed.
- IBKR (FIF): cost base with de minimis status (exempt or FIF); gross dividends and foreign tax credit; when FIF-exempt, the dividend-only computation (NZ gross tax, FTC, net); when the FIF regime applies, both the FDR method and CV method figures with the selected (lesser) method highlighted and the resulting net tax owed.

Fee detail per year SHALL show a representative single-order breakdown rather than repeating identical periodic orders:
- IBKR: gross order amount -> FX fee (0.03%) -> brokerage fee (capped) -> net invested, plus the number of orders in the year and the annual fee totals.
- InvestNow: the annual contribution and the aggregate 0.50% buy fee, plus the management fee for the year.
- Year 0 SHALL show the one-off initial-investment order breakdown, and the final horizon year SHALL show the one-off exit-fee breakdown.

The breakdown SHALL NOT provide per-year return adjustment controls.

#### Scenario: Expand a year to view tax breakdown

- **WHEN** the investor expands a calendar year's row in the breakdown table
- **THEN** the row reveals the applied price and dividend returns and, for each platform, the full tax calculation while neighbouring rows remain visible

#### Scenario: Selected FIF method highlighted

- **WHEN** a year's IBKR breakdown is shown while the FIF regime applies
- **THEN** both the FDR and CV method figures are displayed and the method producing the lesser net tax is highlighted as the one applied

#### Scenario: Representative order avoids duplication

- **WHEN** the fee breakdown for a year with multiple identical periodic orders is shown
- **THEN** a single representative order breakdown is displayed alongside the order count and annual fee totals, rather than one row per order

#### Scenario: Chart click opens the corresponding calendar year

- **WHEN** the investor clicks a bar for a given calendar year in the tax drag chart
- **THEN** the breakdown table expands or scrolls to that calendar year's row

#### Scenario: Historical returns are read-only

- **WHEN** the investor expands a historical year's row
- **THEN** the applied price and dividend returns are displayed without a slider, reset button, or override state

### Requirement: Mobile Breakdown Table Accessibility

The system SHALL ensure the year-by-year breakdown table remains accessible on small screens when its visible columns exceed the available horizontal space. Visible columns SHALL be reachable within the breakdown section without clipping content or requiring page-level horizontal scrolling.

#### Scenario: Narrow screen exposes visible breakdown columns

- **WHEN** the application is viewed on a small screen and the year-by-year breakdown table is wider than its container
- **THEN** the investor can access every visible table column, including the calendar year, return, both tax columns, and the expand/collapse control

#### Scenario: Desktop breakdown layout remains unchanged

- **WHEN** the application is viewed on a wide screen
- **THEN** the year-by-year breakdown continues to display as a full-width table within the results column with the desktop columns and row expansion behavior

#### Scenario: Expanded rows remain usable after horizontal access

- **WHEN** the investor expands a year from the breakdown table on a small screen
- **THEN** the expanded tax, fee, and historical-return detail remains visible within the breakdown section and does not cause hidden page-level overflow

### Requirement: Mobile Breakdown Compact Columns

The system SHALL simplify the year-by-year breakdown table on small screens by hiding the `InvestNow balance` and `IBKR balance` columns. The compact mobile table SHALL continue to show the calendar year, applied price return, InvestNow tax, IBKR tax, and expand/collapse control.

#### Scenario: Mobile breakdown hides balance columns

- **WHEN** the application is viewed on a small screen
- **THEN** the year-by-year breakdown table does not display the `InvestNow balance` or `IBKR balance` columns
- **AND** the table still displays the calendar year, applied price return, InvestNow tax, IBKR tax, and expand/collapse control

#### Scenario: Desktop breakdown shows balance columns

- **WHEN** the application is viewed on a wide screen
- **THEN** the year-by-year breakdown table displays both platform balance columns along with the calendar-year, return, tax, and expand/collapse columns

#### Scenario: Mobile row expansion remains available

- **WHEN** the investor expands a year from the mobile breakdown table
- **THEN** the expanded tax, fee, and historical-return detail remains available for that year

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

The system SHALL preserve the visible mobile breakdown table column widths and alignment when a year row is expanded or collapsed. Expanding a row SHALL NOT cause neighbouring summary rows, headers, tax columns, or the expand/collapse control to jump horizontally or collapse into narrower widths.

#### Scenario: Expanding mobile row preserves summary column widths

- **WHEN** the application is viewed on a small screen
- **AND** the investor expands a year in the year-by-year breakdown table
- **THEN** the visible summary table columns retain their widths and horizontal alignment
- **AND** neighbouring rows do not jump left or collapse horizontally

#### Scenario: Expanded detail remains available on mobile

- **WHEN** the investor expands a year from the mobile breakdown table
- **THEN** the expanded tax, fee, and historical-return detail remains visible and usable below that year's summary row

#### Scenario: Desktop expansion remains unchanged

- **WHEN** the application is viewed on a wide screen
- **AND** the investor expands a year in the breakdown table
- **THEN** the desktop table columns and expanded detail layout remain readable and aligned

## REMOVED Requirements

### Requirement: Crash Severity Adjustment Control

**Reason**: Annual price and dividend returns are read-only historical observations.

**Migration**: Inspect each year's historical returns in chart tooltips and the year-by-year breakdown.

#### Scenario: Crash adjustment controls are removed

- **WHEN** the historical return interface is displayed
- **THEN** no crash-depth slider, override indicator, or reset control is available

### Requirement: Crash Year Re-roll Control

**Reason**: The investor explicitly selects a contiguous historical period, so random placement is no longer part of the model.

**Migration**: Move the historical end-year slider to select a different contiguous market period.

#### Scenario: Re-roll control is removed

- **WHEN** the control panel is displayed
- **THEN** no re-roll button or random crash seed behavior is available
