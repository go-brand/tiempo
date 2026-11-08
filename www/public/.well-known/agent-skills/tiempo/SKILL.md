---
name: tiempo
description: Use when working with dates, times, timezones, or the Temporal API in TypeScript/JavaScript, or when replacing Date or date-fns. Covers tiempo's timezone-safe functions for conversion, formatting, arithmetic, comparison, sorting, business days, and intervals.
---

# tiempo - Timezone-Safe Datetime Handling

date-fns-style functions for the Temporal API. Coming from date-fns? See the [mapping](references/date-fns.md).

```bash
npm install @gobrand/tiempo
```

## Core Rules

- **Pick the type that says what the value is.** `Instant`: a moment (timestamps, logs). `ZonedDateTime`: a moment in a place (UI, scheduling). `PlainDate`: a calendar date (birthdays, due dates). `PlainTime`: a clock time (opening hours).
- **Instant inputs mean UTC.** Calendar operations on an Instant (`startOfDay`, `addDays`, `isSameDay`) use UTC, and datetime results are UTC ZonedDateTimes. For a user's calendar, convert first: `toZonedTime(instant, timezone)`.
- **ZonedDateTime keeps its timezone; PlainDate stays a date.** Arithmetic is DST-safe.
- **Argument order follows date-fns.** Differences take `(laterDate, earlierDate)`; intervals take `{ start, end }`.
- **Domains don't mix.** Comparing a PlainDate with an Instant is a TypeScript error and throws a TypeError. Convert explicitly.
- **"Today" needs a place.** `today(timezone)`, `now(timezone)`, `isToday(date, timezone)`.
- **Store exact moments as UTC ISO strings** (`toIso(instant)`); store date-only values as `YYYY-MM-DD`.

## Best Practices

- **Choose the timezone for local intent** - Instant conveniences default to UTC; convert explicitly for local calendar work. [details](references/best-practices/explicit-timezone.md)
- **Don't use JavaScript Date** - Use tiempo instead of Date for timezone work. [details](references/best-practices/no-js-date.md)
- **Store timestamps in UTC** - Preserve date-only values and future local scheduling intent separately. [details](references/best-practices/utc-storage.md)

---

## Conversion

| Function | Description | Reference |
|----------|-------------|-----------|
| `toInstant()` | Turn a string, timestamp, Date, or ZonedDateTime into an Instant. | [details](references/conversion/to-instant.md) |
| `toZonedTime()` | Show an exact moment in a timezone, as a ZonedDateTime. | [details](references/conversion/to-zoned-time.md) |
| `toPlainDate()` | Get a calendar date from a string, fields, or a timestamp. | [details](references/conversion/to-plain-date.md) |
| `toPlainTime()` | Get a clock time from a string, fields, or a timestamp. | [details](references/conversion/to-plain-time.md) |
| `toIso()` | Turn an Instant or ZonedDateTime into an ISO 8601 string. | [details](references/conversion/to-iso.md) |
| `toIso9075()` | Turn an Instant or ZonedDateTime into a SQL datetime string. | [details](references/conversion/to-iso9075.md) |
| `toDate()` | Turn an Instant or ZonedDateTime into a JavaScript Date. | [details](references/conversion/to-date.md) |

## Current Time

| Function | Description | Reference |
|----------|-------------|-----------|
| `now()` | Get the current date and time in a timezone. | [details](references/current-time/now.md) |
| `today()` | Get today's date in a timezone, as a PlainDate. | [details](references/current-time/today.md) |

## Formatting

| Function | Description | Reference |
|----------|-------------|-----------|
| `format()` | Format a date or time as text using date-fns-style tokens. | [details](references/formatting/format.md) |
| `formatPlainDate()` | Format a calendar date as text using date-fns-style tokens. | [details](references/formatting/format-plain-date.md) |
| `simpleFormat()` | Format a date, a time, or both in a short human-friendly style. | [details](references/formatting/simple-format.md) |
| `intlFormatDistance()` | Describe the time between two moments, like "in 3 days" or "2 hours ago". | [details](references/formatting/intl-format-distance.md) |

## Arithmetic

