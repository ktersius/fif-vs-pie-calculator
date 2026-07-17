## MODIFIED Requirements

### Requirement: Year-by-Year Breakdown Drill-Down

The system SHALL provide an expandable year-by-year breakdown that lets the investor inspect, for any simulated year, the full tax calculation and the per-order fee calculation for each platform. It SHALL be presented as an accordion table with one row per state (Year 0 through the horizon), where each row expands inline to reveal the detail without leaving the page.

Calendar year SHALL be the primary label for Years 1 through H, with portfolio year shown as secondary context. Each historical summary row SHALL show the applied price return and dividend return together in one compact return column. The header SHALL identify the display order as `Price / Dividend`, with price shown first and dividend second. Year 0 SHALL remain labelled as the initial state and SHALL show no historical return value.

Tax detail per year SHALL show:
- InvestNow (PIE): opening balance, gross dividends, US withholding tax, FDR taxable income (opening balance x 5%), PIR, Gross PIE Tax, applied Foreign Tax Credit, and Net PIE Tax Owed.
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

#### Scenario: InvestNow tax shows the withholding credit

- **WHEN** an InvestNow historical year is expanded
- **THEN** the PIE tax panel shows Gross PIE Tax minus the applied Foreign Tax Credit producing Net PIE Tax Owed

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
