## 1. PIE Tax Calculation

- [x] 1.1 Extend `PieTaxDetail` with gross dividends, US withholding tax, gross PIE tax, applied foreign tax credit, and net PIE tax.
- [x] 1.2 Update `pieTax` to calculate the capped foreign tax credit and net PIE tax from opening balance, gross dividends, and PIR.
- [x] 1.3 Add focused tax tests for a fully applied credit and a credit capped at gross PIE tax.

## 2. Simulation and Presentation

- [x] 2.1 Pass InvestNow gross dividends into `pieTax`, deduct only net PIE tax, and accumulate net PIE tax in totals.
- [x] 2.2 Add a simulation regression test proving withholding reduces dividends and then reduces PIE tax exactly once.
- [x] 2.3 Update the existing InvestNow tax panel to show gross dividends, withholding tax, gross PIE tax, foreign tax credit, and net PIE tax.
- [x] 2.4 Add `docs/tax-model.md` with source links, access dates, formulas, assumptions, and a worked 1991 example, then link it from the README.

## 3. Validation

- [x] 3.1 Run the existing test suite and production build.
- [x] 3.2 Validate the OpenSpec change and review the focused diff for duplicate withholding deductions.