| Function | Description | Reference |
|----------|-------------|-----------|
| `addYears()` | Add a number of years to a date or datetime. | [details](references/arithmetic/add-years.md) |
| `addQuarters()` | Add a number of quarters (3-month periods) to a date or datetime. | [details](references/arithmetic/add-quarters.md) |
| `addMonths()` | Add a number of months to a date or datetime. | [details](references/arithmetic/add-months.md) |
| `addWeeks()` | Add a number of weeks to a date or datetime. | [details](references/arithmetic/add-weeks.md) |
| `addDays()` | Add a number of calendar days to a date or datetime. | [details](references/arithmetic/add-days.md) |
| `addHours()` | Add a number of hours of elapsed time to a datetime. | [details](references/arithmetic/add-hours.md) |
| `addMinutes()` | Add a number of minutes to a datetime. | [details](references/arithmetic/add-minutes.md) |
| `addSeconds()` | Add a number of seconds to a datetime. | [details](references/arithmetic/add-seconds.md) |
| `addMilliseconds()` | Add a number of milliseconds to a datetime. | [details](references/arithmetic/add-milliseconds.md) |
| `addMicroseconds()` | Add a number of microseconds to a datetime. | [details](references/arithmetic/add-microseconds.md) |
| `addNanoseconds()` | Add a number of nanoseconds to a datetime. | [details](references/arithmetic/add-nanoseconds.md) |
| `subYears()` | Subtract a number of years from a date or datetime. | [details](references/arithmetic/sub-years.md) |
| `subQuarters()` | Subtract a number of quarters (3-month periods) from a date or datetime. | [details](references/arithmetic/sub-quarters.md) |
| `subMonths()` | Subtract a number of months from a date or datetime. | [details](references/arithmetic/sub-months.md) |
| `subWeeks()` | Subtract a number of weeks from a date or datetime. | [details](references/arithmetic/sub-weeks.md) |
| `subDays()` | Subtract a number of calendar days from a date or datetime. | [details](references/arithmetic/sub-days.md) |
| `subHours()` | Subtract a number of hours of elapsed time from a datetime. | [details](references/arithmetic/sub-hours.md) |
| `subMinutes()` | Subtract a number of minutes from a datetime. | [details](references/arithmetic/sub-minutes.md) |
| `subSeconds()` | Subtract a number of seconds from a datetime. | [details](references/arithmetic/sub-seconds.md) |
| `subMilliseconds()` | Subtract a number of milliseconds from a datetime. | [details](references/arithmetic/sub-milliseconds.md) |
| `subMicroseconds()` | Subtract a number of microseconds from a datetime. | [details](references/arithmetic/sub-microseconds.md) |
| `subNanoseconds()` | Subtract a number of nanoseconds from a datetime. | [details](references/arithmetic/sub-nanoseconds.md) |

## Boundaries

| Function | Description | Reference |
|----------|-------------|-----------|
| `startOfDay()` | Get the first moment of a day, in a given timezone. | [details](references/boundaries/start-of-day.md) |
| `endOfDay()` | Get the last nanosecond of a day, in a given timezone. | [details](references/boundaries/end-of-day.md) |
| `startOfWeek()` | Get the Monday that starts the week of a date or datetime. | [details](references/boundaries/start-of-week.md) |
| `endOfWeek()` | Get the Sunday that ends the week of a date or datetime. | [details](references/boundaries/end-of-week.md) |
| `startOfMonth()` | Get the first day of the month for a date or datetime. | [details](references/boundaries/start-of-month.md) |
| `endOfMonth()` | Get the last day of the month for a date or datetime. | [details](references/boundaries/end-of-month.md) |
| `startOfQuarter()` | Get the first day of the calendar quarter for a date or datetime. | [details](references/boundaries/start-of-quarter.md) |
| `endOfQuarter()` | Get the last day of the calendar quarter for a date or datetime. | [details](references/boundaries/end-of-quarter.md) |
| `startOfYear()` | Get 1 January of the year for a date or datetime. | [details](references/boundaries/start-of-year.md) |
| `endOfYear()` | Get 31 December of the year for a date or datetime. | [details](references/boundaries/end-of-year.md) |

## Rounding

