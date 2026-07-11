# NZ FIF vs PIE Calculator

A web-based calculator for comparing two New Zealand investment approaches:

- an InvestNow Foundation Series PIE fund
- a direct US ETF portfolio held through Interactive Brokers

The app models portfolio growth, platform fees, dividend withholding tax, New Zealand tax treatment, and crash-year scenarios over a configurable investment horizon. It is intended as an illustrative comparison tool, not financial or tax advice.

## What it compares

The calculator projects both portfolios year by year using the same investment assumptions, then shows how fees and tax rules affect the final outcome.

For the InvestNow PIE scenario, the model applies PIE taxation using the investor's PIR and Fair Dividend Rate-style taxable income.

For the Interactive Brokers scenario, the model tracks the FIF de minimis threshold, dividend-only taxation while exempt, and FDR vs CV method selection once the FIF regime applies.

## Features

- Configurable initial investment, periodic contributions, contribution frequency, investment horizon, market return, dividend yield, marginal tax rate, and PIR.
- Deterministic crash-year modelling with re-rollable crash placement.
- Adjustable crash severity band and per-crash manual overrides.
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

Analytics tracks pageviews and a small set of anonymous interaction events, such as re-rolling crash years, adjusting crash depth, expanding a year breakdown, and selecting a tax chart year.

The app does not send investment amounts, contribution values, tax rates, balances, calculated results, or per-year simulation values to GoatCounter.

## Deployment

The app is configured for GitHub Pages project-site hosting at:

```text
https://ktersius.github.io/fif-vs-pie-calculator/
```

Production builds use the Vite base path `/fif-vs-pie-calculator/`, and the GitHub Actions workflow builds the app, uploads the `dist` directory as a Pages artifact, and deploys it with GitHub Pages Actions.

In repository settings, GitHub Pages should use **GitHub Actions** as the deployment source.

## Disclaimer

This calculator is an illustrative model only. It uses fixed assumptions from the project specification and does not provide financial, investment, accounting, or tax advice.
