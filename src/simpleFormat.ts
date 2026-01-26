import { Temporal } from '@js-temporal/polyfill';
import type { Timezone } from './types';

interface BaseOptions {
  locale?: string;
  timeZone?: Timezone;
}

interface DateOnlyOptions extends BaseOptions {
  date: 'compact' | 'auto' | 'full';
  time?: never;
}

interface TimeOnlyOptions extends BaseOptions {
  date?: never;
  time: '12h' | '24h' | 'compact';
}

interface DateAndTimeOptions extends BaseOptions {
  date: 'compact' | 'auto' | 'full';
  time: '12h' | '24h' | 'compact';
}

export type SimpleFormatOptions = DateOnlyOptions | TimeOnlyOptions | DateAndTimeOptions;

/**
 * Format a Temporal date/time in a human-friendly way.
 *
 * Pass `date`, `time`, or both to control what's displayed.
 * At least one of `date` or `time` is required.
 *
 * @param input - A Temporal.Instant, ZonedDateTime, or PlainDate
 * @param options - Format options (at least `date` or `time` required)
 *
 * Date formats:
 * - `'compact'` - "Dec 23" (never shows year)
 * - `'auto'` - "Dec 23" or "Dec 23, 2020" (shows year only if not current year)
 * - `'full'` - "Dec 23, 2026" (always shows year)
 *
 * Time formats:
 * - `'12h'` - "3:30 PM"
 * - `'24h'` - "15:30"
 * - `'compact'` - "9am" or "2:30pm" (omits minutes when zero, lowercase am/pm)
 *
 * @example
 * ```typescript
 * const zdt = Temporal.ZonedDateTime.from("2026-12-23T09:00:00[America/New_York]");
 * const pastZdt = Temporal.ZonedDateTime.from("2020-12-23T14:30:00[America/New_York]");
 *
 * // Date only
 * simpleFormat(zdt, { date: 'compact' });     // "Dec 23"
 * simpleFormat(zdt, { date: 'auto' });        // "Dec 23"
 * simpleFormat(pastZdt, { date: 'auto' });    // "Dec 23, 2020"
 * simpleFormat(zdt, { date: 'full' });        // "Dec 23, 2026"
 *
 * // Time only
 * simpleFormat(zdt, { time: 'compact' });     // "9am"
 * simpleFormat(pastZdt, { time: 'compact' }); // "2:30pm"
 * simpleFormat(zdt, { time: '12h' });         // "9:00 AM"
 * simpleFormat(zdt, { time: '24h' });         // "09:00"
 *
 * // Date and time
 * simpleFormat(zdt, { date: 'auto', time: 'compact' });  // "Dec 23, 9am"
 * simpleFormat(zdt, { date: 'full', time: '12h' });      // "Dec 23, 2026, 9:00 AM"
 *
 * // With Instant (timeZone required)
 * const instant = Temporal.Instant.from("2026-12-23T14:00:00Z");
 * simpleFormat(instant, { date: 'auto', timeZone: 'America/New_York' }); // "Dec 23"
 * ```
 */
export function simpleFormat(
  input: Temporal.PlainDate | Temporal.ZonedDateTime | Temporal.Instant,
  options: SimpleFormatOptions
): string {
  const { locale = 'en-US', timeZone } = options;
  const dateFormat = 'date' in options ? options.date : undefined;
  const timeFormat = 'time' in options ? options.time : undefined;

  // Convert input to ZonedDateTime for consistent handling
  let zdt: Temporal.ZonedDateTime;

  if (input instanceof Temporal.Instant) {
    const tz = timeZone ?? 'UTC';
    zdt = input.toZonedDateTimeISO(tz);
  } else if (input instanceof Temporal.ZonedDateTime) {
    if (timeZone) {
      zdt = input.toInstant().toZonedDateTimeISO(timeZone);
    } else {
      zdt = input;
    }
  } else {
    // PlainDate - convert to ZonedDateTime at midnight UTC for formatting
    zdt = input.toZonedDateTime({ timeZone: timeZone ?? 'UTC', plainTime: new Temporal.PlainTime() });
  }

  const parts: string[] = [];

  // Format date part
  if (dateFormat) {
    const currentYear = Temporal.Now.plainDateISO().year;
    const showYear =
      dateFormat === 'full' ? true : dateFormat === 'compact' ? false : zdt.year !== currentYear;

    const dateOptions: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short',
      year: showYear ? 'numeric' : undefined,
    };

    parts.push(zdt.toLocaleString(locale, dateOptions));
  }

  // Format time part
  if (timeFormat) {
    if (timeFormat === 'compact') {
      parts.push(formatCompactTime(zdt));
    } else {
      const timeOptions: Intl.DateTimeFormatOptions = {
        hour: 'numeric',
        minute: '2-digit',
        hour12: timeFormat === '12h',
      };
      parts.push(zdt.toLocaleString(locale, timeOptions));
    }
  }

  return parts.join(', ');
}

/**
 * Format time in compact style: "9am" or "2:30pm"
 * Omits minutes when they're zero for cleaner display.
 */
function formatCompactTime(zdt: Temporal.ZonedDateTime): string {
  const hour12 = zdt.hour % 12 || 12;
  const ampm = zdt.hour < 12 ? 'am' : 'pm';

  if (zdt.minute === 0) {
    return `${hour12}${ampm}`;
  }
  return `${hour12}:${zdt.minute.toString().padStart(2, '0')}${ampm}`;
}
