import type { Temporal } from '@js-temporal/polyfill';
import {
  format, isBefore, isAfter, toPlainTime,
  differenceInDays, differenceInWeeks, differenceInMonths, differenceInQuarters, differenceInYears,
  eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, eachYearOfInterval, eachQuarterOfInterval,
  addDays, subDays, addWeeks, subWeeks,
  addMonths, subMonths, addYears, subYears,
  startOfMonth,
  toInstant,
  toPlainDate,
  toZonedTime,
} from '../dist/index.js';

const instant = toInstant('2025-01-20T20:00:00Z');
const sameInstant = toInstant(instant);
const zoned = toZonedTime(instant, 'UTC');
const date = toPlainDate('2025-01-20');
const calendarBoundary = startOfMonth(date);
const timelineBoundary = startOfMonth(date, 'UTC');

if (instant.toString() !== '2025-01-20T20:00:00Z') {
  throw new Error('toInstant string conversion failed');
}

if (sameInstant !== instant) {
  throw new Error('toInstant is not idempotent');
}

if (zoned.timeZoneId !== 'UTC') {
  throw new Error('toZonedTime did not preserve the requested timezone');
}

if (calendarBoundary.toString() !== '2025-01-01') {
  throw new Error('PlainDate boundary changed calendar value');
}

if (timelineBoundary.timeZoneId !== 'UTC') {
  throw new Error('PlainDate timezone bridge did not return UTC');
}

// @ts-expect-error A calendar-only boundary has no clock fields.
calendarBoundary.hour;

// The installed declarations must keep date-only and timeline returns distinct.
const dateResults: Temporal.PlainDate[] = [
  addDays(date, 1), subDays(date, 1), addWeeks(date, 1), subWeeks(date, 1),
  addMonths(date, 1), subMonths(date, 1), addYears(date, 1), subYears(date, 1),
];
const expectedDates = [
  '2025-01-21', '2025-01-19', '2025-01-27', '2025-01-13',
  '2025-02-20', '2024-12-20', '2026-01-20', '2024-01-20',
];
if (dateResults.some((value, index) => value.toString() !== expectedDates[index])) {
  throw new Error('PlainDate arithmetic changed date values');
}
const timelineResults: Temporal.ZonedDateTime[] = [
  addDays(instant, 1), subDays(zoned, 1), addWeeks(instant, 1), subWeeks(zoned, 1),
  addMonths(instant, 1), subMonths(zoned, 1), addYears(instant, 1), subYears(zoned, 1),
];
if (timelineResults.some(value => value.timeZoneId !== 'UTC')) {
  throw new Error('Calendar arithmetic changed timeline return context');
}
const existingArgs: Parameters<typeof addDays> = [instant, 1];
const existingReturn: ReturnType<typeof addDays> = addDays(...existingArgs);
if (existingReturn.timeZoneId !== 'UTC') {
  throw new Error('Existing inferred timeline signature changed');
}
// @ts-expect-error Arithmetic on a PlainDate does not introduce clock fields.
addDays(date, 1).hour;

if (format(date, 'yyyy-MM-dd') !== '2025-01-20') {
  throw new Error('PlainDate format overload failed');
}
const nextDate = addDays(date, 1);
const morning = toPlainTime('09:00');
const evening = toPlainTime('17:00');
if (!isBefore(date, nextDate) || !isAfter(nextDate, date)
  || !isBefore(morning, evening) || !isAfter(evening, morning)) {
  throw new Error('Plain comparison overloads failed');
}
function rejectedPlainCalls() {
  // @ts-expect-error A calendar date and instant cannot be ordered directly.
  isBefore(date, instant);
  // @ts-expect-error Clock times and calendar dates are different domains.
  isAfter(morning, date);
  // @ts-expect-error PlainDate formatting has no timezone override.
  format(date, 'yyyy-MM-dd', { timeZone: 'UTC' });
}
void rejectedPlainCalls;

console.log('✓ built-package consumer smoke passed');

