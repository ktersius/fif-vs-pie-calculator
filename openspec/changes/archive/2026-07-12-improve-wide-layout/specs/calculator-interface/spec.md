## ADDED Requirements

### Requirement: Wide-Screen Space Utilization
The system SHALL use available horizontal space on large and high-resolution screens so the calculator layout does not feel unnecessarily squeezed in the center of the viewport.

#### Scenario: High-resolution layout expands beyond the default desktop width
- **WHEN** the application is viewed on a high-resolution screen
- **THEN** the page shell uses a wider maximum content area than the standard desktop layout while preserving comfortable outer margins

#### Scenario: Results receive primary horizontal space
- **WHEN** the application is viewed in the desktop sidebar layout
- **THEN** the result column receives the majority of additional horizontal space so charts, summary content, and tables have more room than the control sidebar

#### Scenario: Small-screen layout is unchanged
- **WHEN** the application is viewed on a small screen
- **THEN** the page remains a single-column layout with the control panel before the output sections
