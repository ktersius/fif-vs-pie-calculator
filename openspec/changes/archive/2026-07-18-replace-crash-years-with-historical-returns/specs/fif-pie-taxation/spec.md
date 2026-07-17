## MODIFIED Requirements

### Requirement: FIF FDR and CV Method Selection

The system SHALL, when the FIF regime applies, compute both the Fair Dividend Rate (FDR) and Comparative Value (CV) methods and levy the lesser net tax.

- Gross Dividends = Balance x Historical Dividend Return for the mapped calendar year.
- FTC = Gross Dividends x 0.15.
- FDR Method:
  - FDR Income = Opening Balance x 0.05.
  - FDR Gross Tax = FDR Income x Marginal Rate.
  - FDR Net Tax = max(0, FDR Gross Tax - min(FTC, FDR Gross Tax)).
- CV Method:
  - CV Income = max(0, Growth generated in year + Gross Dividends - Management Fee).
  - CV Gross Tax = CV Income x Marginal Rate.
  - CV Net Tax = max(0, CV Gross Tax - min(FTC, CV Gross Tax)).
- The CV calculation SHALL use the GROSS historical dividend (before foreign withholding), not the net reinvested dividend. Treating the reinvested net dividend as a purchase cancels the withholding portion, leaving the gross dividend in the simplified CV Income equation.
- Net Tax Owed = min(FDR Net Tax, CV Net Tax).

#### Scenario: Lesser of the two methods is levied

- **WHEN** the FIF regime applies in a selected historical calendar year
- **THEN** both FDR Net Tax and CV Net Tax are computed and the smaller value is deducted as Net Tax Owed

#### Scenario: CV method advantage in a negative historical year

- **WHEN** the FIF regime applies during a historical calendar year where price growth and dividends produce CV income below FDR income
- **THEN** the resulting Net Tax Owed reflects the CV advantage, including a zero CV income when the statutory floor applies

#### Scenario: FDR net tax never negative

- **WHEN** the foreign tax credit exceeds the FDR gross tax
- **THEN** FDR Net Tax is floored at zero
