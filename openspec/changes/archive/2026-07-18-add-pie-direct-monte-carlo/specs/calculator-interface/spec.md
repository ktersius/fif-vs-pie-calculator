## ADDED Requirements

### Requirement: Analysis Method Selector

The system SHALL present an accessible analysis-method selector with `Historical Backtest` and `Monte Carlo Simulation` options. `Historical Backtest` SHALL be selected by default.

Historical Backtest SHALL retain both existing comparison modes. Monte Carlo Simulation SHALL compare InvestNow PIE with a direct US ETF held through IBKR.

#### Scenario: Historical backtest remains default

- **WHEN** the application first loads
- **THEN** Historical Backtest is selected and the existing PIE-versus-US historical comparison is displayed

#### Scenario: Investor selects Monte Carlo

- **WHEN** the investor selects Monte Carlo Simulation
- **THEN** the interface identifies PIE fund versus direct US ETF as the comparison
- **AND** it displays Monte Carlo controls and distribution results instead of single-period charts and breakdowns

#### Scenario: Historical comparison selection is preserved

- **WHEN** the investor selects a historical comparison, switches to Monte Carlo, and later returns to Historical Backtest
- **THEN** the previously selected historical comparison is restored

### Requirement: Historical Backtest Identification

The existing contiguous-period analysis SHALL be named `Historical Backtest`. Its heading and explanatory text SHALL state that it replays one actual historical S&P 500 period to show what would have happened under the selected investment structures and calculator assumptions.

#### Scenario: Historical method is clearly described

- **WHEN** Historical Backtest is active
- **THEN** the page identifies the selected calendar range as one actual historical path
- **AND** it does not describe the result as a forecast or probability

### Requirement: Monte Carlo Result Presentation

The Monte Carlo view SHALL display PIE/direct win rates, percentile final balances, percentile final-value differences, percentile tax and fees, and a final-value-difference histogram. It SHALL NOT display the historical-period context, annual balance chart, annual tax-drag chart, or year-by-year breakdown.

InvestNow PIE SHALL use green and the direct US ETF held through IBKR SHALL use blue consistently across historical and Monte Carlo cards, labels, charts, and histogram indicators. Text labels and values SHALL remain available so colour is not the sole means of identification.

The final-value-difference percentile table SHALL identify the calculation as direct US ETF final balance minus InvestNow PIE final balance. It SHALL state that positive values favour direct holdings and negative values favour InvestNow PIE.

The final-value-difference histogram SHALL include a negative/zero/positive direction guide and a text outcome for every range: `PIE ahead`, `Near tie`, or `Direct ahead`. Histogram colour SHALL match the platform colour contract but SHALL NOT replace the text outcome.

#### Scenario: Distribution replaces single-path outputs

- **WHEN** Monte Carlo Simulation is active
- **THEN** aggregate distribution results and the difference histogram are displayed
- **AND** components that imply one selected historical path are absent

#### Scenario: Monte Carlo results remain accessible

- **WHEN** the result distribution is viewed on a small screen or with assistive technology
- **THEN** platform labels, percentile labels, values, win rates, and interpretation text remain available without relying on chart colour alone

#### Scenario: Platform colours remain consistent

- **WHEN** InvestNow PIE and direct US ETF results are displayed
- **THEN** InvestNow PIE is identified with green
- **AND** the direct US ETF held through IBKR is identified with blue
- **AND** both platforms are also identified by text

#### Scenario: Final-value-difference direction is explicit

- **WHEN** percentile final-value differences are displayed
- **THEN** the metric is labelled as direct US ETF minus InvestNow PIE
- **AND** positive values are described as direct US ETF finishing ahead
- **AND** negative values are described as InvestNow PIE finishing ahead

#### Scenario: Histogram ranges identify the leading structure

- **WHEN** the final-value-difference histogram is displayed
- **THEN** negative ranges are labelled `PIE ahead`
- **AND** ranges spanning zero are labelled `Near tie`
- **AND** positive ranges are labelled `Direct ahead`
- **AND** the same meaning is shown through text as well as colour

## MODIFIED Requirements

### Requirement: Investor Input Control Panel

The system SHALL present a control panel allowing the investor to configure all applicable simulation inputs, each with the specified range or options and default value.

Shared financial controls:

- Initial Investment: $0 to $500,000 (default $100,000).
- Periodic Contribution: $0 to $10,000 (default $250).
- Contribution Frequency: dropdown [Weekly, Fortnightly, Monthly, Annually] (default Weekly).
- Investment Horizon: 1 to 50 years (default 20).
- Marginal Income Tax Rate: dropdown [10.5%, 17.5%, 30%, 33%, 39%] (default 39%).

Historical Backtest controls:

- Historical End Year: range defined by the available 1957-onward dataset and current investment horizon (default latest completed year).
- PIE-vs-US SHALL show PIE PIR: dropdown [10.5%, 17.5%, 28%] (default 28%).
- US-vs-Irish SHALL show FX Conversion: [Auto Conversion, Manual Spot] (default Auto Conversion).

Monte Carlo Simulation controls:

- PIE PIR: dropdown [10.5%, 17.5%, 28%] (default 28%).
- Historical End Year and FX Conversion SHALL be hidden because Monte Carlo is limited to PIE versus direct US holdings and generates synthetic paths from the full dataset.
- Run count, seed, and mean block length SHALL be displayed as fixed assumptions rather than editable controls.

Hidden analysis- and comparison-specific values SHALL be preserved when switching methods or comparisons.

The control panel SHALL NOT expose expected market return, dividend yield, crash count, crash severity, re-roll, per-year market override, exchange-rate, ETF ticker, expense-ratio, estate-tax, run-count, random-seed, or block-length controls.

#### Scenario: Defaults on first load

- **WHEN** the application first loads
- **THEN** Historical Backtest and PIE-vs-US are selected
- **AND** every applicable input displays its specified default value, including a 20-year investment horizon and the latest valid 20-year historical period

#### Scenario: Input change re-runs the active analysis

- **WHEN** the investor changes any visible input within its allowed range
- **THEN** the active Historical Backtest or Monte Carlo Simulation recomputes and all active results update accordingly

#### Scenario: Inputs constrained to valid ranges

- **WHEN** the investor attempts to set a numeric input
- **THEN** the value is constrained to the specified minimum and maximum for that input

#### Scenario: Historical comparison controls change

- **WHEN** Historical Backtest switches from PIE-vs-US to US-vs-Irish
- **THEN** the PIE PIR control is hidden and the FX conversion control is shown

#### Scenario: Monte Carlo controls are focused

- **WHEN** Monte Carlo Simulation is active
- **THEN** PIE PIR is shown
- **AND** Historical End Year, FX Conversion, and sampling-setting controls are absent

#### Scenario: Input values survive method switching

- **WHEN** the investor changes common or method-specific inputs, switches analysis methods, and later switches back
- **THEN** the previously selected values are restored

#### Scenario: Removed market controls are absent

- **WHEN** the control panel is displayed in either analysis method
- **THEN** no expected-return, dividend-yield, crash-count, crash-severity, re-roll, manual return override, or configurable tax-constant control is present
