## ADDED Requirements

### Requirement: Stationary Block Bootstrap Paths

The system SHALL generate Monte Carlo market paths from the local paired annual S&P 500 price-return and dividend-return dataset using a stationary block bootstrap.

- Each path SHALL contain exactly the selected investment horizon in annual observations.
- Price and dividend returns SHALL remain paired from the same source year.
- A source sequence SHALL continue to the following historical record with probability 0.75 and SHALL start at a new random historical record with probability 0.25.
- Continuing beyond the latest historical record SHALL wrap to the earliest record.
- The mean block length SHALL therefore equal four years.

#### Scenario: Generated path has the requested horizon

- **WHEN** the investor selects a 20-year horizon
- **THEN** every generated Monte Carlo path contains exactly 20 paired annual observations

#### Scenario: Price and dividend observations remain paired

- **WHEN** a source historical year is selected for a synthetic year
- **THEN** that synthetic year uses both the price return and dividend return from the same source record

#### Scenario: Historical blocks continue in order

- **WHEN** the bootstrap continues the current block
- **THEN** it selects the next chronological historical record, wrapping to the earliest record after the latest

### Requirement: Reproducible Monte Carlo Run

The PIE-versus-direct Monte Carlo analysis SHALL execute 5,000 scenarios using deterministic seed `42`. Repeated runs with identical investor inputs, historical data, and source code SHALL produce identical aggregate results.

#### Scenario: Identical inputs reproduce results

- **WHEN** the Monte Carlo analysis runs twice with identical inputs
- **THEN** win counts, percentiles, tax, fees, and histogram values are identical

#### Scenario: Investor input changes results

- **WHEN** the investor changes a financial input or investment horizon
- **THEN** the Monte Carlo analysis recomputes all 5,000 scenarios using the updated inputs

### Requirement: Shared PIE and Direct Market Path

Each Monte Carlo scenario SHALL run InvestNow PIE and the direct US ETF through the same generated annual market path. Both structures SHALL retain the existing contribution timing, fees, dividend withholding, PIE taxation, de minimis treatment, FIF FDR/CV selection, foreign tax credit, balance floor, and exit behavior.

#### Scenario: Both structures receive identical returns

- **WHEN** a Monte Carlo scenario is evaluated
- **THEN** InvestNow PIE and the direct US ETF use identical price and dividend returns for every corresponding simulated year

#### Scenario: Historical calculations remain unchanged

- **WHEN** the existing Historical Backtest runs with inputs and a selected historical period
- **THEN** it produces the same annual records and aggregate results as before Monte Carlo support

### Requirement: Monte Carlo Distribution Results

The system SHALL aggregate the 5,000 scenarios without retaining every full annual result. It SHALL report:

- PIE, direct-US, and tied final-balance win counts and rates.
- 10th percentile, median, and 90th percentile final balance for each structure.
- 10th percentile, median, and 90th percentile direct-minus-PIE final-value difference.
- 10th percentile, median, and 90th percentile total New Zealand tax and total fees for each structure.
- Histogram buckets for the direct-minus-PIE final-value difference.

The direct-minus-PIE final-value difference SHALL equal the direct US ETF final balance minus the InvestNow PIE final balance.

#### Scenario: Positive difference favours direct holdings

- **WHEN** a scenario's direct final balance exceeds its PIE final balance
- **THEN** its final-value difference is positive and it increments the direct-US win count

#### Scenario: Negative difference favours InvestNow PIE

- **WHEN** a scenario's InvestNow PIE final balance exceeds its direct final balance
- **THEN** its final-value difference is negative and it increments the PIE win count

#### Scenario: Percentiles use all scenarios

- **WHEN** Monte Carlo aggregation completes
- **THEN** each reported percentile is calculated from all 5,000 corresponding scenario outcomes

#### Scenario: Histogram accounts for every scenario

- **WHEN** the result histogram is produced
- **THEN** the sum of all histogram bucket counts equals 5,000

### Requirement: Monte Carlo Interpretation

The system SHALL identify the Monte Carlo result as a historically conditioned stationary-block-bootstrap analysis rather than a forecast. It SHALL display the run count, seed, mean block length, and historical data source.

#### Scenario: Investor views Monte Carlo results

- **WHEN** Monte Carlo Simulation is active
- **THEN** the interface states that results are generated from resampled historical behavior and do not predict future market or tax outcomes
