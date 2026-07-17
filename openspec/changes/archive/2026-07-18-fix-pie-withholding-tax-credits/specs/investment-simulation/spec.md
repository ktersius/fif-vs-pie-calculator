## MODIFIED Requirements

### Requirement: Annual Balance Expansion

The system SHALL expand each portfolio's balance every year by applying contributions, historical price growth, historical dividends, withholding tax, the management fee, and net New Zealand tax.

Order of operations per year:
1. Opening Balance = previous year's closing balance.
2. Temporary Balance = Opening Balance + Net Annual Contribution.
3. Growth = Temporary Balance x Historical Price Return for the mapped calendar year.
4. Gross Dividends = Temporary Balance x Historical Dividend Return for the mapped calendar year.
5. US Withholding Tax = Gross Dividends x 0.15.
6. Net Dividends = Gross Dividends - US Withholding Tax.
7. Temporary Balance = Temporary Balance + Growth + Net Dividends.
8. Fee = Temporary Balance x 0.0003; Temporary Balance = Temporary Balance - Fee.
9. Deduct Net Tax Owed per the taxation capability to produce the Closing Balance.

For InvestNow, the same US Withholding Tax removed from Gross Dividends SHALL be available as a foreign tax credit when calculating Net PIE Tax Owed. The withholding SHALL NOT be deducted a second time through gross PIE tax.

The existing annual timing approximation SHALL remain: the full net annual contribution participates in the full mapped calendar year's price and dividend returns.

#### Scenario: Positive historical year expansion

- **WHEN** a mapped calendar year has a positive price return
- **THEN** historical growth, net historical dividends, the management fee, and net tax are applied in order to yield the closing balance

#### Scenario: Negative historical year expansion

- **WHEN** a mapped calendar year has a negative price return
- **THEN** the negative growth and that year's net dividend return are applied before fees and net tax

#### Scenario: Growth applied before dividends and fees

- **WHEN** the annual expansion runs
- **THEN** growth and gross dividends are both computed from the Temporary Balance that already includes the net annual contribution

#### Scenario: InvestNow withholding is credited once

- **WHEN** InvestNow gross dividends incur US withholding tax
- **THEN** only net dividends are reinvested and the same withholding amount reduces Gross PIE Tax subject to the tax-liability cap

#### Scenario: Annual contribution timing remains simplified

- **WHEN** contributions occur weekly, fortnightly, or monthly
- **THEN** their annual net total is treated as present for the full calendar year's return rather than using intra-year historical data
