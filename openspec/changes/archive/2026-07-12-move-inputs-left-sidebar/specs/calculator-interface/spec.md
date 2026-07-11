## ADDED Requirements

### Requirement: Responsive Calculator Layout
The system SHALL present the investor input control panel in a left sidebar alongside the calculator outputs on wider screens, while preserving a single-column controls-first layout on smaller screens.

#### Scenario: Desktop layout shows inputs beside outputs
- **WHEN** the application is viewed on a wide screen
- **THEN** the control panel is displayed in a left column and the summary, charts, and year-by-year breakdown are displayed in a right content column

#### Scenario: Mobile layout remains stacked
- **WHEN** the application is viewed on a small screen
- **THEN** the control panel is displayed before the output sections in a single-column layout

#### Scenario: Control panel remains readable in sidebar
- **WHEN** the control panel is displayed in the left sidebar
- **THEN** its inputs remain full-width within the sidebar so labels, sliders, dropdowns, and hints are readable
