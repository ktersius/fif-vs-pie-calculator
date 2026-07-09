## ADDED Requirements

### Requirement: Investor Input Control Panel

The system SHALL present a control panel allowing the investor to configure all simulation inputs, each with the specified range or options and default value.

- Initial Investment: $0 to $500,000 (default $100,000).
- Periodic Contribution: $0 to $10,000 (default $250).
- Contribution Frequency: dropdown [Weekly, Fortnightly, Monthly, Annually] (default Weekly).
- Expected Annual Market Return (excluding dividends): 4% to 15% (default 8%).
- Dividend Yield: 0% to 5% (default 1.5%).
- Marginal Income Tax Rate: dropdown [10.5%, 17.5%, 30%, 33%, 39%] (default 39%).
- PIE PIR: dropdown [10.5%, 17.5%, 28%] (default 28%).
- Number of Crash Years: 0 to 5 (default 3).

#### Scenario: Defaults on first load

- **WHEN** the application first loads
- **THEN** every input displays its specified default value

#### Scenario: Input change re-runs the simulation

- **WHEN** the investor changes any input within its allowed range
- **THEN** the simulation recomputes and all charts and summary figures update accordingly

#### Scenario: Inputs constrained to valid ranges

- **WHEN** the investor attempts to set a numeric input
- **THEN** the value is constrained to the specified minimum and maximum for that input

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

#### Scenario: Both portfolios plotted over 20 years

- **WHEN** the simulation completes
- **THEN** the chart shows one series per platform across Years 0 through 20 with balances on the Y-axis

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
