/** Deterministic seedable PRNG (mulberry32). */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Deterministically select `count` distinct crash years within [1, horizon].
 *
 * A full deterministic permutation of the years is produced from the seed and
 * the first `count` entries are taken. This gives the "keep-and-add" property:
 * increasing the count preserves the existing selection and appends new years;
 * decreasing it removes the most recently added ones. The same seed always
 * yields the same permutation, so the selection is stable across other input
 * changes. The returned set is sorted ascending for display.
 */
export function selectCrashYears(
  seed: number,
  horizon: number,
  count: number,
): number[] {
  const capped = Math.max(0, Math.min(count, horizon));
  if (capped === 0 || horizon <= 0) return [];

  const years = Array.from({ length: horizon }, (_, i) => i + 1);
  const rng = mulberry32(seed);

  // Fisher-Yates shuffle driven by the seeded PRNG.
  for (let i = years.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = years[i];
    years[i] = years[j];
    years[j] = tmp;
  }

  return years.slice(0, capped).sort((a, b) => a - b);
}

/**
 * Deterministic default crash depth (drop fraction) for a given year.
 *
 * The magnitude is keyed to the pair `(seed, year)` rather than the draw order,
 * so a crash year's default depth is stable when the number of crash years
 * changes. The value is drawn uniformly from [min, max]. When `min === max`,
 * the band collapses to that single fixed depth.
 */
export function crashDepthDefault(seed: number, year: number, min: number, max: number): number {
  if (min >= max) return min;
  // Combine seed and year into a single well-mixed seed for the PRNG.
  const combined = (Math.imul(seed ^ 0x9e3779b9, 0x85ebca6b) ^ Math.imul(year + 1, 0xc2b2ae35)) >>> 0;
  const r = mulberry32(combined)();
  return min + (max - min) * r;
}

/**
 * Resolve the effective crash depth for a year: a manual override when present,
 * otherwise the band-generated default. The result is clamped to the outer
 * severity bounds.
 */
export function effectiveCrashDepth(
  year: number,
  overrides: Record<number, number>,
  seed: number,
  min: number,
  max: number,
  outerMin: number,
  outerMax: number,
): number {
  const raw = overrides[year] ?? crashDepthDefault(seed, year, min, max);
  return Math.max(outerMin, Math.min(outerMax, raw));
}
