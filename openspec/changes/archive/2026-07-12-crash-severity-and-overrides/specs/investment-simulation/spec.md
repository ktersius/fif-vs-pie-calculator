## MODIFIED Requirements

### Requirement: Crash Year Modelling

The system SHALL select the configured number of crash years (0 to the lesser of 5 and the investment horizon) out of the simulated years and apply a negative market return in those years. Crash-year *selection* SHALL be deterministic: it is derived from an explicit seed and does not change when other simulation inputs change. Crash-year *depth* SHALL be drawn per year from a configurable severity band and MAY be individually overridden by the investor.

Selection:
- Both portfolios SHALL share the same set of crash years for a given seed.
- A given seed SHALL always reproduce the same set of crash years.
- The set SHALL only change when the seed changes (via re-roll) or when the number of crash years changes.
- Crash years SHALL be selected from Years 1 through the investment horizon H.

Severity band and depth:
- The crash severity band is defined by a minimum and maximum drop percentage within outer bounds of 5% to 60%, with `min ≤ max`.
- Each crash year SHALL receive a default depth drawn uniformly from the band, derived deterministically by hashing the pair `(seed, year)`. Because the depth is keyed to the year number (not the draw order), a crash year's default depth SHALL be stable when the number of crash years changes.
- When `min = max`, every default depth collapses to that single fixed value (e.g. a band of 15%–15% reproduces the legacy fixed −15% behaviour).

Manual overrides:
- The system SHALL maintain a set of per-year manual depth overrides. The effective depth for a crash year SHALL be its override when one exists, otherwise its band-generated default.
- A manual override MAY exceed the severity band, bounded only by the outer 5%–60% limits.
- Re-rolling (generating a new seed) SHALL clear all overrides and regenerate default depths.
- Reducing the number of crash years SHALL retain the overrides for years that remain crash years and hold overrides for removed years dormant, restoring them if those years become crash years again.
- The system SHALL allow an individual crash's depth to be reset back to its band-generated default.
- Both portfolios SHALL apply the same effective depth for a given crash year.

#### Scenario: Crash year applies the effective depth

- **WHEN** a year is designated a crash year with effective depth d
- **THEN** the market growth for that year is computed as Temporary Balance × (−d) instead of the expected market return

#### Scenario: Crash years distinct and within range

- **WHEN** the number of crash years is configured as N and the horizon is H
- **THEN** exactly N distinct years within Years 1–H are selected as crash years (with N ≤ min(5, H))

#### Scenario: Crash years stable across non-crash input changes

- **WHEN** the investor changes an input other than the number of crash years or the seed (e.g. market return, contribution, tax rate)
- **THEN** the set of crash years remains unchanged and the simulation re-runs with the same crash years

#### Scenario: Same seed reproduces the same crash years

- **WHEN** the simulation is run twice with the same seed and the same number of crash years
- **THEN** the two runs select an identical set of crash years

#### Scenario: Increasing the crash count preserves existing crash years

- **WHEN** the investor increases the number of crash years (e.g. from 3 to 4) without re-rolling
- **THEN** the original crash years are preserved and additional distinct crash years are deterministically added from the current seed (and decreasing the count deterministically removes the most recently added years)

#### Scenario: Default depth drawn uniformly from the band

- **WHEN** a crash year has no manual override and the band is min–max
- **THEN** its default depth is a deterministic value in [min, max] derived from hashing (seed, year)

#### Scenario: Depth stable across crash-count changes

- **WHEN** the investor increases or decreases the number of crash years without re-rolling
- **THEN** the default depth of any year that remains a crash year is unchanged

#### Scenario: Manual override takes precedence over the default

- **WHEN** a crash year has a manual override depth set
- **THEN** the simulation uses the override depth for that year rather than the band-generated default

#### Scenario: Override may exceed the band within outer bounds

- **WHEN** the band is 10%–40% and the investor overrides a crash year to 55%
- **THEN** the override is accepted (bounded by the outer 5%–60% limits) and applied even though it lies outside the band

#### Scenario: Re-roll clears overrides and regenerates depths

- **WHEN** the investor re-rolls the crash scenario
- **THEN** a new seed is generated, all manual overrides are cleared, and every crash year takes a fresh band-generated default depth

#### Scenario: Reducing crash count keeps overrides dormant and restorable

- **WHEN** a crash year with a manual override is removed by decreasing the crash count and later re-added by increasing the count without re-rolling
- **THEN** the previously set override for that year is restored

#### Scenario: Collapsed band reproduces a fixed depth

- **WHEN** the severity band is set with min equal to max (e.g. 15%–15%) and no overrides exist
- **THEN** every crash year applies exactly that fixed depth

#### Scenario: Reset returns a crash to its band default

- **WHEN** a crash year has a manual override and the investor resets it
- **THEN** the override is removed and the crash year reverts to its band-generated default depth
