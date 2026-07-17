## Why

The InvestNow simulation currently removes 15% US withholding tax from dividends and then deducts the full PIE FDR tax without applying the corresponding foreign tax credit. This double-counts withholding tax, understates the PIE balance, and makes the year-by-year tax comparison misleading.

## What Changes

- Model the InvestNow gross dividend, US withholding tax, available foreign tax credit, gross PIE FDR tax, and net PIE tax explicitly.
- Limit the applied foreign tax credit to the PIE tax liability so net PIE tax cannot be negative and unused foreign credits are not refunded.
- Reinvest only the post-withholding dividend while deducting only the net PIE tax after the credit.
- Show the InvestNow withholding and foreign-tax-credit calculation in the year breakdown.
- Update tax totals and balances to use net PIE tax.
- Add a concise tax-model reference with source links, assumptions, formulas, and a worked regression example.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `fif-pie-taxation`: Define gross PIE FDR tax, attributed foreign tax credits, and net PIE tax owed.
- `investment-simulation`: Apply InvestNow withholding and its tax credit once in the annual balance flow.
- `calculator-interface`: Show the explicit InvestNow withholding and PIE credit calculation in expanded year details.

## Impact

- Updates PIE tax detail types and calculations in `src/lib/types.ts` and `src/lib/tax.ts`.
- Updates the InvestNow annual simulation in `src/lib/simulation.ts`.
- Updates the InvestNow tax panel in `src/components/BreakdownTable.tsx`.
- Updates focused tax and simulation tests.
- Adds `docs/tax-model.md` and links it from the README.
- Does not change historical market data, IBKR taxation, fees, controls, or dependencies.
