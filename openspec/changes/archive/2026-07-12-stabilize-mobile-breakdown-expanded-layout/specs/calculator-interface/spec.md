## ADDED Requirements

### Requirement: Stable Mobile Breakdown Expansion Layout

The system SHALL preserve the visible mobile breakdown table column widths and alignment when a year row is expanded or collapsed. Expanding a row SHALL NOT cause neighbouring summary rows, headers, tax columns, or the expand/collapse control to jump horizontally or collapse into narrower widths.

#### Scenario: Expanding mobile row preserves summary column widths

- **WHEN** the application is viewed on a small screen
- **AND** the investor expands a year in the year-by-year breakdown table
- **THEN** the visible summary table columns retain their widths and horizontal alignment
- **AND** neighbouring rows do not jump left or collapse horizontally

#### Scenario: Expanded detail remains available on mobile

- **WHEN** the investor expands a year from the mobile breakdown table
- **THEN** the expanded tax, fee, and crash-depth detail remains visible and usable below that year's summary row

#### Scenario: Desktop expansion remains unchanged

- **WHEN** the application is viewed on a wide screen
- **AND** the investor expands a year in the breakdown table
- **THEN** the desktop table columns and expanded detail layout remain readable and aligned