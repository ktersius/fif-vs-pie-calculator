## ADDED Requirements

### Requirement: Mobile Breakdown Table Accessibility

The system SHALL ensure the year-by-year breakdown table remains accessible on small screens when its visible columns exceed the available horizontal space. Visible columns SHALL be reachable within the breakdown section without clipping content or requiring page-level horizontal scrolling.

#### Scenario: Narrow screen exposes visible breakdown columns

- **WHEN** the application is viewed on a small screen and the year-by-year breakdown table is wider than its container
- **THEN** the investor can access every visible table column, including the year, crash indicator when present, both tax columns, and the expand/collapse control

#### Scenario: Desktop breakdown layout remains unchanged

- **WHEN** the application is viewed on a wide screen
- **THEN** the year-by-year breakdown continues to display as a full-width table within the results column with the desktop columns and row expansion behavior

#### Scenario: Expanded rows remain usable after horizontal access

- **WHEN** the investor expands a year from the breakdown table on a small screen
- **THEN** the expanded tax, fee, and crash-depth detail remains visible within the breakdown section and does not cause hidden page-level overflow