## 1. Historical Market Data

- [ ] 1.1 Verify and transcribe SlickCharts annual S&P 500 price and dividend returns for every completed year from 1957 through 2025, recording the source and retrieval/update date.
- [ ] 1.2 Add the typed in-repository historical market data module with earliest/latest year metadata and no runtime data dependency.
- [ ] 1.3 Add focused tests that reject missing, duplicate, unordered, partial, or malformed historical year records.
- [ ] 1.4 Implement and test a helper that clamps an end year and returns exactly H contiguous historical records for a requested horizon.

## 2. Simulation Model

- [ ] 2.1 Replace market return, dividend yield, and all crash-related `SimulationInputs` fields with `historicalEndYear`, updating defaults to the latest completed dataset year.
- [ ] 2.2 Replace crash metadata in annual records/results with calendar year, price return, dividend return, and selected historical period metadata.
- [ ] 2.3 Update both portfolio simulation loops to apply the mapped historical price and dividend returns through the existing annual contribution, fee, withholding-tax, and taxation order.
- [ ] 2.4 Update simulation and tax tests for contiguous calendar-year mapping, deterministic replay, positive and negative historical years, gross historical dividends, CV/FDR selection, and balance flooring.
- [ ] 2.5 Add a regression test documenting that the existing full-year contribution exposure approximation remains unchanged.

## 3. Historical Period Controls

- [ ] 3.1 Update `App` state handling so horizon changes preserve the selected historical end year when valid and otherwise clamp it to the nearest complete window.
- [ ] 3.2 Remove expected-return, dividend-yield, crash-count, crash-severity, re-roll, and override controls from the control panel.
- [ ] 3.3 Add the native historical end-year range slider with dynamic bounds, the derived start year on the left, and the selected end year on the right, defaulting to the latest complete window.
- [ ] 3.4 Add a compact historical-period and SlickCharts attribution line above the summary results.

## 4. Historical Results Presentation

- [ ] 4.1 Change balance-chart data and the X-axis to calendar years, remove crash markers/popovers, and show calendar year, portfolio year, price return, and balances in the tooltip.
- [ ] 4.2 Change the tax-drag chart to use calendar-year labels while preserving click-through to the corresponding breakdown row.
- [ ] 4.3 Update the year-by-year breakdown to show calendar year as the primary label, portfolio year as secondary context, and read-only price/dividend returns.
- [ ] 4.4 Adjust compact and expanded mobile breakdown layouts so historical return detail remains readable without the removed crash controls.

## 5. Crash Feature Removal

- [ ] 5.1 Delete the seeded crash-selection/depth utility, its tests, crash constants/defaults, and the shared crash-depth component.
- [ ] 5.2 Remove crash override handlers, props, imports, record fields, labels, styles, and other dead code across the application.
- [ ] 5.3 Remove GoatCounter re-roll and crash-depth events without adding analytics for historical-period changes.
- [ ] 5.4 Confirm no user-facing crash, severity, re-roll, override, expected-return, or dividend-yield controls remain.

## 6. Documentation and Validation

- [ ] 6.1 Update the README to describe historical replay, data attribution, completed-year updates, and the annual contribution timing limitation.
- [ ] 6.2 Replace the hybrid two-state SVG in `mockups/historical-controls-mockup.svg` with the final historical-only control-panel mockup.
- [ ] 6.3 Run the targeted historical-data, simulation, and tax tests, then run the existing full test suite and production build.
- [ ] 6.4 Validate the OpenSpec change and review the final diff for obsolete crash terminology or unintended affected behavior.
