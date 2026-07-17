# NZ FIF vs PIE Calculator

A web-based calculator for comparing two New Zealand investment approaches:

- an InvestNow Foundation Series PIE fund
- a direct US ETF portfolio held through Interactive Brokers

The app replays historical S&P 500 price and dividend returns while modelling platform fees, dividend withholding tax, and New Zealand tax treatment over a configurable investment horizon. It is intended as an illustrative comparison tool, not financial or tax advice.

## What it compares

The calculator projects both portfolios year by year using the same investment assumptions, then shows how fees and tax rules affect the final outcome.

For the InvestNow PIE scenario, the model applies PIE taxation using the investor's PIR and Fair Dividend Rate-style taxable income.

For the Interactive Brokers scenario, the model tracks the FIF de minimis threshold, dividend-only taxation while exempt, and FDR vs CV method selection once the FIF regime applies.

## Features

- Configurable initial investment, periodic contributions, contribution frequency, investment horizon, historical period, marginal tax rate, and PIR.
- Contiguous historical S&P 500 price and dividend returns from 1957 onward.
- A horizon-locked historical period slider that defaults to the latest completed years.
- Summary dashboard for final balances, total NZ tax paid, and itemised fees.
- Portfolio balance chart comparing both platforms over time.
- Tax drag chart showing annual tax paid by platform.
- Expandable year-by-year breakdown with tax and fee detail.
- Responsive layout with a sidebar control panel on wider screens.

## Running locally

Install dependencies:

```bash
npm ci
```

Start the development server:

```bash
npm run dev
```

Build the production site:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Run tests:

```bash
npm test
```

## Analytics

The deployed site uses GoatCounter for privacy-conscious analytics when `VITE_GOATCOUNTER_ENDPOINT` is configured at build time:

```text
VITE_GOATCOUNTER_ENDPOINT=https://ktersius.goatcounter.com/count
```

Analytics tracks pageviews and a small set of anonymous interaction events, such as expanding a year breakdown and selecting a tax chart year.

The app does not send investment amounts, contribution values, tax rates, balances, calculated results, or per-year simulation values to GoatCounter.

## Historical market data

Annual S&P 500 price and dividend returns are stored in the repository and sourced from [SlickCharts](https://www.slickcharts.com/sp500/returns/details). The dataset begins in 1957 and is updated manually after each calendar year closes; partial-year returns are not used.

The simulation retains its existing annual timing approximation: the full net annual contribution participates in the full calendar year's price and dividend returns, even when the selected contribution frequency is weekly, fortnightly, or monthly.

## Tax model

See [docs/tax-model.md](docs/tax-model.md) for the formulas, assumptions, primary sources, and a worked PIE withholding-credit example.

## Deployment

The app is configured for GitHub Pages project-site hosting at:

```text
https://ktersius.github.io/fif-vs-pie-calculator/
```

Production builds use the Vite base path `/fif-vs-pie-calculator/`, and the GitHub Actions workflow builds the app, uploads the `dist` directory as a Pages artifact, and deploys it with GitHub Pages Actions.

In repository settings, GitHub Pages should use **GitHub Actions** as the deployment source.

## Disclaimer

This calculator is an illustrative model only. It uses fixed assumptions from the project specification and does not provide financial, investment, accounting, or tax advice.
