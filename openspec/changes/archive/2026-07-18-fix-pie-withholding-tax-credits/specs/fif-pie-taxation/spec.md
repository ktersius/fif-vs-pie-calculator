## MODIFIED Requirements

### Requirement: PIE Fund FDR Taxation

The system SHALL tax the InvestNow PIE portfolio annually under the Fair Dividend Rate (FDR) structure using the investor's Prescribed Investor Rate (PIR), while applying US dividend withholding tax as an attributed foreign tax credit.

- Taxable Income = Opening Balance of the year x 0.05.
- Gross PIE Tax = Taxable Income x PIR.
- US Withholding Tax = Gross Dividends x 0.15.
- Foreign Tax Credit = min(US Withholding Tax, Gross PIE Tax).
- Net PIE Tax Owed = Gross PIE Tax - Foreign Tax Credit.
- Net PIE Tax Owed SHALL NOT be negative and unused foreign tax credits SHALL NOT be refunded.
- PIE FDR tax is calculated even when the market return for the year is negative.

#### Scenario: PIE tax applies the withholding credit

- **WHEN** the InvestNow portfolio receives a gross historical dividend and its US withholding tax is less than Gross PIE Tax
- **THEN** Net PIE Tax Owed equals Gross PIE Tax minus the full US withholding tax credit

#### Scenario: PIE foreign tax credit is capped

- **WHEN** US withholding tax exceeds Gross PIE Tax
- **THEN** the applied Foreign Tax Credit equals Gross PIE Tax and Net PIE Tax Owed is zero

#### Scenario: PIE tax is calculated in a negative year

- **WHEN** the InvestNow portfolio experiences a historical year with a negative price return
- **THEN** Gross PIE Tax is still calculated from Opening Balance and PIR before the available withholding credit is applied
