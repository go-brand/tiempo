import type { Temporal } from "./shared/temporal";
import { assertSameDomain, position, type Comparable, type Timeline } from "./shared/compare";

/**
 * Returns the candidate nearest to the target, or undefined when there are no
 * candidates. Ties return the first. The candidate is returned as given.
 *
 * Timeline values measure exact elapsed time, PlainDates whole days, and
 * PlainTimes time within one day (no wrapping at midnight). Mixed domains throw
 * a TypeError.
 *
 * @param target - The value to measure from
 * @param candidates - Values from the same domain as target
 * @returns The nearest candidate, or undefined if candidates is empty
 *
 * @example
 * ```ts
 * const now = Temporal.Instant.from('2025-01-20T12:00:00Z');
 * const slots = [
 *   Temporal.Instant.from('2025-01-20T09:00:00Z'),
 *   Temporal.Instant.from('2025-01-20T13:30:00Z'),
 * ];
 *
 * closestTo(now, slots); // 2025-01-20T13:30:00Z
 * closestTo(now, []); // undefined
 * ```
 */
export function closestTo<T extends Timeline>(
  target: Timeline,
  candidates: readonly T[],
): T | undefined;
export function closestTo(
  target: Temporal.PlainDate,
  candidates: readonly Temporal.PlainDate[],
): Temporal.PlainDate | undefined;
export function closestTo(
  target: Temporal.PlainTime,
  candidates: readonly Temporal.PlainTime[],
): Temporal.PlainTime | undefined;
export function closestTo(
  target: Comparable,
  candidates: readonly Comparable[],
): Comparable | undefined {
  const origin = position(target);
  let closest: Comparable | undefined;
  let closestDistance = 0n;

  for (const candidate of candidates) {
    assertSameDomain(target, candidate);
    const offset = position(candidate) - origin;
    const distance = offset < 0n ? -offset : offset;
    if (closest === undefined || distance < closestDistance) {
      closest = candidate;
      closestDistance = distance;
    }
  }
  return closest;
}
