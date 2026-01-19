import type { Temporal } from '@js-temporal/polyfill';
import { differenceInDays } from './differenceInDays.js';
import { differenceInHours } from './differenceInHours.js';
import { differenceInMinutes } from './differenceInMinutes.js';
import { differenceInMonths } from './differenceInMonths.js';
import { differenceInSeconds } from './differenceInSeconds.js';
import { differenceInWeeks } from './differenceInWeeks.js';
import { differenceInYears } from './differenceInYears.js';
import { normalizeTemporalInput } from './shared/normalizeTemporalInput.js';

export interface IntlFormatDistanceOptions {
  /**
   * The unit to force formatting in. If not specified, the unit will be automatically selected.
   */
  unit?: Intl.RelativeTimeFormatUnit;
  /**
   * The locale to use for formatting. Defaults to the system locale.
   */
  locale?: string | string[];
  /**
   * The locale matching algorithm to use.
   */
  localeMatcher?: 'best fit' | 'lookup';
  /**
   * Whether to use numeric values always, or use special strings like "yesterday", "tomorrow", etc.
   * Defaults to 'auto'.
   */
  numeric?: 'always' | 'auto';
  /**
   * The formatting style to use.
   */
  style?: 'long' | 'short' | 'narrow';
}

/**
 * Formats the distance between two dates as a human-readable, internationalized string.
 *
 * The function automatically picks the most appropriate unit based on the distance between dates.
 * For example, if the distance is a few hours, it returns "in X hours". If the distance is a few
 * months, it returns "in X months".
 *
 * You can force a specific unit using the `options.unit` parameter.
 *
 * @param laterDate - The later date to compare
 * @param earlierDate - The earlier date to compare with
 * @param options - Formatting options
 * @returns The formatted distance string
 *
 * @example
 * ```typescript
 * const later = Temporal.Instant.from('2024-01-01T12:00:00Z');
 * const earlier = Temporal.Instant.from('2024-01-01T11:00:00Z');
 *
 * intlFormatDistance(later, earlier);
 * // => 'in 1 hour'
 *
 * intlFormatDistance(earlier, later);
 * // => '1 hour ago'
 * ```
 *
 * @example
 * ```typescript
 * // Force a specific unit
 * const later = Temporal.Instant.from('2025-01-01T00:00:00Z');
 * const earlier = Temporal.Instant.from('2024-01-01T00:00:00Z');
 *
 * intlFormatDistance(later, earlier, { unit: 'quarter' });
 * // => 'in 4 quarters'
 * ```
 *
 * @example
 * ```typescript
 * // Use a different locale
 * const later = Temporal.Instant.from('2024-01-01T12:00:00Z');
 * const earlier = Temporal.Instant.from('2024-01-01T11:00:00Z');
 *
 * intlFormatDistance(later, earlier, { locale: 'es' });
 * // => 'dentro de 1 hora'
 * ```
 *
 * @example
 * ```typescript
 * // Use numeric: 'always' to avoid special strings
 * const later = Temporal.Instant.from('2024-01-02T00:00:00Z');
 * const earlier = Temporal.Instant.from('2024-01-01T00:00:00Z');
 *
 * intlFormatDistance(later, earlier, { numeric: 'auto' });
 * // => 'tomorrow'
 *
 * intlFormatDistance(later, earlier, { numeric: 'always' });
 * // => 'in 1 day'
 * ```
 */
export function intlFormatDistance(
  laterDate: Temporal.Instant | Temporal.ZonedDateTime,
  earlierDate: Temporal.Instant | Temporal.ZonedDateTime,
  options?: IntlFormatDistanceOptions
): string {
  const zoned1 = normalizeTemporalInput(laterDate);
  const zoned2 = normalizeTemporalInput(earlierDate);

  // Determine unit if not specified
  let unit = options?.unit;
  if (!unit) {
    const absSeconds = Math.abs(differenceInSeconds(zoned1, zoned2));
    const absMinutes = Math.abs(differenceInMinutes(zoned1, zoned2));
    const absHours = Math.abs(differenceInHours(zoned1, zoned2));
    const absDays = Math.abs(differenceInDays(zoned1, zoned2));
    const absWeeks = Math.abs(differenceInWeeks(zoned1, zoned2));
    const absMonths = Math.abs(differenceInMonths(zoned1, zoned2));

    if (absSeconds < 60) {
      unit = 'second';
    } else if (absMinutes < 60) {
      unit = 'minute';
    } else if (absHours < 24) {
      unit = 'hour';
    } else if (absDays < 7) {
      unit = 'day';
    } else if (absWeeks < 4) {
      unit = 'week';
    } else if (absMonths < 12) {
      unit = 'month';
    } else {
      unit = 'year';
    }
  }

  // Calculate value for the selected unit
  let value: number;
  switch (unit) {
    case 'second':
      value = differenceInSeconds(zoned1, zoned2);
      break;
    case 'minute':
      value = differenceInMinutes(zoned1, zoned2);
      break;
    case 'hour':
      value = differenceInHours(zoned1, zoned2);
      break;
    case 'day':
      value = differenceInDays(zoned1, zoned2);
      break;
    case 'week':
      value = differenceInWeeks(zoned1, zoned2);
      break;
    case 'month':
      value = differenceInMonths(zoned1, zoned2);
      break;
    case 'quarter':
      value = Math.round(differenceInMonths(zoned1, zoned2) / 3);
      break;
    case 'year':
      value = differenceInYears(zoned1, zoned2);
      break;
    default:
      // For any other unit type, try to use it directly
      value = differenceInSeconds(zoned1, zoned2);
  }

  // Format using Intl.RelativeTimeFormat
  const formatter = new Intl.RelativeTimeFormat(options?.locale, {
    localeMatcher: options?.localeMatcher,
    numeric: options?.numeric ?? 'auto',
    style: options?.style,
  });

  return formatter.format(value, unit);
}