| Function | Description | Reference |
|----------|-------------|-----------|
| `roundToNearestHour()` | Round a datetime to the hour, or to blocks of 2 to 12 hours. | [details](references/rounding/round-to-nearest-hour.md) |
| `roundToNearestMinute()` | Round a datetime to the minute, or to slots such as 5, 15, or 30 minutes. | [details](references/rounding/round-to-nearest-minute.md) |
| `roundToNearestSecond()` | Round a datetime to the second, or to intervals such as 10 or 30 seconds. | [details](references/rounding/round-to-nearest-second.md) |

## Comparison

| Function | Description | Reference |
|----------|-------------|-----------|
| `isBefore()` | Check whether one date, time, or timestamp comes before another. | [details](references/comparison/is-before.md) |
| `isAfter()` | Check whether one date, time, or timestamp comes after another. | [details](references/comparison/is-after.md) |
| `isEqual()` | Check whether two dates, times, or timestamps are the same. | [details](references/comparison/is-equal.md) |
| `isWithinInterval()` | Check whether a timestamp falls between a start and an end. | [details](references/comparison/is-within-interval.md) |
| `isFuture()` | Check whether a timestamp is later than the current moment. | [details](references/comparison/is-future.md) |
| `isPast()` | Check whether a timestamp is earlier than the current moment. | [details](references/comparison/is-past.md) |
| `isToday()` | Check whether a value falls on today's date in a timezone. | [details](references/comparison/is-today.md) |
| `isTomorrow()` | Check whether a value falls on tomorrow's date in a timezone. | [details](references/comparison/is-tomorrow.md) |
| `isYesterday()` | Check whether a value falls on yesterday's date in a timezone. | [details](references/comparison/is-yesterday.md) |
| `isSameDay()` | Check whether two timestamps fall on the same calendar day. | [details](references/comparison/is-same-day.md) |
| `isSameWeek()` | Check whether two timestamps fall in the same ISO week. | [details](references/comparison/is-same-week.md) |
| `isSameMonth()` | Check whether two timestamps fall in the same calendar month. | [details](references/comparison/is-same-month.md) |
| `isSameQuarter()` | Check whether two dates or timestamps fall in the same calendar quarter. | [details](references/comparison/is-same-quarter.md) |
| `isSameYear()` | Check whether two timestamps fall in the same calendar year. | [details](references/comparison/is-same-year.md) |
| `isSameHour()` | Check whether two timestamps fall in the same clock hour. | [details](references/comparison/is-same-hour.md) |
| `isSameMinute()` | Check whether two timestamps fall in the same clock minute. | [details](references/comparison/is-same-minute.md) |
| `isSameSecond()` | Check whether two timestamps fall in the same clock second. | [details](references/comparison/is-same-second.md) |
| `isSameMillisecond()` | Check whether two timestamps fall in the same millisecond. | [details](references/comparison/is-same-millisecond.md) |
| `isSameMicrosecond()` | Check whether two timestamps fall in the same microsecond. | [details](references/comparison/is-same-microsecond.md) |
| `isSameNanosecond()` | Check whether two timestamps have the same wall-clock reading. | [details](references/comparison/is-same-nanosecond.md) |
| `isPlainDateBefore()` | Check whether one calendar date comes before another. | [details](references/comparison/is-plain-date-before.md) |
| `isPlainDateAfter()` | Check whether one calendar date comes after another. | [details](references/comparison/is-plain-date-after.md) |
| `isPlainDateEqual()` | Check whether two calendar dates are the same day. | [details](references/comparison/is-plain-date-equal.md) |
| `isPlainTimeBefore()` | Check whether one wall-clock time comes before another. | [details](references/comparison/is-plain-time-before.md) |
| `isPlainTimeAfter()` | Check whether one wall-clock time comes after another. | [details](references/comparison/is-plain-time-after.md) |
| `isPlainTimeEqual()` | Check whether two wall-clock times are the same. | [details](references/comparison/is-plain-time-equal.md) |

## Sorting & Selection

