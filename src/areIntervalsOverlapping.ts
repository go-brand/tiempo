import type { Temporal } from './shared/temporal';
import { compare, type Timeline } from './shared/compare';

/**
 * Returns true if two intervals share any time.
 *
 * By default an interval that ends exactly where the other starts does not
 * overlap it, so back-to-back bookings are allowed. Pass `{ inclusive: true }`
 * to count a shared endpoint, as for inclusive date ranges.
 *
 * Instants and ZonedDateTimes compare by the moment they represent. PlainDate
 * intervals compare by date. Mixing PlainDate and timeline endpoints throws a
 * TypeError; an interval whose start is after its end throws a RangeError.
 *
 * @param left - The first interval
 * @param right - The second interval
 * @param options - `inclusive`: count intervals that only touch as overlapping
 * @returns true if the intervals overlap
 *
 * @example
 * ```ts
 * const meeting = {
 *   start: Temporal.ZonedDateTime.from('2025-01-20T09:00:00+01:00[Europe/Madrid]'),
 *   end: Temporal.ZonedDateTime.from('2025-01-20T10:00:00+01:00[Europe/Madrid]')
 * };
 * const call = {
 *   start: Temporal.Instant.from('2025-01-20T08:30:00Z'), // 09:30 in Madrid
 *   end: Temporal.Instant.from('2025-01-20T09:30:00Z')
 * };
 *
 * areIntervalsOverlapping(meeting, call); // true
 * ```
 *
 * @example
 * ```ts
 * const firstStay = { start: Temporal.PlainDate.from('2025-07-01'), end: Temporal.PlainDate.from('2025-07-04') };
 * const nextStay = { start: Temporal.PlainDate.from('2025-07-04'), end: Temporal.PlainDate.from('2025-07-08') };
 *
 * areIntervalsOverlapping(firstStay, nextStay); // false
 * areIntervalsOverlapping(firstStay, nextStay, { inclusive: true }); // true
 * ```
 */
export function areIntervalsOverlapping(
  left: { start: Temporal.PlainDate; end: Temporal.PlainDate },
  right: { start: Temporal.PlainDate; end: Temporal.PlainDate },
  options?: { inclusive?: boolean }
): boolean;
export function areIntervalsOverlapping(
  left: { start: Timeline; end: Timeline },
  right: { start: Timeline; end: Timeline },
  options?: { inclusive?: boolean }
): boolean;
export function areIntervalsOverlapping(
  left: { start: Timeline | Temporal.PlainDate; end: Timeline | Temporal.PlainDate },
  right: { start: Timeline | Temporal.PlainDate; end: Timeline | Temporal.PlainDate },
  options?: { inclusive?: boolean }
): boolean {
  if (compare(left.start, left.end) > 0 || compare(right.start, right.end) > 0) {
    throw new RangeError('Interval start must not be after its end');
  }
  const limit = options?.inclusive ? 0 : -1;
  return compare(left.start, right.end) <= limit && compare(right.start, left.end) <= limit;
}
