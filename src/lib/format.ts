const nzdFormatter = new Intl.NumberFormat('en-NZ', {
  style: 'currency',
  currency: 'NZD',
  maximumFractionDigits: 0,
});

const nzdFormatterCents = new Intl.NumberFormat('en-NZ', {
  style: 'currency',
  currency: 'NZD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Format a value as NZD. Uses whole dollars by default, cents when requested. */
export function formatNZD(value: number, cents = false): string {
  return cents ? nzdFormatterCents.format(value) : nzdFormatter.format(value);
}

/** Format a decimal rate (e.g. 0.08) as a percentage string (e.g. "8%"). */
export function formatPercent(rate: number, dp = 2): string {
  const pct = rate * 100;
  const rounded = Number.isInteger(pct) ? pct.toString() : pct.toFixed(dp);
  return `${rounded}%`;
}
