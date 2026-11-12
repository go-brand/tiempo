import { Temporal, isPlainDate } from './temporal';
import { normalizeTemporalInput } from './normalizeTemporalInput';

/**
 * @internal
 * The calendar dates behind a differenceInCalendar* pair: PlainDates as given,
 * Instants by their UTC date, ZonedDateTimes by the date in their own timezone.
 * Both come back in this implementation and in the earlier date's calendar.
 */
export function calendarDates(
  laterDate: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate,
  earlierDate: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate
): [later: Temporal.PlainDate, earlier: Temporal.PlainDate] {
  if (isPlainDate(laterDate) !== isPlainDate(earlierDate)) {
    throw new TypeError('PlainDate differences require two PlainDate values');
  }
  const later = dateOf(laterDate);
  const earlier = dateOf(earlierDate);
  return [later.withCalendar(earlier.calendarId), earlier];
}

function dateOf(
  input: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate
): Temporal.PlainDate {
  const date = isPlainDate(input) ? input : normalizeTemporalInput(input).toPlainDate();
  // A canonical string brings dates from another Temporal implementation across.
  return Temporal.PlainDate.from(date.toString());
}
