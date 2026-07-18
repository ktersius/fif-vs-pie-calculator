## ADDED Requirements

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

## MODIFIED Requirements

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
