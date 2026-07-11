## Why

The GitHub Pages site has no way to understand basic usage after deployment. Adding privacy-conscious analytics will help show whether people are visiting the calculator and which high-level interactions they use, without collecting financial inputs or calculation results.

## What Changes

- Add GoatCounter pageview analytics to the static site.
- Track a small set of anonymous interaction events for calculator usage patterns.
- Avoid sending investment amounts, contribution values, tax rates, balances, or calculated results to analytics.
- Document any required analytics configuration so deployment can be completed without code changes.

## Capabilities

### New Capabilities
- `site-analytics`: Defines privacy-conscious GoatCounter pageview and event tracking for the calculator site.

### Modified Capabilities
- None.

## Impact

- Affected application shell: `index.html` or equivalent Vite entry point for loading GoatCounter.
- Affected UI handlers: selected calculator interaction handlers will emit anonymous event counts.
- Affected documentation/configuration: README or deployment notes should describe the GoatCounter site code/domain configuration.
- No calculator formula, simulation, taxation, or display behavior changes are expected.
