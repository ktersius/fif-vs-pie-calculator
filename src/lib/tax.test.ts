import { describe, expect, it } from 'vitest';
import { pieTax, fifTax } from './tax';

describe('PIE FDR tax', () => {
  it('taxes 5% of opening balance at the PIR in a positive year', () => {
    const detail = pieTax(100_000, 0.28);
    expect(detail.taxableIncome).toBe(5_000);
    expect(detail.taxOwed).toBeCloseTo(1_400, 6);
  });

  it('is levied even in a crash year (depends only on opening balance and PIR)', () => {
    // Same opening balance yields the same PIE tax regardless of market return.
    const detail = pieTax(200_000, 0.28);
    expect(detail.taxOwed).toBeCloseTo(2_800, 6);
  });
});

describe('FIF-exempt dividend taxation', () => {
  it('applies dividend-only tax with the withholding credit', () => {
    const detail = fifTax({
      costBase: 50_000,
      openingBalance: 50_000,
      grossDividends: 1_000,
      growth: 4_000,
      managementFee: 15,
      marginalRate: 0.39,
    });
    expect(detail.regime).toBe('exempt');
    // NZ gross = 390, FTC = min(150, 390) = 150, net = 240.
    expect(detail.nzGrossTax).toBeCloseTo(390, 6);
    expect(detail.ftc).toBeCloseTo(150, 6);
    expect(detail.netTax).toBeCloseTo(240, 6);
  });

  it('caps the foreign tax credit at the NZ liability (never negative)', () => {
    const detail = fifTax({
      costBase: 50_000,
      openingBalance: 50_000,
      grossDividends: 1_000,
      growth: 4_000,
      managementFee: 15,
      marginalRate: 0.105, // NZ gross = 105 < FTC 150
    });
    expect(detail.ftc).toBeCloseTo(105, 6);
    expect(detail.netTax).toBe(0);
  });
});

describe('FIF FDR vs CV selection', () => {
  it('levies the lesser of FDR and CV net tax in a normal year', () => {
    const detail = fifTax({
      costBase: 200_000,
      openingBalance: 200_000,
      grossDividends: 3_000,
      growth: 16_000,
      managementFee: 60,
      marginalRate: 0.39,
    });
    expect(detail.regime).toBe('fif');
    expect(detail.netTax).toBeCloseTo(Math.min(detail.fdrNetTax!, detail.cvNetTax!), 6);
    // FDR income 10,000 -> gross 3,900 -> FTC 450 -> net 3,450.
    expect(detail.fdrNetTax).toBeCloseTo(3_450, 6);
  });

  it('gives the CV advantage in a crash year (CV income floored at zero)', () => {
    const detail = fifTax({
      costBase: 200_000,
      openingBalance: 200_000,
      grossDividends: 3_000,
      growth: -30_000, // crash
      managementFee: 40,
      marginalRate: 0.39,
    });
    // CV income = max(0, -30000 + 3000 - 40) = 0 -> CV gross 0 -> CV net 0.
    expect(detail.cvIncome).toBe(0);
    expect(detail.cvNetTax).toBe(0);
    expect(detail.selectedMethod).toBe('CV');
    expect(detail.netTax).toBe(0);
  });

  it('floors FDR net tax at zero when the credit exceeds the gross tax', () => {
    const detail = fifTax({
      costBase: 200_000,
      openingBalance: 10_000,
      grossDividends: 5_000, // FTC 750 exceeds FDR gross tax
      growth: 500,
      managementFee: 10,
      marginalRate: 0.105,
    });
    expect(detail.fdrNetTax).toBe(0);
  });
});
