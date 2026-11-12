export const DATE_FNS_PAGE_URL = 'https://tiempo.gobrand.app/date-fns';
export const DATE_FNS_PAGE_TITLE = 'date-fns for the Temporal API · tiempo';
export const DATE_FNS_PAGE_DESCRIPTION =
  'Moving from date-fns to Temporal? tiempo keeps addDays, format, differenceInDays and 100+ familiar functions, with explicit timezones and DST-safe math.';

export const DATE_FNS_PAGE_META = [
  { title: DATE_FNS_PAGE_TITLE },
  { name: 'description', content: DATE_FNS_PAGE_DESCRIPTION },
  { property: 'og:title', content: DATE_FNS_PAGE_TITLE },
  { property: 'og:description', content: DATE_FNS_PAGE_DESCRIPTION },
  { property: 'og:type', content: 'website' },
  { property: 'og:url', content: DATE_FNS_PAGE_URL },
  { property: 'og:site_name', content: 'Tiempo' },
  { name: 'twitter:card', content: 'summary' },
  { name: 'twitter:title', content: DATE_FNS_PAGE_TITLE },
  { name: 'twitter:description', content: DATE_FNS_PAGE_DESCRIPTION }
] as const;

// The same task in both libraries: two days after an order placed just
// before the US switches to daylight saving time (March 8, 2026).
export const DATE_FNS_EXAMPLE = `import { addDays } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

const placedAt = new Date('2026-03-07T15:00:00Z');
const deliverBy = addDays(placedAt, 2); // days in the server's timezone

formatInTimeZone(deliverBy, 'America/New_York', 'EEE MMM d, h:mm a');
// "Mon Mar 9, 11:00 AM" on a server running in UTC`;

export const TIEMPO_EXAMPLE = `import { toZonedTime, addDays, format, toIso } from '@gobrand/tiempo';

const placedAt = toZonedTime('2026-03-07T15:00:00Z', 'America/New_York');
const deliverBy = addDays(placedAt, 2); // days in New York

format(deliverBy, 'EEE MMM d, h:mm a'); // "Mon Mar 9, 10:00 AM"
toIso(deliverBy); // "2026-03-09T14:00:00Z"`;

export const DATE_FNS_RENAMES = [
  ['new Date()', 'now(timezone), today(timezone)'],
  ['parseISO(str)', 'toZonedTime(str, timezone), toPlainDate(str)'],
  ['formatInTimeZone(date, tz, fmt)', 'format(date, fmt, { timeZone: tz })'],
  ['isToday(date)', 'isToday(date, timezone)'],
  ['startOfWeek(date) // Sunday', 'startOfWeek(date, { weekStartsOn: 7 })'],
  ['parse(str, fmt, new Date())', 'parse(str, fmt, { timeZone })']
] as const;
