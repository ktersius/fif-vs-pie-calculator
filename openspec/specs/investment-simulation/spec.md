# investment-simulation Specification

## Purpose

Defines the deterministic year-by-year simulation engine that projects both the InvestNow PIE portfolio and the IBKR direct-ETF portfolio over a configurable horizon, including fixed economic constants, platform fee structures, contribution handling, a contiguous historical annual return sequence, annual balance expansion, and final-year exit.

## Requirements

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

### Requirement: Constants and Fee Structures

The system SHALL apply fixed economic constants and platform fee structures consistently across the simulation.

- Exchange rate: 1 NZD = 0.60 USD (used to convert USD fixed fees to NZD).
- Underlying ETF management fee: 0.03% annually, applied to both platforms.
- US dividend withholding tax: 15% on gross dividends.
- InvestNow fees: 0.50% buy transaction fee, 0.50% sell transaction fee, 0% FX fee.
- IBKR fees: 0.03% (3 basis points) FX auto-conversion fee on the NZD transaction amount; tiered brokerage fee of USD $0.35 per order, strictly capped at 1% of the trade value, converted to NZD. Because the 1% cap always binds below the $0.35 minimum for small orders, the effective brokerage fee SHALL never exceed 1% of the order value.

#### Scenario: Brokerage fee strictly capped at 1%

- **WHEN** the IBKR brokerage fee is applied to an order whose 1% value is less than USD $0.35
- **THEN** the fee is capped at 1% of the order value (converted to NZD), not the USD $0.35 minimum

#### Scenario: Brokerage minimum applies to large orders

- **WHEN** the IBKR brokerage fee is applied to an order whose 1% value exceeds USD $0.35
- **THEN** the fee is USD $0.35 converted to NZD using the 1 NZD = 0.60 USD exchange rate (USD $0.35 / 0.60 ≈ NZD $0.583)

#### Scenario: Management fee applies to both platforms

- **WHEN** the annual management fee is computed for either portfolio
- **THEN** it equals 0.03% of the pre-tax balance for that year

### Requirement: Simulation Horizon

The system SHALL run the simulation over a configurable investment horizon of H years (1 to 50, default 20), producing records for Year 0 (initial state) through Year H.

#### Scenario: Default horizon

- **WHEN** the investment horizon is not changed by the investor
- **THEN** the simulation runs for 20 years, producing records for Year 0 through Year 20

#### Scenario: Custom horizon

- **WHEN** the investor sets the investment horizon to H years
- **THEN** the simulation loops Years 1 through H and produces H + 1 yearly records (Year 0 through Year H)

### Requirement: Portfolio Initialisation

The system SHALL initialise each portfolio's Year 0 balance from the initial investment after deducting the respective platform entry fees.

#### Scenario: InvestNow initial investment entry fee

- **WHEN** the InvestNow portfolio is initialised with the initial investment
- **THEN** the 0.50% buy transaction fee is deducted before the amount becomes the Year 0 balance

#### Scenario: IBKR initial investment entry fees

- **WHEN** the IBKR portfolio is initialised with the initial investment
- **THEN** the 0.03% FX fee and the tiered brokerage fee (USD $0.35 per order, strictly capped at 1% of the order value, converted to NZD) are deducted before the amount becomes the Year 0 balance

### Requirement: Periodic Contributions

The system SHALL convert the periodic contribution and frequency into an annual contribution stream and apply platform fees to that stream each year.

- Contribution frequency options: Weekly (52/year), Fortnightly (26/year), Monthly (12/year), Annually (1/year).
- InvestNow: Net Annual Contribution = Total Annual Contribution × (1 − 0.005).
- IBKR: each individual contribution instance has the 0.03% FX fee and the tiered brokerage fee (USD $0.35 strictly capped at 1% of the instance value) deducted, and the net amounts are summed for the Net Annual Contribution. Because the brokerage fee is capped at 1% and the FX fee is 0.03%, the combined fees can never exceed a small fraction of an instance, so a net instance amount is always positive.

#### Scenario: InvestNow annual contribution fee

- **WHEN** the InvestNow net annual contribution is computed
- **THEN** the total annual contribution is reduced by the 0.50% buy fee in aggregate

#### Scenario: IBKR per-contribution fee application

- **WHEN** the contribution frequency is Weekly with 52 contributions per year
- **THEN** the FX fee and the 1%-capped brokerage fee are deducted from each of the 52 contribution instances individually before summing the net amounts

#### Scenario: Brokerage cap prevents fees exceeding a contribution

- **WHEN** a single IBKR contribution instance is very small
- **THEN** the 1% brokerage cap and 0.03% FX fee together take at most ~1.03% of the instance, so the net contributed amount remains positive and the fee never consumes the whole instance

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

### Requirement: Balance Flooring

The system SHALL floor each portfolio's balance at $0 because the model represents a standard cash account holding ETFs with no margin debt; a portfolio's value cannot fall below zero.

#### Scenario: Closing balance floored at zero

- **WHEN** an extreme historical decline combined with fees and tax would drive a closing balance below zero
- **THEN** the closing balance is floored at $0 and subsequent years compound from $0 rather than a negative value

### Requirement: Final Year Exit

The system SHALL apply platform exit fees to each portfolio's final balance at the conclusion of the final year of the investment horizon.

#### Scenario: InvestNow exit fee

- **WHEN** the InvestNow simulation reaches the end of the final horizon year
- **THEN** a 0.50% sell transaction fee is deducted from the final aggregated balance

#### Scenario: IBKR exit fee

- **WHEN** the IBKR simulation reaches the end of the final horizon year
- **THEN** a single FX fee and a single tiered brokerage fee are deducted from the final balance
