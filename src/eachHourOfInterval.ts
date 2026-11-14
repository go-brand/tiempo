import { Temporal } from './shared/temporal';
import { normalizeTemporalInput } from './shared/normalizeTemporalInput';

/**
 * Returns an array of ZonedDateTime objects for each hour within the interval.
 * Each element represents a local hour boundary (minute/second/etc. set to 0),
 * or the first valid instant after an offset transition within an hour.
 * The interval is inclusive of both start and end hours.
 *
 * For Instant inputs, UTC is used as the timezone.
 * For ZonedDateTime inputs, the timezone of the start date is preserved.
 *
 * Completely missing hours are skipped. Partial hours start at the transition,
 * and repeated hours have separate entries for each offset. Later entries
 * realign to local hour boundaries, so steps need not be 60 elapsed minutes.
 *
 * @param interval - The interval with start and end datetimes
 * @returns Array of ZonedDateTime at start of each hour in the interval
 *
 * @example
 * ```ts
 * const start = Temporal.ZonedDateTime.from('2025-01-06T10:30:00+00:00[UTC]');
 * const end = Temporal.ZonedDateTime.from('2025-01-06T14:15:00+00:00[UTC]');
 *
 * const hours = eachHourOfInterval({ start, end });
 * // [
 * //   2025-01-06T10:00:00+00:00[UTC],
 * //   2025-01-06T11:00:00+00:00[UTC],
 * //   2025-01-06T12:00:00+00:00[UTC],
 * //   2025-01-06T13:00:00+00:00[UTC],
 * //   2025-01-06T14:00:00+00:00[UTC]
 * // ]
 * ```
 *
 * @example
 * ```ts
 * // Cross-day boundary
 * const start = Temporal.ZonedDateTime.from('2025-01-06T22:00:00+00:00[UTC]');
 * const end = Temporal.ZonedDateTime.from('2025-01-07T02:00:00+00:00[UTC]');
 *
 * const hours = eachHourOfInterval({ start, end });
 * // [
 * //   2025-01-06T22:00:00+00:00[UTC],
 * //   2025-01-06T23:00:00+00:00[UTC],
 * //   2025-01-07T00:00:00+00:00[UTC],
 * //   2025-01-07T01:00:00+00:00[UTC],
 * //   2025-01-07T02:00:00+00:00[UTC]
 * // ]
 * ```
 */
export function eachHourOfInterval(interval: {
  start: Temporal.Instant | Temporal.ZonedDateTime;
  end: Temporal.Instant | Temporal.ZonedDateTime;
}): Temporal.ZonedDateTime[] {
  const startZoned = normalizeTemporalInput(interval.start);
  const endZoned = normalizeTemporalInput(interval.end);
  if (startZoned.epochNanoseconds > endZoned.epochNanoseconds) return [];

  let current = startZoned.round({ smallestUnit: 'hour', roundingMode: 'floor' });
  // A repeated partial hour can begin at :30 even though rounding selects the
  // earlier :00. Include only the occurrence containing the starting instant.
  const transition = current.getTimeZoneTransition('next');
  if (transition && transition.epochNanoseconds <= startZoned.epochNanoseconds) {
    current = transition;
  }

  const hours: Temporal.ZonedDateTime[] = [];
  while (current.epochNanoseconds <= endZoned.epochNanoseconds) {
    hours.push(current);
    const nextLocalHour = current
      .toPlainDateTime()
      .round({ smallestUnit: 'hour', roundingMode: 'floor' })
      .add({ hours: 1 });
    let next = nextLocalHour.toZonedDateTime(current.timeZoneId);
    if (next.epochNanoseconds <= current.epochNanoseconds) {
      next = nextLocalHour.toZonedDateTime(current.timeZoneId, { disambiguation: 'later' });
    }
    // Offset transitions can start a partial or repeated hour before the next
    // local :00. Afterwards, compute a local boundary again to avoid drift.
    const nextTransition = current.getTimeZoneTransition('next');
    current =
      nextTransition && nextTransition.epochNanoseconds < next.epochNanoseconds
        ? nextTransition
        : next;
  }

  return hours;
}
