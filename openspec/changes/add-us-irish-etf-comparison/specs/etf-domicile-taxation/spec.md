## ADDED Requirements

### Requirement: FIF Regime Assumption

The US-vs-Irish ETF calculator SHALL apply the New Zealand FIF regime in every simulated year to both compared portfolios. It SHALL NOT infer the investor's aggregate FIF de minimis status from the cost of either simulated holding.

#### Scenario: FIF applies from the first year

- **WHEN** the US-vs-Irish comparison runs with any initial investment
- **THEN** both portfolios calculate FDR and CV income in Year 1 without applying a dividend-only de minimis branch

#### Scenario: Assumption is explicit

- **WHEN** the US-vs-Irish mode is displayed
- **THEN** the interface states that the comparison assumes the investor is subject to FIF

### Requirement: US-Domiciled Distributing ETF FIF Tax

The system SHALL model the US-domiciled ETF as a distributing FIF that pays its gross dividend to the investor, withholds 15%, and reinvests the remaining dividend.

- FDR Income = Opening Balance x 0.05.
- CV Income = max(0, Price Growth + Gross External Dividend - Management Fee).
- Foreign Tax Credit = Gross External Dividend x 0.15, capped separately at the gross New Zealand tax under each method.
- FDR Net Tax = max(0, FDR Income x Marginal Rate - applicable Foreign Tax Credit).
- CV Net Tax = max(0, CV Income x Marginal Rate - applicable Foreign Tax Credit).
- Net Tax Owed = min(FDR Net Tax, CV Net Tax).

#### Scenario: Bull market selects FDR

- **WHEN** the opening balance is NZD 100,000, price growth is 10%, gross external dividend yield is 1.5%, and management fees are ignored for the test vector
- **THEN** FDR Income is NZD 5,000 and CV Income is NZD 11,500
- **AND** FDR produces the selected net tax

#### Scenario: Mild decline retains distributing CV income

- **WHEN** price growth is -1.4% and the gross external dividend yield is 1.5%
- **THEN** the US ETF CV calculation includes the gross external dividend and produces positive CV income before other applicable fees

#### Scenario: Foreign tax credit is capped

- **WHEN** withholding tax exceeds the gross New Zealand tax calculated under a FIF method
- **THEN** the credit applied to that method equals its gross New Zealand tax and its net tax is zero
- **AND** the unused credit is not refunded or carried forward

### Requirement: Irish-Domiciled Accumulating ETF FIF Tax

The system SHALL model the Irish-domiciled ETF as an accumulating FIF. Gross index dividends SHALL incur 15% withholding inside the fund, and the remaining dividend SHALL increase the ETF holding value without an external distribution to the investor.

- External Dividend = 0.
- Investor-Level Foreign Tax Credit = 0.
- FDR Income = Opening Balance x 0.05.
- CV Income = max(0, Price Growth + Gross Internal Dividend x 0.85 - Management Fee).
- FDR Net Tax = FDR Income x Marginal Rate.
- CV Net Tax = CV Income x Marginal Rate.
- Net Tax Owed = min(FDR Net Tax, CV Net Tax).

#### Scenario: Accumulating ETF has no investor credit

- **WHEN** the Irish ETF receives index dividends internally
- **THEN** 15% internal withholding reduces the amount accumulated in its holding value
- **AND** external dividends and the investor's foreign tax credit are both zero

#### Scenario: Mild decline floors CV income

- **WHEN** price growth is -1.4%, gross internal dividend yield is 1.5%, and management fees are ignored for the test vector
- **THEN** the net unit-value change is -0.125%
- **AND** CV Income and CV Net Tax are both zero

#### Scenario: Negative price return does not always mean zero CV

- **WHEN** a negative price return is smaller than the net internally accumulated dividend return after management fees
- **THEN** the Irish ETF has positive CV income despite the negative price-only return

### Requirement: US Estate Tax Inherited-Wealth Scenario

The system SHALL calculate an illustrative inherited-wealth result from the terminal pre-exit holding value without changing the ordinary final balance.

For the US-domiciled ETF:

- Convert the terminal US-situs holding value to USD.
- Calculate tentative estate tax using the progressive schedule in 26 USC 2001(c).
- Subtract the USD 13,000 unified credit available to a nonresident noncitizen, flooring estate tax at zero.
- Inherited Wealth = Terminal Holding Value - Estate Tax.

For the Irish-domiciled ETF, US Estate Tax SHALL equal zero because the holding is not US-situs.

#### Scenario: US holding below filing threshold

- **WHEN** the terminal US-domiciled ETF value is USD 60,000 or less
- **THEN** the calculated US estate tax is zero

#### Scenario: Progressive tax applies to USD 300,000

- **WHEN** the terminal US-domiciled ETF value is USD 300,000 with no modeled deductions or adjusted taxable gifts
- **THEN** tentative tax is USD 87,800
- **AND** the USD 13,000 unified credit reduces estate tax to USD 74,800
- **AND** inherited wealth is USD 225,200

#### Scenario: Irish ETF has no US estate tax

- **WHEN** the terminal Irish-domiciled ETF value is USD 300,000
- **THEN** US estate tax is zero and inherited wealth remains USD 300,000

#### Scenario: Estate scenario does not alter investment results

- **WHEN** inherited wealth is calculated
- **THEN** annual balances, ordinary final balance, total fees, and total New Zealand tax remain unchanged
