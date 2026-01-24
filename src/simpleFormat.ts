import { Temporal } from '@js-temporal/polyfill';
import type { Timezone } from './types';

// simpleFormat options - discriminated by input type
interface PlainDateOptions {
  locale?: string;
  year?: 'auto' | 'always' | 'never';
}

interface ZonedDateTimeOptions {
  locale?: string;
  time?: '12h' | '24h';
  timeZone?: Timezone;
  year?: 'auto' | 'always' | 'never';
}

interface InstantOptions {
  locale?: string;
  time?: '12h' | '24h';
  timeZone: Timezone; // required for Instant
  year?: 'auto' | 'always' | 'never';
}

/**
 * Format a Temporal date in a human-friendly way: "Dec 23" or "Dec 23, 2020"
 *
 * By default (year: 'auto'), shows the year only if the date is not in the current year.
 * Use year: 'always' to always show the year, or year: 'never' to always hide it.
 * Optionally includes time in 12-hour or 24-hour format.
 *
 * @example
 * ```typescript
 * // Assuming current year is 2026
 * const date2026 = Temporal.ZonedDateTime.from("2026-12-23T15:30:00[America/New_York]");
 * const date2020 = Temporal.ZonedDateTime.from("2020-12-23T15:30:00[America/New_York]");
 *
 * simpleFormat(date2026); // "Dec 23"
 * simpleFormat(date2020); // "Dec 23, 2020"
 * simpleFormat(date2026, { time: '12h' }); // "Dec 23, 3:30 PM"
 * simpleFormat(date2026, { time: '24h' }); // "Dec 23, 15:30"
 *
 * // Control year display
 * simpleFormat(date2026, { year: 'always' }); // "Dec 23, 2026"
 * simpleFormat(date2020, { year: 'never' }); // "Dec 23"
 * simpleFormat(date2020, { year: 'auto' }); // "Dec 23, 2020" (default behavior)
 *
 * // With Instant (timeZone required)
 * const instant = Temporal.Instant.from("2026-12-23T20:30:00Z");
 * simpleFormat(instant, { timeZone: 'America/New_York' }); // "Dec 23"
 * simpleFormat(instant, { timeZone: 'America/New_York', time: '12h' }); // "Dec 23, 3:30 PM"
 *
 * // With PlainDate (no time option)
 * const plain = Temporal.PlainDate.from("2020-12-23");
 * simpleFormat(plain); // "Dec 23, 2020"
 * ```
 */
export function simpleFormat(input: Temporal.PlainDate, options?: PlainDateOptions): string;
export function simpleFormat(input: Temporal.ZonedDateTime, options?: ZonedDateTimeOptions): string;
export function simpleFormat(input: Temporal.Instant, options: InstantOptions): string;
export function simpleFormat(
  input: Temporal.PlainDate | Temporal.ZonedDateTime | Temporal.Instant,
  options: PlainDateOptions | ZonedDateTimeOptions | InstantOptions = {}
): string {
  const locale = options.locale ?? 'en-US';
  const time = 'time' in options ? options.time : undefined;
  const timeZone = 'timeZone' in options ? options.timeZone : undefined;
  const yearOption = 'year' in options ? options.year : undefined;

  // Get year from the input (converting Instant to ZonedDateTime if needed)
  let year: number;
  let dateTimeForFormat: Temporal.PlainDate | Temporal.ZonedDateTime;

  if (input instanceof Temporal.Instant) {
    const tz = timeZone ?? 'UTC';
    const zoned = input.toZonedDateTimeISO(tz);
    year = zoned.year;
    dateTimeForFormat = zoned;
  } else if (input instanceof Temporal.ZonedDateTime) {
    if (timeZone) {
      const zoned = input.toInstant().toZonedDateTimeISO(timeZone);
      year = zoned.year;
      dateTimeForFormat = zoned;
    } else {
      year = input.year;
      dateTimeForFormat = input;
    }
  } else {
    year = input.year;
    dateTimeForFormat = input;
  }

  // Determine if year should be shown
  const currentYear = Temporal.Now.plainDateISO().year;
  const showYear =
    yearOption === 'always' ? true : yearOption === 'never' ? false : year !== currentYear;

  const dateOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: showYear ? 'numeric' : undefined,
  };

  // Add time options if requested and input supports it
  if (time && !(input instanceof Temporal.PlainDate)) {
    dateOptions.hour = 'numeric';
    dateOptions.minute = '2-digit';
    dateOptions.hour12 = time === '12h';
  }

  return dateTimeForFormat.toLocaleString(locale, dateOptions);
}
