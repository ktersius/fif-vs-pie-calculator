## 1. Shared PIE-versus-Direct Simulation

- [x] 1.1 Extract a reusable PIE-versus-direct market-path runner while keeping `runSimulation(inputs)` as the unchanged historical-window wrapper.
- [x] 1.2 Add regression coverage proving historical annual records and aggregate results remain unchanged after the extraction.

## 2. Monte Carlo Engine

- [x] 2.1 Add the seeded pseudorandom generator and stationary block-bootstrap path generator using paired local price/dividend records, circular continuation, and four-year mean blocks.
- [x] 2.2 Run 5,000 shared-path PIE/direct scenarios and aggregate win rates, 10th/50th/90th percentiles, tax, fees, value differences, and histogram buckets without retaining full run histories.
- [x] 2.3 Add focused tests for path length, paired observations, continuation/wrapping, deterministic output, shared paths, percentile values, and histogram totals.

## 3. Analysis Method Interface

- [x] 3.1 Add the accessible Historical Backtest versus Monte Carlo Simulation selector, preserve historical comparison state, and update headings and descriptions to distinguish “what happened” from historically conditioned scenarios.
- [x] 3.2 Update control visibility so Historical End Year remains historical-only while Monte Carlo shows PIE inputs and fixed run, seed, and block-length assumptions.
- [x] 3.3 Add accessible Monte Carlo win-rate, percentile, tax, fee, interpretation, and final-value-difference histogram components while keeping historical charts and breakdowns out of Monte Carlo.
- [x] 3.4 Add interface tests for default historical behavior, method switching, preserved values, conditional controls, Monte Carlo labels, and absence of single-path components.

## 4. Documentation and Verification

- [x] 4.1 Document Historical Backtest and Monte Carlo assumptions, outputs, and interpretation limits.
- [x] 4.2 Run targeted Monte Carlo and interface tests, then run the existing build and full test suite.