| Function | Description | Reference |
|----------|-------------|-----------|
| `compareAsc()` | Comparator that sorts dates and times oldest first | [details](references/selection/compare-asc.md) |
| `compareDesc()` | Comparator that sorts dates and times newest first | [details](references/selection/compare-desc.md) |
| `min()` | Get the earliest date, time, or datetime in an array | [details](references/selection/min.md) |
| `max()` | Get the latest date, time, or datetime in an array | [details](references/selection/max.md) |
| `clamp()` | Keep a date, time, or datetime inside a range | [details](references/selection/clamp.md) |
| `closestTo()` | Find the date, time, or datetime nearest to a target | [details](references/selection/closest-to.md) |

## Difference

| Function | Description | Reference |
|----------|-------------|-----------|
| `differenceInYears()` | Count the full years between two dates or datetimes | [details](references/difference/difference-in-years.md) |
| `differenceInQuarters()` | Count the quarters (3-month blocks) between two dates or datetimes | [details](references/difference/difference-in-quarters.md) |
| `differenceInMonths()` | Count the calendar months between two dates or datetimes | [details](references/difference/difference-in-months.md) |
| `differenceInWeeks()` | Count the weeks between two dates or datetimes | [details](references/difference/difference-in-weeks.md) |
| `differenceInDays()` | Count the days between two dates or datetimes | [details](references/difference/difference-in-days.md) |
| `differenceInHours()` | Count the hours elapsed between two datetimes | [details](references/difference/difference-in-hours.md) |
| `differenceInMinutes()` | Count the minutes elapsed between two datetimes | [details](references/difference/difference-in-minutes.md) |
| `differenceInSeconds()` | Count the seconds elapsed between two datetimes | [details](references/difference/difference-in-seconds.md) |
| `differenceInMilliseconds()` | Count the milliseconds elapsed between two datetimes | [details](references/difference/difference-in-milliseconds.md) |
| `differenceInMicroseconds()` | Count the microseconds elapsed between two datetimes | [details](references/difference/difference-in-microseconds.md) |
| `differenceInNanoseconds()` | Get the exact nanoseconds between two datetimes as a bigint | [details](references/difference/difference-in-nanoseconds.md) |

## Business Days

| Function | Description | Reference |
|----------|-------------|-----------|
| `isWeekend()` | Check if a date falls on a Saturday or Sunday | [details](references/business-days/is-weekend.md) |
| `addBusinessDays()` | Add Monday–Friday days, skipping weekends | [details](references/business-days/add-business-days.md) |
| `subBusinessDays()` | Subtract Monday–Friday days, skipping weekends | [details](references/business-days/sub-business-days.md) |
| `differenceInBusinessDays()` | Count Monday–Friday days between two dates | [details](references/business-days/difference-in-business-days.md) |

## Intervals

| Function | Description | Reference |
|----------|-------------|-----------|
| `eachYearOfInterval()` | List 1 January of each year a range touches | [details](references/intervals/each-year-of-interval.md) |
| `eachQuarterOfInterval()` | List the first day of each quarter a range touches | [details](references/intervals/each-quarter-of-interval.md) |
| `eachMonthOfInterval()` | List the first day of each month a range touches | [details](references/intervals/each-month-of-interval.md) |
| `eachWeekOfInterval()` | List the Monday of each week a range touches | [details](references/intervals/each-week-of-interval.md) |
| `eachDayOfInterval()` | List every day from start to end, including both | [details](references/intervals/each-day-of-interval.md) |
| `eachHourOfInterval()` | List the start of every hour from start to end | [details](references/intervals/each-hour-of-interval.md) |
| `eachMinuteOfInterval()` | List the start of every minute from start to end | [details](references/intervals/each-minute-of-interval.md) |

## Utilities

| Function | Description | Reference |
|----------|-------------|-----------|
| `getQuarter()` | Get the calendar quarter (1 to 4) of a date or datetime. | [details](references/utilities/get-quarter.md) |
| `browserTimezone()` | Get the IANA timezone of the device running the code. | [details](references/utilities/browser-timezone.md) |

## Types

```ts
import type { Timezone, IANATimezone } from '@gobrand/tiempo';

// Timezone: suggested IANA names and UTC; arbitrary strings are also accepted
const tz: Timezone = 'America/New_York';  // Autocomplete for 400+ timezones

// IANATimezone: suggested identifiers plus arbitrary strings (including "UTC")
// These types provide autocomplete, not runtime timezone validation.
const iana: IANATimezone = 'Europe/London';
```
