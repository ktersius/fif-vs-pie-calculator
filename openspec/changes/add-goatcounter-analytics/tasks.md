## 1. Analytics Configuration

- [x] 1.1 Add a configurable GoatCounter endpoint using `VITE_GOATCOUNTER_ENDPOINT`, with production configured for `https://ktersius.goatcounter.com/count`.
- [x] 1.2 Load the GoatCounter script only when the endpoint is configured, while keeping the app functional when it is absent.

## 2. Event Tracking Helper

- [x] 2.1 Add a small analytics helper that wraps `window.goatcounter.count(...)` and no-ops when GoatCounter is unavailable.
- [x] 2.2 Define an allowlist of supported anonymous event paths for the initial calculator interactions.

## 3. Calculator Interaction Events

- [x] 3.1 Track `/event/reroll-crash-years` when the re-roll crash years control is activated.
- [x] 3.2 Track `/event/adjust-crash-depth` when a crash depth override changes.
- [x] 3.3 Track `/event/expand-year-breakdown` when a year breakdown row is expanded.
- [x] 3.4 Track `/event/click-tax-chart-year` when a tax chart year is selected.

## 4. Documentation and Verification

- [x] 4.1 Document `VITE_GOATCOUNTER_ENDPOINT=https://ktersius.goatcounter.com/count` and the fact that analytics excludes financial inputs and calculation outputs.
- [x] 4.2 Run the production build with no GoatCounter endpoint configured to confirm analytics is optional.
- [x] 4.3 Run the relevant tests or type-check/build validation after adding analytics.
