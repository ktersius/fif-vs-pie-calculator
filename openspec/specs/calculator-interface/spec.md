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

#### Scenario: Defaults on first load

- **WHEN** the application first loads
- **THEN** every input displays its specified default value, including a 20-year investment horizon

#### Scenario: Input change re-runs the simulation

- **WHEN** the investor changes any input within its allowed range
- **THEN** the simulation recomputes and all charts and summary figures update accordingly

#### Scenario: Inputs constrained to valid ranges

- **WHEN** the investor attempts to set a numeric input
- **THEN** the value is constrained to the specified minimum and maximum for that input

#### Scenario: Crash years cannot exceed the horizon

- **WHEN** the investor sets an investment horizon shorter than the current number of crash years
- **THEN** the number of crash years is clamped to the investment horizon so crash years never exceed the number of simulated years

### Requirement: Crash Year Re-roll Control

The system SHALL provide an explicit "Re-roll crash years" control that recomputes the crash-year placement, while keeping the placement stable across all other input changes.

#### Scenario: Re-roll produces a new crash-year placement

- **WHEN** the investor clicks the re-roll control
- **THEN** a new crash-year seed is generated, the crash years are recomputed, and the simulation and all outputs update

#### Scenario: Changing other inputs does not re-roll

- **WHEN** the investor changes any input other than the re-roll control or the number of crash years
- **THEN** the crash-year placement is preserved and only the affected calculations change

### Requirement: Portfolio Balance Chart

The system SHALL render a line or area chart mapping year (X-axis) to portfolio balance (Y-axis) for both the InvestNow and IBKR portfolios.

#### Scenario: Both portfolios plotted over the horizon

- **WHEN** the simulation completes
- **THEN** the chart shows one series per platform across Year 0 through the final year of the investment horizon with balances on the Y-axis

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

Crash years SHALL be visually flagged in the breakdown.

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
