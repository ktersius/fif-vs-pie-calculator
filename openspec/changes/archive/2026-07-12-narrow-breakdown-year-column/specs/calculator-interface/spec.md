## ADDED Requirements

### Requirement: Compact Breakdown Year Column

The system SHALL keep the Year column in the year-by-year breakdown table compact so it does not consume unnecessary horizontal space in the mobile table. The Year column SHALL continue to show the year number and crash-year indicator when applicable.

#### Scenario: Mobile year column preserves space

- **WHEN** the application is viewed on a small screen
- **THEN** the year-by-year breakdown table uses a compact Year column so the tax and expand/collapse columns receive more available horizontal space

#### Scenario: Crash indicator remains visible

- **WHEN** a crash year appears in the mobile breakdown table
- **THEN** the Year column still identifies the row as a crash year and displays the effective crash depth in a readable compact form

#### Scenario: Desktop table remains readable

- **WHEN** the application is viewed on a wide screen
- **THEN** the Year column remains readable and the breakdown table preserves its desktop columns and row expansion behavior