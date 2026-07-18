## 1. Shared Calculator Result

- [x] 1.1 Add calculator-mode, FX-mode, platform metadata, inherited-wealth, and discriminated tax-detail types.
- [x] 1.2 Adapt the existing PIE-vs-US simulation result to the shared left/right calculator result contract without changing its numerical output.
- [x] 1.3 Update existing simulation tests to assert the default PIE-vs-US result through the shared contract.

## 2. Domicile Fees and Tax

- [x] 2.1 Add auto/manual FX and LSE brokerage fee helpers using the specified minimums, rates, currency conversion, and order-value caps.
- [x] 2.2 Add focused fee tests for the USD 1.80 auto conversion, USD 2 manual minimum, USD 0.35 US brokerage, USD 3 LSE brokerage, and zero-net tiny order.
- [x] 2.3 Add US-distributing and Irish-accumulating FIF tax calculations with method-specific foreign tax credits and CV floors.
- [x] 2.4 Add progressive nonresident US estate-tax and inherited-wealth calculations, including the USD 300,000 test vector.
- [x] 2.5 Add focused tax tests for the bull-market FDR case, mild-decline domicile difference, FTC cap, negative-price-but-positive-Irish-CV case, and estate-tax scenarios.

## 3. US-vs-Irish Simulation

- [x] 3.1 Implement the US-vs-Irish annual simulation runner using the existing historical window, contribution frequency, annual timing, and balance floor.
- [x] 3.2 Apply route-specific entry, periodic, management, tax, and exit deductions while recording external versus internal dividend details.
- [x] 3.3 Return ordinary final balances and separate inherited-wealth summaries without deducting estate tax from annual records.
- [x] 3.4 Add deterministic simulation tests covering shared market years, different expense ratios, FIF-from-Year-1 behavior, selected FX mode, and terminal results.

## 4. Calculator Selection and Inputs

- [x] 4.1 Add the native radio-group calculator selector with PIE-vs-US selected by default.
- [x] 4.2 Select and memoise the active simulation runner in the application shell while preserving input values across mode changes.
- [x] 4.3 Show PIE PIR only in PIE-vs-US mode and FX conversion only in US-vs-Irish mode, including the explicit FIF assumption text.

## 5. Shared Results Interface

- [x] 5.1 Update the page heading, summary dashboard, balance chart, and tax-drag chart to use active platform metadata instead of hard-coded InvestNow and IBKR labels.
- [x] 5.2 Add the US-vs-Irish inherited-wealth and estate-tax summary while leaving it absent from PIE-vs-US mode.
- [x] 5.3 Update the year-by-year table and mobile columns to use active platform labels and records.
- [x] 5.4 Add US-distributing and Irish-accumulating tax and fee breakdown panels using the discriminated tax detail.
- [x] 5.5 Add interface tests for default mode, keyboard-accessible switching, conditional controls, preserved inputs, active labels, and inherited-wealth visibility.

## 6. Verification

- [x] 6.1 Run the targeted fee, tax, simulation, and interface tests and correct any regressions.
- [x] 6.2 Run the existing project build and full test suite to confirm the original calculator remains unchanged.
