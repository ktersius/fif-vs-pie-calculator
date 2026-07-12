## ADDED Requirements

### Requirement: Mobile Breakdown Compact Columns

The system SHALL simplify the year-by-year breakdown table on small screens by hiding the `InvestNow balance` and `IBKR balance` columns. The compact mobile table SHALL continue to show the year, crash-year indicator when present, InvestNow tax, IBKR tax, and expand/collapse control.

#### Scenario: Mobile breakdown hides balance columns

- **WHEN** the application is viewed on a small screen
- **THEN** the year-by-year breakdown table does not display the `InvestNow balance` or `IBKR balance` columns
- **AND** the table still displays the year, InvestNow tax, IBKR tax, and expand/collapse control

#### Scenario: Desktop breakdown shows balance columns

- **WHEN** the application is viewed on a wide screen
- **THEN** the year-by-year breakdown table displays both platform balance columns along with the existing tax columns and expand/collapse control

#### Scenario: Mobile row expansion remains available

- **WHEN** the investor expands a year from the mobile breakdown table
- **THEN** the expanded tax, fee, and crash-depth detail remains available for that year