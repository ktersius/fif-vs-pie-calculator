## ADDED Requirements

### Requirement: Calculator Mode Simulation Selection

The system SHALL provide deterministic simulation results for both `PIE vs US ETF` and `US ETF vs Irish ETF` modes. The existing PIE-vs-US calculations SHALL remain the default and SHALL retain their current behavior.

#### Scenario: Existing mode remains default

- **WHEN** the application first loads
- **THEN** it runs the existing PIE-vs-US simulation with the existing default inputs

#### Scenario: ETF domicile mode selects its runner

- **WHEN** the investor selects US-vs-Irish mode
- **THEN** the application runs the US-domiciled and Irish-domiciled ETF simulations over the same selected historical window

#### Scenario: Same inputs remain deterministic

- **WHEN** either mode runs twice with identical inputs
- **THEN** its annual records and aggregate results are identical

### Requirement: US-vs-Irish FX and Brokerage Fees

The US-vs-Irish mode SHALL apply the selected IBKR FX conversion method and the destination exchange brokerage to every initial, periodic, and exit order.

- Auto FX conversion fee = 0.03% of the NZD order amount.
- Manual FX conversion fee = max(0.002% of converted USD, USD 2), converted to NZD and capped at the gross order amount.
- US ETF brokerage = the existing USD 0.35 minimum capped at 1% of trade value.
- Irish ETF LSE brokerage = max(0.05% of trade value, USD 2), capped at the gross order amount.
- Exchange rate = 1 NZD to 0.60 USD.

#### Scenario: Auto FX fee

- **WHEN** NZD 10,000 is converted at 0.60 USD per NZD using auto conversion
- **THEN** the converted amount before fees is USD 6,000 and the FX fee is USD 1.80

#### Scenario: Manual FX minimum

- **WHEN** NZD 10,000 is converted at 0.60 USD per NZD using manual conversion
- **THEN** the percentage commission is below USD 2 and the FX fee is USD 2

#### Scenario: US brokerage minimum

- **WHEN** a US ETF order is large enough that 1% of trade value exceeds USD 0.35
- **THEN** the modeled US brokerage fee is USD 0.35

#### Scenario: LSE percentage fee

- **WHEN** an Irish ETF order has a USD 6,000 trade value
- **THEN** the modeled LSE brokerage fee is USD 3

#### Scenario: Fees cannot create a negative order

- **WHEN** an order is smaller than an applicable fixed minimum
- **THEN** total order fees are capped at its gross amount and its net invested amount is zero

### Requirement: US-vs-Irish Annual Balance Expansion

The system SHALL expand both ETF balances annually from the same opening balance, net annual contribution, historical price return, and historical gross dividend return.

For the US-domiciled ETF:

1. Add the net contribution.
2. Apply historical price growth.
3. Calculate the gross external dividend.
4. Withhold 15% and reinvest the net dividend.
5. Deduct the 0.03% annual expense ratio.
6. Deduct US-domiciled ETF FIF tax.

For the Irish-domiciled ETF:

1. Add the net contribution.
2. Apply historical price growth.
3. Calculate the gross internal dividend.
4. Deduct 15% internal withholding and retain the net dividend in the fund.
5. Deduct the 0.07% annual expense ratio.
6. Deduct Irish-domiciled ETF FIF tax.

The full net annual contribution SHALL participate in the full historical year's return, matching the existing timing approximation.

#### Scenario: Both ETFs use the same market history

- **WHEN** a selected calendar year has price return p and dividend return d
- **THEN** both ETF simulations use p and d for that corresponding simulation year

#### Scenario: US dividend is externally distributed

- **WHEN** the US ETF earns a gross historical dividend
- **THEN** the annual record shows the gross external dividend, investor-level withholding, and net reinvested dividend

#### Scenario: Irish dividend accumulates internally

- **WHEN** the Irish ETF earns a gross historical dividend
- **THEN** the annual record shows its internal withholding and net accumulated dividend
- **AND** records zero external dividend

#### Scenario: Expense ratios differ

- **WHEN** annual management expenses are calculated
- **THEN** the US ETF uses 0.03% and the Irish ETF uses 0.07%

### Requirement: Ordinary and Inherited Terminal Results

The US-vs-Irish simulation SHALL produce both ordinary final balances and inherited-wealth balances.

- Ordinary final balance SHALL apply the selected FX conversion fee and destination brokerage to liquidation at the horizon.
- Inherited wealth SHALL be calculated from the terminal pre-exit holding value.
- The inherited US ETF value SHALL deduct US estate tax.
- The inherited Irish ETF value SHALL not deduct US estate tax.

#### Scenario: Ordinary result includes liquidation fees

- **WHEN** the simulation reaches the horizon
- **THEN** each ordinary final balance reflects its applicable exit FX and brokerage fees

#### Scenario: Inherited result uses pre-exit value

- **WHEN** inherited wealth is calculated
- **THEN** estate tax is calculated from the terminal holding before ordinary liquidation fees

#### Scenario: Estate tax is not compounded annually

- **WHEN** a multi-year simulation runs
- **THEN** estate tax appears only in the inherited-wealth result and is not deducted from any annual closing balance
