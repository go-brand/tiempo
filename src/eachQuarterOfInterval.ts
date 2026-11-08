import { isPlainDateAfter } from './isPlainDateAfter';
import { Temporal } from "./shared/temporal";
import { isPlainDate } from "./shared/temporal";
import { normalizeTemporalInput } from "./shared/normalizeTemporalInput";
import { quarterStartMonth } from "./shared/quarter";

/**
 * Uses the start endpoint's calendar and timezone, including for the end bound.
 * Native and polyfill endpoints may be mixed.
 *
 * Returns an array with the start of each quarter within the interval, inclusive
 * of both the start and end quarters.
 *
 * Quarters: Q1 = Jan–Mar, Q2 = Apr–Jun, Q3 = Jul–Sep, Q4 = Oct–Dec. Each element
 * is the first moment of the quarter (1st day of the quarter's starting month at
 * midnight) for Instant/ZonedDateTime inputs, or the first day as a PlainDate for
 * PlainDate inputs.
 *
 * For Instant inputs, UTC is used. For ZonedDateTime inputs, the timezone of the
 * start date is preserved. PlainDate inputs need no timezone and return PlainDate[].
 *
 * @param interval - The interval with start and end
 * @returns Array of ZonedDateTime (or PlainDate) at the start of each quarter
 *
 * @example
 * ```ts
 * const start = Temporal.ZonedDateTime.from('2025-02-15T10:00:00+00:00[UTC]');
 * const end = Temporal.ZonedDateTime.from('2025-11-20T14:00:00+00:00[UTC]');
 * eachQuarterOfInterval({ start, end });
 * // [2025-01-01…, 2025-04-01…, 2025-07-01…, 2025-10-01…]
 * ```
 *
 * @example
 * ```ts
 * // PlainDate interval returns PlainDate quarter starts (no timezone)
 * eachQuarterOfInterval({
 *   start: Temporal.PlainDate.from('2025-02-15'),
 *   end: Temporal.PlainDate.from('2025-08-20'),
 * });
 * // [2025-01-01, 2025-04-01, 2025-07-01]
 * ```
 */
export function eachQuarterOfInterval(interval: {
  start: Temporal.Instant | Temporal.ZonedDateTime;
  end: Temporal.Instant | Temporal.ZonedDateTime;
}): Temporal.ZonedDateTime[];
export function eachQuarterOfInterval(interval: {
  start: Temporal.PlainDate;
  end: Temporal.PlainDate;
}): Temporal.PlainDate[];
export function eachQuarterOfInterval(interval: {
  start: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate;
  end: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate;
}): Temporal.ZonedDateTime[] | Temporal.PlainDate[] {
  if (isPlainDate(interval.start) || isPlainDate(interval.end)) {
    if (!isPlainDate(interval.start) || !isPlainDate(interval.end)) {
      throw new TypeError('PlainDate intervals require two PlainDate endpoints');
    }
    if (isPlainDateAfter(interval.start, interval.end)) return [];
    return eachQuarterStart(interval.start, interval.end.withCalendar(interval.start.calendarId), (ym) => ym.toPlainDate({ day: 1 }));
  }

  const startZoned = normalizeTemporalInput(
    interval.start as Temporal.Instant | Temporal.ZonedDateTime,
  );
  const endZoned = normalizeTemporalInput(
    interval.end as Temporal.Instant | Temporal.ZonedDateTime,
  );
  if (startZoned.epochNanoseconds > endZoned.epochNanoseconds) return [];
  const timezone = startZoned.timeZoneId;

  return eachQuarterStart(startZoned, endZoned.withTimeZone(timezone).withCalendar(startZoned.calendarId), (ym) =>
    ym.toPlainDate({ day: 1 }).toZonedDateTime({
      timeZone: timezone,
      plainTime: new Temporal.PlainTime(),
    }),
  );
}

/**
 * Walks quarter-aligned year-months from start to end (inclusive) and maps each
 * to a result. Both bounds are snapped to their quarter's starting month.
 */
function eachQuarterStart<T>(
  start: { year: number; month: number; calendarId: string },
  end: { year: number; month: number; calendarId: string },
  make: (ym: Temporal.PlainYearMonth) => T,
): T[] {
  const startYearMonth = Temporal.PlainYearMonth.from({
    year: start.year,
    month: quarterStartMonth(start.month),
    calendar: start.calendarId,
  });
  const endYearMonth = Temporal.PlainYearMonth.from({
    year: end.year,
    month: quarterStartMonth(end.month),
    calendar: start.calendarId,
  });

  const out: T[] = [];
  let current = startYearMonth;
  while (Temporal.PlainYearMonth.compare(current, endYearMonth) <= 0) {
    out.push(make(current));
    // A calendar can have thirteen months; realign after crossing its year end.
    const next = current.add({ months: 3 });
    current = next.with({ month: quarterStartMonth(next.month) });
  }
  return out;
}
