## ADDED Requirements

### Requirement: PIE Fund FDR Taxation

The system SHALL tax the InvestNow PIE portfolio annually under the Fair Dividend Rate (FDR) structure using the investor's Prescribed Investor Rate (PIR).

- Taxable Income = Opening Balance of the year × 0.05.
- PIE Tax Owed = Taxable Income × PIR.
- PIE tax is levied even when the market return for the year is negative.
- US withholding tax is handled internally by the fund and is not separately modelled; the simulation deducts only the PIE Tax Owed.

#### Scenario: PIE tax in a positive year

- **WHEN** the InvestNow portfolio has a positive-return year
- **THEN** PIE Tax Owed equals (Opening Balance × 0.05) × PIR and is deducted from the pre-tax balance

#### Scenario: PIE tax levied in a crash year

- **WHEN** the InvestNow portfolio experiences a crash year with a negative market return
- **THEN** PIE Tax Owed is still calculated as (Opening Balance × 0.05) × PIR and deducted

### Requirement: FIF De Minimis Threshold

The system SHALL track the IBKR portfolio's NZD cost base and apply the $100,000 NZD de minimis threshold to determine whether the FIF regime applies for a given tax year.

- Cost Base = Cumulative Net Contributions + Cumulative Net Reinvested Dividends.
- Cost base is measured strictly against the total NZD cost of the investments and SHALL exclude unrealised market growth. A portfolio bought for $90,000 that grows to $150,000 remains FIF-exempt provided no new capital pushes the cost base over $100,000.
- Reinvested dividends added to the cost base SHALL be the net (post-15%-withholding) cash actually used to acquire shares.
- The threshold is tested continuously: if the cost base exceeds $100,000 NZD on any day during the tax year, the FIF regime applies for the entire year. Because the cost base is monotonically non-decreasing (contributions and reinvested dividends only add to it, with no withdrawals), the year's maximum cost base equals its end-of-year cost base, so the end-of-year cost base (including that year's contributions and reinvested dividends) SHALL be used for the test.
- If the year's cost base never exceeds $100,000 NZD: the portfolio is exempt from FIF for that year and taxed on dividends only.
- If the year's cost base exceeds $100,000 NZD at any point: the FIF regime applies for that year.

#### Scenario: Unrealised growth does not breach the threshold

- **WHEN** the IBKR cost base is $90,000 but market growth lifts the balance to $150,000 and no further capital is added
- **THEN** the portfolio remains FIF-exempt because the cost base has not exceeded $100,000

#### Scenario: First contribution breaches the threshold in Year 1

- **WHEN** the initial investment is exactly $100,000 and the first periodic contribution is added during Year 1
- **THEN** the cost base exceeds $100,000 during Year 1 and the FIF regime applies for the entire Year 1

#### Scenario: Cost base at or below threshold is FIF-exempt

- **WHEN** the IBKR year-end cost base is $100,000 NZD or less
- **THEN** the FIF regime does not apply for that year and dividend-only taxation is used

#### Scenario: Cost base above threshold triggers FIF

- **WHEN** the IBKR cost base exceeds $100,000 NZD during the year
- **THEN** the FIF regime applies for that year and the lesser of the FDR and CV methods is used

### Requirement: FIF-Exempt Dividend Taxation

The system SHALL tax the IBKR portfolio on dividends only while it remains under the de minimis threshold, granting a foreign tax credit for withholding tax.

- NZ Gross Tax = Gross Dividends × Marginal Rate.
- Foreign Tax Credit (FTC) = min(Gross Dividends × 0.15, NZ Gross Tax).
- Net Tax Owed = NZ Gross Tax − FTC.

#### Scenario: Dividend-only tax with full credit

- **WHEN** the IBKR portfolio is FIF-exempt and the 15% withholding credit is less than the NZ gross tax
- **THEN** Net Tax Owed = (Gross Dividends × Marginal Rate) − (Gross Dividends × 0.15)

#### Scenario: Foreign tax credit capped at NZ liability

- **WHEN** the withholding credit (Gross Dividends × 0.15) exceeds the NZ Gross Tax
- **THEN** the FTC is capped at the NZ Gross Tax and Net Tax Owed is zero (never negative)

### Requirement: FIF FDR and CV Method Selection

The system SHALL, when the FIF regime applies, compute both the Fair Dividend Rate (FDR) and Comparative Value (CV) methods and levy the lesser net tax.

- Gross Dividends = Balance × Dividend Yield.
- FTC = Gross Dividends × 0.15.
- FDR Method:
  - FDR Income = Opening Balance × 0.05.
  - FDR Gross Tax = FDR Income × Marginal Rate.
  - FDR Net Tax = max(0, FDR Gross Tax − min(FTC, FDR Gross Tax)).
- CV Method:
  - CV Income = max(0, Growth generated in year + Gross Dividends − Management Fee).
  - CV Gross Tax = CV Income × Marginal Rate.
  - CV Net Tax = max(0, CV Gross Tax − min(FTC, CV Gross Tax)).
- The CV calculation SHALL use the GROSS dividend (before foreign withholding), not the net reinvested dividend. Treating the reinvested net dividend as a purchase cancels the withholding portion, leaving the gross dividend in the simplified CV Income equation.
- Net Tax Owed = min(FDR Net Tax, CV Net Tax).

#### Scenario: Lesser of the two methods is levied

- **WHEN** the FIF regime applies in a normal positive-return year
- **THEN** both FDR Net Tax and CV Net Tax are computed and the smaller value is deducted as Net Tax Owed

#### Scenario: CV method advantage in a crash year

- **WHEN** the FIF regime applies during a crash year where growth is negative
- **THEN** CV Income is floored at zero, producing zero or lower CV Net Tax, and the resulting Net Tax Owed reflects that advantage over the FDR method

#### Scenario: FDR net tax never negative

- **WHEN** the foreign tax credit exceeds the FDR gross tax
- **THEN** FDR Net Tax is floored at zero