// Exercise native caller objects against the installed, polyfill-backed package.
const nativeTemporal = (globalThis as unknown as { Temporal?: typeof import('@js-temporal/polyfill').Temporal }).Temporal;
if (nativeTemporal) {
  const nativeStart = nativeTemporal.ZonedDateTime.from('2025-03-08T12:00[America/New_York]');
  const packageEnd = toZonedTime('2025-03-10T16:00Z', 'America/New_York');
  if (differenceInDays(packageEnd, nativeStart) !== 2 || differenceInDays(nativeStart, packageEnd) !== -2) {
    throw new Error('Installed calendar differences failed across native/polyfill inputs');
  }
  const nativeYearStart = nativeTemporal.Instant.from('2025-01-01T00:00Z');
  const packageYearEnd = toInstant('2026-01-01T00:00Z');
  for (const [difference, expected] of [
    [differenceInDays, 365], [differenceInWeeks, 52], [differenceInMonths, 12],
    [differenceInQuarters, 4], [differenceInYears, 1],
  ] as const) {
    if (difference(packageYearEnd, nativeYearStart) !== expected || difference(nativeYearStart, packageYearEnd) !== -expected) {
      throw new Error('Installed calendar difference changed mixed-input results');
    }
  }
  const nativeDate = nativeTemporal.PlainDate.from('2025-01-01');
  if (differenceInQuarters(toPlainDate('2025-07-01'), nativeDate) !== 2) {
    throw new Error('Installed PlainDate quarters failed across native/polyfill inputs');
  }
}

if (nativeTemporal) {
  const nativeDate = nativeTemporal.PlainDate.from('2024-02-10[u-ca=hebrew]');
  if (toPlainDate(nativeDate).toString() !== nativeDate.toString()) {
    throw new Error('Installed conversion lost the native calendar');
  }
  const start = nativeDate.toZonedDateTime('UTC');
  const end = toPlainDate(nativeDate.add({ days: 1 })).toZonedDateTime('UTC');
  for (const interval of [eachMonthOfInterval, eachYearOfInterval, eachQuarterOfInterval]) {
    const values = interval({ start, end });
    if (values.length !== 1 || values[0]?.calendarId !== 'hebrew' || values[0].year !== 5784) {
      throw new Error('Installed calendar interval lost native calendar context');
    }
  }
}

const dateRangeStart = toPlainDate('2026-10-10');
const dateRangeEnd = toPlainDate('2026-10-12');
const dateRange: Temporal.PlainDate[] = eachDayOfInterval({ start: dateRangeStart, end: dateRangeEnd });
if (differenceInDays(dateRangeEnd, dateRangeStart) !== 2 || dateRange.map(day => day.toString()).join(',') !== '2026-10-10,2026-10-11,2026-10-12') {
  throw new Error('Installed PlainDate day operations failed');
}
if (nativeTemporal && differenceInDays(nativeTemporal.PlainDate.from('2026-10-12'), dateRangeStart) !== 2) {
  throw new Error('Installed PlainDate day difference failed for a native caller');
}
function rejectedDateDayInputs() {
  // @ts-expect-error A date-only value cannot be mixed with a timestamp.
  differenceInDays(dateRangeEnd, instant);
  // @ts-expect-error Both interval endpoints must belong to the same domain.
  eachDayOfInterval({ start: dateRangeStart, end: instant });
}
void rejectedDateDayInputs;

const calendarStart = toPlainDate('2025-01-01');
const calendarEnd = toPlainDate('2027-01-01');
for (const [difference, expected] of [[differenceInWeeks, 104], [differenceInMonths, 24], [differenceInYears, 2]] as const) {
  if (difference(calendarEnd, calendarStart) !== expected) {
    throw new Error('Installed PlainDate calendar difference failed');
  }
}
const calendarIntervals: Temporal.PlainDate[][] = [
  eachWeekOfInterval({ start: calendarStart, end: toPlainDate('2025-01-08') }),
  eachMonthOfInterval({ start: calendarStart, end: calendarEnd }),
  eachYearOfInterval({ start: calendarStart, end: calendarEnd }),
];
if (calendarIntervals.map(values => values.length).join(',') !== '2,25,3') {
  throw new Error('Installed PlainDate calendar intervals failed');
}
if (nativeTemporal) {
  const nativeEnd = nativeTemporal.PlainDate.from('2027-01-01');
  if (differenceInYears(nativeEnd, calendarStart) !== 2 || eachMonthOfInterval({ start: calendarStart, end: nativeEnd }).length !== 25) {
    throw new Error('Installed calendar family interoperability failed');
  }
}
function rejectedCalendarFamilyInputs() {
  for (const difference of [differenceInWeeks, differenceInMonths, differenceInYears]) {
    // @ts-expect-error Date-only/timeline mixing requires explicit conversion.
    difference(calendarEnd, instant);
  }
  for (const interval of [eachWeekOfInterval, eachMonthOfInterval, eachYearOfInterval]) {
    // @ts-expect-error Date-only/timeline mixing requires explicit conversion.
    interval({ start: calendarStart, end: instant });
  }
}
void rejectedCalendarFamilyInputs;
