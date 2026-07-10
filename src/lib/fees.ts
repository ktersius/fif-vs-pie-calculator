import {
  IBKR_BROKERAGE_CAP_RATE,
  IBKR_BROKERAGE_MIN_USD,
  IBKR_FX_RATE,
  INVESTNOW_BUY_FEE,
  INVESTNOW_SELL_FEE,
  USD_PER_NZD,
} from './constants';
import type { OrderFee } from './types';

/** Convert a USD amount to NZD using the fixed exchange rate. */
export function nzdFromUsd(usd: number): number {
  return usd / USD_PER_NZD;
}

/** InvestNow 0.50% buy transaction fee on a gross amount. */
export function investNowBuyFee(gross: number): number {
  return gross * INVESTNOW_BUY_FEE;
}

/** InvestNow 0.50% sell transaction fee on a balance. */
export function investNowSellFee(balance: number): number {
  return balance * INVESTNOW_SELL_FEE;
}

/** IBKR 0.03% FX auto-conversion fee on the NZD transaction amount. */
export function ibkrFxFee(nzdAmount: number): number {
  return nzdAmount * IBKR_FX_RATE;
}

/**
 * IBKR brokerage fee: USD $0.35 per order, strictly capped at 1% of the trade
 * value, converted to NZD. Because converting USD -> NZD cancels the exchange
 * rate on the percentage component, the 1% cap in NZD terms is simply 1% of the
 * order's NZD value; the USD $0.35 minimum converts to ~NZD $0.583.
 */
export function ibkrBrokerageFee(orderNzd: number): number {
  const orderUsd = orderNzd * USD_PER_NZD;
  const feeUsd = Math.min(IBKR_BROKERAGE_MIN_USD, IBKR_BROKERAGE_CAP_RATE * orderUsd);
  return nzdFromUsd(feeUsd);
}

/**
 * Net amount of a single IBKR order after the FX fee and capped brokerage fee.
 * Under the strict 1% cap the combined fees are at most ~1.03% of the order, so
 * the net is always positive; it is floored at zero defensively.
 */
export function ibkrOrderFee(orderNzd: number): OrderFee {
  const fxFee = ibkrFxFee(orderNzd);
  const brokerageFee = ibkrBrokerageFee(orderNzd);
  const net = Math.max(0, orderNzd - fxFee - brokerageFee);
  return { gross: orderNzd, fxFee, brokerageFee, net };
}
