# Tax model

This calculator is an illustrative annual model, not tax advice. Rates and formulas are fixed assumptions chosen to compare an InvestNow Foundation Series PIE fund with a directly held US ETF.

## Annual market flow

For both portfolios:

```text
Base = Opening Balance + Net Annual Contribution
Price Growth = Base x Historical Price Return
Gross Dividends = Base x Historical Dividend Return
US Withholding Tax = Gross Dividends x 15%
Net Dividends = Gross Dividends - US Withholding Tax
Management Fee = (Base + Price Growth + Net Dividends) x 0.03%
```

The full annual contribution receives the full calendar year's return. This is a deliberate timing approximation.

## InvestNow PIE tax

The Foundation Series US 500 Fund is modelled as an unlisted multi-rate PIE using FDR income and attributed foreign tax credits:

```text
FDR Taxable Income = Opening Balance x 5%
Gross PIE Tax = FDR Taxable Income x PIR
Foreign Tax Credit = min(US Withholding Tax, Gross PIE Tax)
Net PIE Tax = Gross PIE Tax - Foreign Tax Credit
```

Only net dividends are reinvested, because US withholding has already left the fund. Only Net PIE Tax is then deducted from the portfolio and included in total NZ tax. Unused foreign tax credits are not refunded.

## IBKR tax

The direct ETF portfolio tracks cumulative net acquisition cost separately from market value.

- While FIF-exempt, NZ tax is calculated on gross dividends with a credit for US withholding.
- Under FIF, both FDR and CV net tax are calculated and the lesser is deducted.
- FDR uses 5% of opening market value.
- CV uses annual price growth plus gross dividends less the management fee, floored at zero.

### Known de minimis assumption

The calculator currently uses a $100,000 FIF cost threshold. InvestNow's guide describes $50,000 for an individual and an effective $100,000 threshold when investments are held equally by two joint investors. The calculator does not currently expose ownership type, so this remains a known model assumption outside the PIE withholding-credit correction.

## Worked 1991 PIE example

Inputs:

- Initial investment: $220,000
- Weekly contribution: $1,000
- PIR: 28%
- Historical price return: 26.3067%
- Historical dividend return: 4.1633%

Year 0 applies the 0.50% entry fee, leaving a Year 1 opening balance of $218,900.

```text
Net annual contribution = ($1,000 x 52) - $260       = $51,740.00
Base = $218,900 + $51,740                            = $270,640.00
Gross dividends = $270,640 x 4.1633%                 = $11,267.56
US withholding tax = $11,267.56 x 15%                = $1,690.13
Net dividends                                         = $9,577.42

FDR taxable income = $218,900 x 5%                   = $10,945.00
Gross PIE tax = $10,945 x 28%                        = $3,064.60
Foreign tax credit                                    = $1,690.13
Net PIE tax                                           = $1,374.47
```

The regression check for this example is in `src/lib/simulation.test.ts`.

## Sources

Accessed 18 July 2026.

| Source | Relevant material |
| --- | --- |
| [IRD: Guide to foreign investment funds (IR461)](https://www.ird.govt.nz/-/media/project/ir/home/documents/forms-and-guides/ir400---ir499/ir461/ir461.pdf?modified=20260331214052) | FDR on page 14; foreign tax credits on page 20 |
| [IRD: Portfolio Investment Entity Guide (IR860)](https://www.ird.govt.nz/-/media/project/ir/home/documents/forms-and-guides/ir800---ir899/ir860/ir860.pdf?modified=20250331194349) | Foreign tax-credit attribution and limits on pages 34-36 and 53-54 |
| [InvestNow Investor Tax Guide 2025](https://cdn.investnow.co.nz/20250520163210/InvestNow-Investor-Tax-Guide-2025.2.pdf) | Unlisted PIE tax less attributed credits on page 4; FIF and foreign-credit guidance on pages 6-7 |
| [Foundation Series core equity PDS](https://cdn.investnow.co.nz/20240129152801/Foundation_Series_Funds_-_Core_Equity_PDS_-_22_January_2024.pdf) | PIE status, PIR taxation, management fees, and transaction fees |
| [InvestNow: Getting to know the new Foundation Series Funds](https://investnow.co.nz/article-foundation-series-funds/) | Fund structure and withholding-tax slippage; updated 16 January 2026 |
| [SlickCharts: S&P 500 return details](https://www.slickcharts.com/sp500/returns/details) | Annual price and dividend return dataset |

Third-party PDFs are linked rather than copied into the repository so the source, version, and publisher remain clear.
