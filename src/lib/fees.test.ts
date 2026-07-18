import { describe, expect, it } from 'vitest';
import {
  ibkrBrokerageFee,
  ibkrEtfOrderFee,
  ibkrFxConversionFee,
  ibkrOrderFee,
  lseBrokerageFee,
  nzdFromUsd,
} from './fees';

describe('IBKR brokerage fee (strict 1% cap)', () => {
  it('caps the fee at 1% of the order when 1% is below the USD $0.35 minimum', () => {
    // Order of NZD $10 -> USD $6 -> 1% = USD $0.06 < $0.35 -> fee = 1% of NZD = $0.10.
    expect(ibkrBrokerageFee(10)).toBeCloseTo(0.1, 6);
  });

  it('charges the USD $0.35 minimum (converted to NZD) on large orders', () => {
    // Order of NZD $1,000 -> USD $600 -> 1% = USD $6 > $0.35 -> fee = USD $0.35 = ~NZD $0.583.
    expect(ibkrBrokerageFee(1_000)).toBeCloseTo(nzdFromUsd(0.35), 6);
  });
});

describe('IBKR order net amount', () => {
  it('is always positive under the strict cap even for tiny orders', () => {
    const order = ibkrOrderFee(1);
    expect(order.net).toBeGreaterThan(0);
    expect(order.gross - order.fxFee - order.brokerageFee).toBeCloseTo(order.net, 6);
  });
});

describe('ETF domicile comparison fees', () => {
  it('charges a USD $1.80 automatic FX spread on NZD $10,000', () => {
    expect(ibkrFxConversionFee(10_000, 'auto')).toBeCloseTo(nzdFromUsd(1.8), 6);
  });

  it('charges the USD $2 manual FX minimum on NZD $10,000', () => {
    expect(ibkrFxConversionFee(10_000, 'manual')).toBeCloseTo(nzdFromUsd(2), 6);
  });

  it('charges USD $3 LSE brokerage on a USD $6,000 order', () => {
    expect(lseBrokerageFee(10_000)).toBeCloseTo(nzdFromUsd(3), 6);
  });

  it('caps fixed fees so a tiny manual LSE order has zero net value', () => {
    const order = ibkrEtfOrderFee(1, 'manual', 'lse');
    expect(order.net).toBe(0);
    expect(order.fxFee + order.brokerageFee).toBeCloseTo(order.gross, 6);
  });
});
