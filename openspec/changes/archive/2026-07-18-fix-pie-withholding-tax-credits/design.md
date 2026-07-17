## Context

The historical dividend return is gross of US withholding tax. Both simulations correctly reinvest 85% of that dividend, but the InvestNow path then deducts gross PIE FDR tax without using the withholding as an attributed foreign tax credit.

InvestNow's tax guide states that unlisted PIE tax is calculated at the investor's PIR less attributed tax credits. IRD's PIE guide IR860 limits foreign tax credits to the investor's PIE tax liability; unused foreign credits may be used within the same tax year but are forfeited rather than refunded.

## Goals / Non-Goals

**Goals:**

- Apply US withholding once in the InvestNow result.
- Make gross PIE tax, applied foreign tax credit, and net PIE tax visible and testable.
- Preserve the existing annual timing approximation and historical dataset.

**Non-Goals:**

- Modelling intra-year PIE calculation periods or carrying credits between quarters.
- Changing IBKR tax calculations or the FIF de minimis threshold.
- Adding tax configuration or provider-specific overrides.

## Decisions

### Reuse the existing gross dividend and withholding rate

`simulateInvestNow` already computes gross and net dividends using `WITHHOLDING_TAX_RATE`. Pass the gross dividend into `pieTax` and reuse the same rate when calculating the available credit. No new withholding helper or configuration is needed.

### Make net PIE tax the deducted amount

Calculate:

```text
Taxable Income = Opening Balance x 5%
Gross PIE Tax = Taxable Income x PIR
US Withholding Tax = Gross Dividends x 15%
Foreign Tax Credit = min(US Withholding Tax, Gross PIE Tax)
Net PIE Tax = Gross PIE Tax - Foreign Tax Credit
```

Only Net PIE Tax is deducted from the portfolio and accumulated in total NZ tax. Net dividends remain gross dividends less withholding tax.

Alternative considered: stop reducing dividends for withholding and retain gross PIE tax. This is equivalent only while withholding is below gross PIE tax and fails for low-PIR or high-dividend years where unused foreign credits are forfeited.

### Extend the existing PIE tax detail

Replace the ambiguous single `taxOwed` figure with gross dividends, withholding tax, gross PIE tax, applied foreign tax credit, and net PIE tax. Reuse the existing tax panel rather than adding another component.

### Keep annual credit calculation

The simulation has annual records, so the credit is capped against that year's gross PIE tax. It will not model carry-forward or carry-back between intra-year PIE calculation periods.

### Keep tax references in one repository document

Add `docs/tax-model.md` containing the calculation order, formulas, assumptions, a worked 1991 example, and a source table with document versions, access dates, and relevant sections. Link it from the README.

Do not commit copies of third-party PDFs. Versioned source URLs preserve provenance without adding stale binaries or redistribution concerns.

Reference sources:

- IRD, *Guide to foreign investment funds (IR461)*, pages 14 and 20: https://www.ird.govt.nz/-/media/project/ir/home/documents/forms-and-guides/ir400---ir499/ir461/ir461.pdf?modified=20260331214052
- IRD, *Portfolio Investment Entity Guide (IR860)*, pages 34-36 and 53-54: https://www.ird.govt.nz/-/media/project/ir/home/documents/forms-and-guides/ir800---ir899/ir860/ir860.pdf?modified=20250331194349
- InvestNow, *Investor Tax Guide 2025*, pages 4 and 6-7: https://cdn.investnow.co.nz/20250520163210/InvestNow-Investor-Tax-Guide-2025.2.pdf
- Foundation Series core equity PDS, section 6: https://cdn.investnow.co.nz/20240129152801/Foundation_Series_Funds_-_Core_Equity_PDS_-_22_January_2024.pdf
- InvestNow, *Getting to know the new Foundation Series Funds*, updated 16 January 2026: https://investnow.co.nz/article-foundation-series-funds/
- SlickCharts S&P 500 historical price and dividend returns: https://www.slickcharts.com/sp500/returns/details

## Risks / Trade-offs

- **Actual PIE administration occurs during the year** -> The annual model preserves the calculator's existing granularity and produces the same annual cap outcome unless timing prevents use of a credit.
- **Provider tax treatment may change** -> Keep the rate in the existing constant and document the source assumptions in the tax specification.
- **Corrected balances will materially increase** -> Add a regression test proving withholding reduces cash dividends and the matching credit reduces PIE tax exactly once.
- **External links may move** -> Record document titles, versions, relevant sections, and the access date so replacements can be found without storing third-party files.

## Migration Plan

Update the tax detail type, calculation, simulation call site, breakdown panel, and focused tests together. Existing saved state is unaffected because tax detail is derived output. Rollback is a normal source revert.

## Open Questions

None.
