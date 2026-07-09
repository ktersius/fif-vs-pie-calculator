## ADDED Requirements

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

### Requirement: Annual Balance Expansion

The system SHALL expand each portfolio's balance every year by applying contributions, market growth, dividends, withholding tax, and the management fee before taxation.

Order of operations per year:
1. Opening Balance = previous year's closing balance.
2. Temporary Balance = Opening Balance + Net Annual Contribution.
3. Growth = Temporary Balance × Market Return (or −15% in a crash year).
4. Gross Dividends = Temporary Balance × Dividend Yield.
5. Net Dividends = Gross Dividends × (1 − 0.15 withholding tax).
6. Temporary Balance = Temporary Balance + Growth + Net Dividends.
7. Fee = Temporary Balance × 0.0003; Temporary Balance = Temporary Balance − Fee.
8. Deduct Net Tax Owed (per the taxation capability) to produce the Closing Balance.

#### Scenario: Positive market year expansion

- **WHEN** a non-crash year is simulated with a positive market return
- **THEN** growth, net dividends, and the management fee are applied in order before tax is deducted to yield the closing balance

#### Scenario: Growth applied before dividends and fees

- **WHEN** the annual expansion runs
- **THEN** growth and gross dividends are both computed from the Temporary Balance that already includes the net annual contribution

### Requirement: Balance Flooring

The system SHALL floor each portfolio's balance at $0 because the model represents a standard cash account holding ETFs with no margin debt; a portfolio's value cannot fall below zero.

#### Scenario: Closing balance floored at zero

- **WHEN** an extreme multi-crash scenario combined with fees and tax would drive a closing balance below zero
- **THEN** the closing balance is floored at $0 and subsequent years compound from $0 rather than a negative value

### Requirement: Crash Year Modelling

The system SHALL select the configured number of crash years (0 to the lesser of 5 and the investment horizon) out of the simulated years and apply a −15% market return in those years. Crash-year selection SHALL be deterministic: it is derived from an explicit seed and does not change when other simulation inputs change.

- Both portfolios SHALL share the same set of crash years for a given seed.
- A given seed SHALL always reproduce the same set of crash years.
- The set SHALL only change when the seed changes (via re-roll) or when the number of crash years changes.
- Crash years SHALL be selected from Years 1 through the investment horizon H.

#### Scenario: Crash year applies negative return

- **WHEN** a year is designated a crash year
- **THEN** the market growth for that year is computed as Temporary Balance × −0.15 instead of the expected market return

#### Scenario: Crash years distinct and within range

- **WHEN** the number of crash years is configured as N and the horizon is H
- **THEN** exactly N distinct years within Years 1–H are selected as crash years (with N ≤ min(5, H))

#### Scenario: Crash years stable across non-crash input changes

- **WHEN** the investor changes an input other than the number of crash years or the seed (e.g. market return, contribution, tax rate)
- **THEN** the set of crash years remains unchanged and the simulation re-runs with the same crash years

#### Scenario: Same seed reproduces the same crash years

- **WHEN** the simulation is run twice with the same seed and the same number of crash years
- **THEN** the two runs select an identical set of crash years

#### Scenario: Increasing the crash count preserves existing crash years

- **WHEN** the investor increases the number of crash years (e.g. from 3 to 4) without re-rolling
- **THEN** the original crash years are preserved and additional distinct crash years are deterministically added from the current seed (and decreasing the count deterministically removes the most recently added years)

### Requirement: Final Year Exit

The system SHALL apply platform exit fees to each portfolio's final balance at the conclusion of the final year of the investment horizon.

#### Scenario: InvestNow exit fee

- **WHEN** the InvestNow simulation reaches the end of the final horizon year
- **THEN** a 0.50% sell transaction fee is deducted from the final aggregated balance

#### Scenario: IBKR exit fee

- **WHEN** the IBKR simulation reaches the end of the final horizon year
- **THEN** a single FX fee and a single tiered brokerage fee are deducted from the final balance
