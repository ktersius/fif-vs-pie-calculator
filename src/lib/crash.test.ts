import { describe, expect, it } from 'vitest';
import { selectCrashYears } from './crash';

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
