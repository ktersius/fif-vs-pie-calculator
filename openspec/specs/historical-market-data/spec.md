# historical-market-data Specification

## Purpose

TBD - Defines the static in-repository S&P 500 annual market dataset used as the sole source of price and dividend returns for both portfolios.

## Requirements

### Requirement: Static Historical Market Dataset

The system SHALL include an in-repository annual S&P 500 dataset beginning with 1957 and containing one record for every completed calendar year through the latest included year.

Each record MUST contain:
- Calendar year.
- Annual price return, excluding dividends.
- Annual dividend return.

The dataset SHALL be ordered by year, SHALL contain no duplicate or missing years within its covered range, SHALL identify SlickCharts as its source, and SHALL NOT require a runtime network request.

#### Scenario: Historical dataset is loaded

- **WHEN** the calculator starts
- **THEN** all included annual price and dividend returns are available locally without contacting an external data provider

#### Scenario: Partial year is excluded

- **WHEN** the current calendar year has not completed
- **THEN** that partial year's return is not included in the selectable historical range

#### Scenario: Historical data is attributed

- **WHEN** the calculator presents the selected historical period or documents its market data
- **THEN** SlickCharts is identified as the source of the annual S&P 500 price and dividend returns

### Requirement: Contiguous Historical Window

The system SHALL select exactly H contiguous historical records for an investment horizon of H years using a configured historical end year.

The selected start year SHALL equal `end year - H + 1`. Simulation Year 1 SHALL map to the selected start year, Simulation Year H SHALL map to the selected end year, and both portfolios SHALL use the same record for each simulated year.

#### Scenario: Default historical window

- **WHEN** the calculator loads with the default 20-year horizon
- **THEN** it selects the latest 20 completed calendar years in the dataset

#### Scenario: Historical year maps to portfolio year

- **WHEN** the selected range is 2006 through 2025 for a 20-year horizon
- **THEN** Simulation Year 1 uses the 2006 record and Simulation Year 20 uses the 2025 record

#### Scenario: Both portfolios share market history

- **WHEN** a historical window is simulated
- **THEN** InvestNow and IBKR use identical price and dividend returns for every corresponding calendar year

### Requirement: Historical Dataset Update Policy

The historical dataset SHALL be updated manually only after a calendar year has completed. An update MUST add the completed year's price and dividend returns, preserve contiguous coverage, update the latest-year metadata, and retain source attribution.

#### Scenario: Completed year is added

- **WHEN** maintainers update the dataset after a calendar year closes
- **THEN** the new year becomes the latest selectable end year and the default historical window advances to include it

#### Scenario: Dataset continuity is validated

- **WHEN** a historical-data update is tested
- **THEN** duplicate years, missing years, non-ascending order, or an incomplete latest year cause the validation to fail
