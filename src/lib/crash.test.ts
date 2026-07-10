import { describe, expect, it } from 'vitest';
import { crashDepthDefault, effectiveCrashDepth, selectCrashYears } from './crash';

describe('deterministic crash-year selection', () => {
  it('reproduces the same set for the same seed and count', () => {
    const a = selectCrashYears(12345, 20, 3);
    const b = selectCrashYears(12345, 20, 3);
    expect(a).toEqual(b);
  });

  it('produces N distinct years within [1, H]', () => {
    const years = selectCrashYears(999, 20, 5);
    expect(years).toHaveLength(5);
    expect(new Set(years).size).toBe(5);
    for (const y of years) {
      expect(y).toBeGreaterThanOrEqual(1);
      expect(y).toBeLessThanOrEqual(20);
    }
  });

  it('preserves existing crash years when the count increases (keep-and-add)', () => {
    const three = selectCrashYears(777, 20, 3);
    const four = selectCrashYears(777, 20, 4);
    // Every year in the smaller set remains in the larger set.
    for (const y of three) {
      expect(four).toContain(y);
    }
    expect(four).toHaveLength(4);
  });

  it('caps the count at the horizon and returns sorted years', () => {
    const years = selectCrashYears(1, 3, 5);
    expect(years).toEqual([1, 2, 3]);
  });

  it('returns an empty set for zero crash years', () => {
    expect(selectCrashYears(1, 20, 0)).toEqual([]);
  });
});

describe('crash depth derivation', () => {
  it('is deterministic for (seed, year) and within the band', () => {
    const a = crashDepthDefault(42, 5, 0.1, 0.35);
    const b = crashDepthDefault(42, 5, 0.1, 0.35);
    expect(a).toBe(b);
    expect(a).toBeGreaterThanOrEqual(0.1);
    expect(a).toBeLessThanOrEqual(0.35);
  });

  it('collapses to a fixed depth when min === max', () => {
    expect(crashDepthDefault(1, 3, 0.15, 0.15)).toBe(0.15);
  });

  it('default depth is a pure function of (seed, year), independent of crash count', () => {
    const d1 = crashDepthDefault(7, 12, 0.1, 0.4);
    const d2 = crashDepthDefault(7, 12, 0.1, 0.4);
    expect(d1).toBe(d2);
  });

  it('override takes precedence and may exceed the band within outer bounds', () => {
    expect(effectiveCrashDepth(9, { 9: 0.55 }, 42, 0.1, 0.35, 0.05, 0.6)).toBe(0.55);
  });

  it('clamps overrides to the outer bounds', () => {
    expect(effectiveCrashDepth(9, { 9: 0.99 }, 42, 0.1, 0.35, 0.05, 0.6)).toBe(0.6);
    expect(effectiveCrashDepth(9, { 9: 0.01 }, 42, 0.1, 0.35, 0.05, 0.6)).toBe(0.05);
  });

  it('falls back to the band default when there is no override (reset)', () => {
    const def = crashDepthDefault(42, 9, 0.1, 0.35);
    expect(effectiveCrashDepth(9, {}, 42, 0.1, 0.35, 0.05, 0.6)).toBe(def);
  });
});
