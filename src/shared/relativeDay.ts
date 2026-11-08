import { type Temporal, isPlainDate } from './temporal';
import type { Timezone } from '../types';
import { compare } from './compare';
import { toPlainDate } from '../toPlainDate';
import { today } from '../today';

/**
 * @internal
 * True when the input's calendar date in `timezone` is `days` away from
 * today's date in that same timezone. PlainDate inputs are already dates.
 */
export function isDaysFromToday(
  input: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate,
  timezone: Timezone,
  days: number
): boolean {
  const date = isPlainDate(input) ? input : toPlainDate(input, timezone);
  return compare(date, today(timezone).add({ days })) === 0;
}
