import { describe, expect, it } from 'vitest';
import {
  etfFifTax,
  fifTax,
  inheritedWealth,
  pieTax,
  tentativeEstateTaxUsd,
} from './tax';

describe('PIE FDR tax', () => {
  it('applies foreign withholding tax as a credit against gross PIE tax', () => {
    const detail = pieTax(100_000, 3_000, 0.28);
    expect(detail.taxableIncome).toBe(5_000);
    expect(detail.grossTax).toBeCloseTo(1_400, 6);
    expect(detail.withholdingTax).toBeCloseTo(450, 6);
    expect(detail.foreignTaxCredit).toBeCloseTo(450, 6);
    expect(detail.netTax).toBeCloseTo(950, 6);
  });

  it('caps the foreign tax credit at gross PIE tax', () => {
    const detail = pieTax(10_000, 5_000, 0.105);
    expect(detail.grossTax).toBeCloseTo(52.5, 6);
    expect(detail.withholdingTax).toBeCloseTo(750, 6);
    expect(detail.foreignTaxCredit).toBeCloseTo(52.5, 6);
    expect(detail.netTax).toBe(0);
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

  it('gives the CV advantage in a negative historical year (CV income floored at zero)', () => {
    const detail = fifTax({
      costBase: 200_000,
      openingBalance: 200_000,
      grossDividends: 3_000,
      growth: -30_000,
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

describe('ETF domicile FIF tax', () => {
  it('selects FDR for a US ETF in a bull market', () => {
    const detail = etfFifTax({
      domicile: 'us',
      openingBalance: 100_000,
      grossDividends: 1_500,
      growth: 10_000,
      managementFee: 0,
      marginalRate: 0.33,
    });
    expect(detail.fdrIncome).toBe(5_000);
    expect(detail.cvIncome).toBe(11_500);
    expect(detail.selectedMethod).toBe('FDR');
  });

  it('shows the mild-decline CV difference between distributing and accumulating ETFs', () => {
    const common = {
      openingBalance: 100_000,
      grossDividends: 1_500,
      growth: -1_400,
      managementFee: 0,
      marginalRate: 0.33,
    };
    const us = etfFifTax({ ...common, domicile: 'us' });
    const irish = etfFifTax({ ...common, domicile: 'irish' });
    expect(us.cvIncome).toBe(100);
    expect(irish.cvIncome).toBe(0);
    expect(irish.foreignTaxCredit).toBe(0);
  });

  it('caps a US ETF foreign tax credit at each method liability', () => {
    const detail = etfFifTax({
      domicile: 'us',
      openingBalance: 10_000,
      grossDividends: 5_000,
      growth: 0,
      managementFee: 0,
      marginalRate: 0.105,
    });
    expect(detail.fdrForeignTaxCredit).toBe(detail.fdrGrossTax);
    expect(detail.fdrNetTax).toBe(0);
  });

  it('allows positive Irish CV income despite a negative price return', () => {
    const detail = etfFifTax({
      domicile: 'irish',
      openingBalance: 100_000,
      grossDividends: 2_000,
      growth: -1_000,
      managementFee: 70,
      marginalRate: 0.33,
    });
    expect(detail.cvIncome).toBe(630);
    expect(detail.cvNetTax).toBeCloseTo(207.9, 6);
  });
});

describe('US estate tax scenario', () => {
  it('uses the progressive schedule for a USD $300,000 holding', () => {
    expect(tentativeEstateTaxUsd(300_000)).toBe(87_800);
    const result = inheritedWealth(500_000, 'us'); // NZD $500k = USD $300k
    expect(result.estateTax).toBeCloseTo(74_800 / 0.6, 6);
    expect(result.inheritedBalance).toBeCloseTo(225_200 / 0.6, 6);
  });

  it('charges no estate tax at the USD $60,000 threshold or for an Irish ETF', () => {
    expect(inheritedWealth(100_000, 'us').estateTax).toBe(0);
    expect(inheritedWealth(500_000, 'irish').estateTax).toBe(0);
  });
});
