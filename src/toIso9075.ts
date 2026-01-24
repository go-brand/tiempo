import { Temporal } from '@js-temporal/polyfill';

export type Iso9075Mode = 'utc' | 'local';
export type Iso9075Representation = 'complete' | 'date' | 'time';

export interface ToIso9075Options {
  /**
   * Which time to output.
   * - 'utc' (default): convert to UTC before formatting
   * - 'local': use the local time of the ZonedDateTime
   */
  mode?: Iso9075Mode;
  /**
   * What to include in the output.
   * - 'complete' (default): date and time (2019-09-18 19:00:52)
   * - 'date': date only (2019-09-18)
   * - 'time': time only (19:00:52)
   */
  representation?: Iso9075Representation;
}

/**
 * Convert a Temporal.Instant to an ISO 9075 (SQL) formatted string in UTC.
 */
export function toIso9075(
  input: Temporal.Instant,
  options?: Omit<ToIso9075Options, 'mode'>
): string;

/**
 * Convert a Temporal.ZonedDateTime to an ISO 9075 (SQL) formatted string.
 *
 * @param input - A Temporal.ZonedDateTime
 * @param options - Format options
 *
 * @example
 * ```typescript
 * const zoned = Temporal.ZonedDateTime.from("2025-01-20T15:00:00-05:00[America/New_York]");
 *
 * toIso9075(zoned);                       // "2025-01-20 20:00:00" (UTC, default)
 * toIso9075(zoned, { mode: 'utc' });      // "2025-01-20 20:00:00"
 * toIso9075(zoned, { mode: 'local' });    // "2025-01-20 15:00:00"
 * toIso9075(zoned, { representation: 'date' }); // "2025-01-20"
 * toIso9075(zoned, { representation: 'time' }); // "20:00:00"
 * ```
 */
export function toIso9075(
  input: Temporal.ZonedDateTime,
  options?: ToIso9075Options
): string;

export function toIso9075(
  input: Temporal.Instant | Temporal.ZonedDateTime,
  options: ToIso9075Options = {}
): string {
  const { mode = 'utc', representation = 'complete' } = options;

  let zdt: Temporal.ZonedDateTime;

  if (input instanceof Temporal.Instant) {
    zdt = input.toZonedDateTimeISO('UTC');
  } else {
    // ZonedDateTime: apply mode
    zdt = mode === 'utc' ? input.toInstant().toZonedDateTimeISO('UTC') : input;
  }

  const year = zdt.year;
  const month = zdt.month;
  const day = zdt.day;
  const hour = zdt.hour;
  const minute = zdt.minute;
  const second = zdt.second;

  const datePart = `${year}-${pad(month)}-${pad(day)}`;
  const timePart = `${pad(hour)}:${pad(minute)}:${pad(second)}`;

  if (representation === 'date') return datePart;
  if (representation === 'time') return timePart;
  return `${datePart} ${timePart}`;
}

function pad(n: number): string {
  return n.toString().padStart(2, '0');
}
