## Purpose

TBD - Captures requirements for privacy-preserving site analytics.

## Requirements

### Requirement: GoatCounter pageview tracking
The system SHALL support GoatCounter pageview analytics for the deployed static site when a GoatCounter endpoint is configured.

#### Scenario: Analytics endpoint configured
- **WHEN** the site is built with a GoatCounter endpoint configured
- **THEN** the deployed page SHALL load GoatCounter so pageviews can be counted

#### Scenario: Analytics endpoint absent
- **WHEN** the site is built without a GoatCounter endpoint configured
- **THEN** the application SHALL load and function without sending GoatCounter analytics

### Requirement: Anonymous calculator interaction events
The system SHALL track only approved anonymous high-level calculator interactions as GoatCounter custom events.

#### Scenario: Crash years are re-rolled
- **WHEN** the investor activates the re-roll crash years control
- **THEN** the system SHALL send an anonymous GoatCounter event for `/event/reroll-crash-years`

#### Scenario: Crash depth is adjusted
- **WHEN** the investor changes a crash depth override
- **THEN** the system SHALL send an anonymous GoatCounter event for `/event/adjust-crash-depth`

#### Scenario: Year breakdown is expanded
- **WHEN** the investor expands a year in the year-by-year breakdown
- **THEN** the system SHALL send an anonymous GoatCounter event for `/event/expand-year-breakdown`

#### Scenario: Tax chart year is selected
- **WHEN** the investor selects a year from the tax drag chart
- **THEN** the system SHALL send an anonymous GoatCounter event for `/event/click-tax-chart-year`

### Requirement: Financial values are excluded from analytics
The system SHALL NOT send user-entered financial assumptions, tax rates, balances, calculated results, or per-year simulation values to GoatCounter.

#### Scenario: Interaction event is sent
- **WHEN** the system sends an analytics event for a calculator interaction
- **THEN** the event SHALL include only the approved event path and optional human-readable title, not financial inputs or calculation outputs

### Requirement: Analytics failures do not affect calculator behavior
The system SHALL keep calculator behavior independent from GoatCounter availability.

#### Scenario: GoatCounter script fails to load
- **WHEN** the GoatCounter script is blocked or fails to load
- **THEN** the calculator SHALL remain usable and interactions SHALL continue to update simulation outputs normally

### Requirement: Analytics events are debounced
The system SHALL debounce custom analytics events by event type before sending them to GoatCounter.

#### Scenario: Repeated interaction occurs rapidly
- **WHEN** the same tracked interaction fires repeatedly within the debounce window
- **THEN** the system SHALL send at most one GoatCounter event for that interaction type after the rapid sequence settles
