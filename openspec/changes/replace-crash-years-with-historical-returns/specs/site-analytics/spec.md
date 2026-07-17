## MODIFIED Requirements

### Requirement: Anonymous calculator interaction events

The system SHALL track only approved anonymous high-level calculator interactions as GoatCounter custom events. Changing the historical period SHALL NOT send an analytics event.

#### Scenario: Year breakdown is expanded

- **WHEN** the investor expands a year in the year-by-year breakdown
- **THEN** the system SHALL send an anonymous GoatCounter event for `/event/expand-year-breakdown`

#### Scenario: Tax chart year is selected

- **WHEN** the investor selects a year from the tax drag chart
- **THEN** the system SHALL send an anonymous GoatCounter event for `/event/click-tax-chart-year`

#### Scenario: Historical period changes are not tracked

- **WHEN** the investor changes the historical end year
- **THEN** the system SHALL NOT send a GoatCounter custom event for that interaction
