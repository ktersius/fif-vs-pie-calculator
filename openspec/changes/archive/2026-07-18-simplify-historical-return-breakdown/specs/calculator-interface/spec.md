## MODIFIED Requirements

### Requirement: Year-by-Year Breakdown Drill-Down

The system SHALL provide an expandable year-by-year breakdown that lets the investor inspect, for any simulated year, the full tax calculation and the per-order fee calculation for each platform. It SHALL be presented as an accordion table with one row per state (Year 0 through the horizon), where each row expands inline to reveal the detail without leaving the page.

Calendar year SHALL be the primary label for Years 1 through H, with portfolio year shown as secondary context. Each historical summary row SHALL show the applied price return and dividend return together in one compact return column. The header SHALL identify the display order as `Price / Dividend`, with price shown first and dividend second. Year 0 SHALL remain labelled as the initial state and SHALL show no historical return value.

Tax detail per year SHALL show:
- InvestNow (PIE): opening balance, FDR taxable income (opening balance x 5%), PIR, and PIE tax owed.
- IBKR (FIF): cost base with de minimis status (exempt or FIF); gross dividends and foreign tax credit; when FIF-exempt, the dividend-only computation (NZ gross tax, FTC, net); when the FIF regime applies, both the FDR method and CV method figures with the selected (lesser) method highlighted and the resulting net tax owed.

Fee detail per year SHALL show a representative single-order breakdown rather than repeating identical periodic orders:
- IBKR: gross order amount -> FX fee (0.03%) -> brokerage fee (capped) -> net invested, plus the number of orders in the year and the annual fee totals.
- InvestNow: the annual contribution and the aggregate 0.50% buy fee, plus the management fee for the year.
- Year 0 SHALL show the one-off initial-investment order breakdown, and the final horizon year SHALL show the one-off exit-fee breakdown.

The expanded detail SHALL focus on platform tax and fee calculations and SHALL NOT repeat the price or dividend returns already visible in the summary row. The breakdown SHALL NOT provide per-year return adjustment controls.

#### Scenario: Summary row shows both historical returns compactly

- **WHEN** a historical calendar year is displayed in the breakdown table
- **THEN** its summary row shows the applied price return above the dividend return in one column headed `Price / Dividend`

#### Scenario: Initial state has no historical returns

- **WHEN** the Year 0 initial-state row is displayed
- **THEN** the return column shows that no historical value applies

#### Scenario: Expand a year to view tax breakdown

- **WHEN** the investor expands a calendar year's row in the breakdown table
- **THEN** the row reveals, for each platform, the full tax and fee calculations without repeating the historical return values while neighbouring rows remain visible

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

- **WHEN** a historical summary row displays price and dividend returns
- **THEN** the return column provides no slider, reset button, or override state

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

The system SHALL simplify the year-by-year breakdown table on small screens by hiding the `InvestNow balance` and `IBKR balance` columns. The compact mobile table SHALL continue to show the calendar year, combined price/dividend return column, InvestNow tax, IBKR tax, and expand/collapse control.

#### Scenario: Mobile breakdown hides balance columns

- **WHEN** the application is viewed on a small screen
- **THEN** the year-by-year breakdown table does not display the `InvestNow balance` or `IBKR balance` columns
- **AND** the table still displays the calendar year, combined price/dividend return column, InvestNow tax, IBKR tax, and expand/collapse control

#### Scenario: Desktop breakdown shows balance columns

- **WHEN** the application is viewed on a wide screen
- **THEN** the year-by-year breakdown table displays both platform balance columns along with the calendar-year, combined return, tax, and expand/collapse columns

#### Scenario: Mobile row expansion remains available

- **WHEN** the investor expands a year from the mobile breakdown table
- **THEN** the expanded tax and fee detail remains available for that year

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
