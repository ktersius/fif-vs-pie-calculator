## ADDED Requirements

### Requirement: Historical Annual Return Sequence

The system SHALL use the selected contiguous historical market window as the sole source of annual price growth and gross dividend income for both portfolios.

Each simulation year SHALL record its calendar year, applied price return, and applied dividend return. The simulation SHALL NOT generate, re-roll, or manually override annual market returns.

#### Scenario: Historical returns are applied

- **WHEN** a selected calendar year has price return p and dividend return d
- **THEN** both portfolios use p for market growth and d for gross dividend income in the corresponding simulation year

#### Scenario: Negative historical return is preserved

- **WHEN** a selected calendar year has a negative price return
- **THEN** that negative return is applied directly without a synthetic crash depth or floor

#### Scenario: Simulation is deterministic

- **WHEN** the simulation runs twice with identical financial inputs, horizon, and historical end year
- **THEN** both runs produce the same calendar-year mapping and annual market returns

## MODIFIED Requirements

### Requirement: Annual Balance Expansion

The system SHALL expand each portfolio's balance every year by applying contributions, historical price growth, historical dividends, withholding tax, and the management fee before taxation.

Order of operations per year:
1. Opening Balance = previous year's closing balance.
2. Temporary Balance = Opening Balance + Net Annual Contribution.
3. Growth = Temporary Balance x Historical Price Return for the mapped calendar year.
4. Gross Dividends = Temporary Balance x Historical Dividend Return for the mapped calendar year.
5. Net Dividends = Gross Dividends x (1 - 0.15 withholding tax).
6. Temporary Balance = Temporary Balance + Growth + Net Dividends.
7. Fee = Temporary Balance x 0.0003; Temporary Balance = Temporary Balance - Fee.
8. Deduct Net Tax Owed (per the taxation capability) to produce the Closing Balance.

The existing annual timing approximation SHALL remain: the full net annual contribution participates in the full mapped calendar year's price and dividend returns.

#### Scenario: Positive historical year expansion

- **WHEN** a mapped calendar year has a positive price return
- **THEN** historical growth, historical dividends, and the management fee are applied in order before tax is deducted to yield the closing balance

#### Scenario: Negative historical year expansion

- **WHEN** a mapped calendar year has a negative price return
- **THEN** the negative growth and that year's dividend return are applied before fees and tax

#### Scenario: Growth applied before dividends and fees

- **WHEN** the annual expansion runs
- **THEN** growth and gross dividends are both computed from the Temporary Balance that already includes the net annual contribution

#### Scenario: Annual contribution timing remains simplified

- **WHEN** contributions occur weekly, fortnightly, or monthly
- **THEN** their annual net total is treated as present for the full calendar year's return rather than using intra-year historical data

### Requirement: Balance Flooring

The system SHALL floor each portfolio's balance at $0 because the model represents a standard cash account holding ETFs with no margin debt; a portfolio's value cannot fall below zero.

#### Scenario: Closing balance floored at zero

- **WHEN** an extreme historical decline combined with fees and tax would drive a closing balance below zero
- **THEN** the closing balance is floored at $0 and subsequent years compound from $0 rather than a negative value

## REMOVED Requirements

### Requirement: Crash Year Modelling

**Reason**: Synthetic crash selection, severity bands, seeds, and overrides are replaced by contiguous historical annual returns.

**Migration**: Use the selected historical end year and investment horizon to determine every annual market return.

#### Scenario: Existing crash configuration is removed

- **WHEN** the historical return model is available
- **THEN** the simulation no longer accepts crash count, seed, severity band, or per-year crash override inputs
