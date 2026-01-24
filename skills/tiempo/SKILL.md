---
name: tiempo
description: Use when working with dates, times, timezones, or datetime conversions in TypeScript/JavaScript. Provides guidance on using the tiempo library for timezone-safe datetime handling with the Temporal API.
---

# tiempo - Timezone-Safe Datetime Handling

Lightweight utility library for timezone conversions built on the Temporal API.

```bash
npm install @gobrand/tiempo
```

## Best Practices

- **Always use explicit timezones** - Never rely on implicit timezone behavior. [details](references/best-practices/explicit-timezone.md)
- **Don't use JavaScript Date** - Use tiempo instead of Date for timezone work. [details](references/best-practices/no-js-date.md)
- **Store UTC, display local** - Backend stores UTC, frontend converts for display. [details](references/best-practices/utc-storage.md)

---

## Conversion

| Function | Description | Reference |
|----------|-------------|-----------|
| `toZonedTime(input, timezone)` | Convert UTC string/Date/Instant to timezone-aware ZonedDateTime | [details](references/conversion/to-zoned-time.md) |
| `toUtc(input)` | Convert ZonedDateTime to UTC Instant | [details](references/conversion/to-utc.md) |
| `toIso(input, options?)` | Convert to ISO 8601 string (e.g., "2025-01-20T15:00:00Z") | [details](references/conversion/to-iso.md) |
| `toIso9075(input, options?)` | Convert to SQL-compatible format (e.g., "2025-01-20 15:00:00") | [details](references/conversion/to-iso9075.md) |
| `toDate(input)` | Convert to JavaScript Date (for ORM compatibility) | [details](references/conversion/to-date.md) |

## Current Time

| Function | Description | Reference |
|----------|-------------|-----------|
| `now(timezone)` | Get current time as ZonedDateTime in specified timezone | [details](references/current-time/now.md) |
| `today(timezone)` | Get today's date as PlainDate in specified timezone | [details](references/current-time/today.md) |

## Utilities

| Function | Description | Reference |
|----------|-------------|-----------|
| `browserTimezone()` | Get browser's IANA timezone (e.g., "America/New_York") | [details](references/utilities/browser-timezone.md) |

## Formatting

| Function | Description | Reference |
|----------|-------------|-----------|
| `format(input, formatStr, options?)` | Format using date-fns tokens (yyyy-MM-dd, h:mm a, etc.) | [details](references/formatting/format.md) |
| `simpleFormat(input, pattern)` | Simple format with presets: "date", "time", "datetime" | [details](references/formatting/simple-format.md) |
| `formatPlainDate(date, formatStr, options?)` | Format a PlainDate using date-fns tokens | [details](references/formatting/format-plain-date.md) |
| `intlFormatDistance(date, base, options?)` | Relative time ("2 days ago", "in 3 hours") | [details](references/formatting/intl-format-distance.md) |

## Arithmetic

All arithmetic functions are DST-safe—they add calendar units, not fixed durations. [Overview](references/arithmetic/arithmetic-overview.md)

### Add Functions

| Function | Description |
|----------|-------------|
| `addYears(input, years)` | Add years to datetime |
| `addMonths(input, months)` | Add months (handles month boundaries) |
| `addWeeks(input, weeks)` | Add weeks |
| `addDays(input, days)` | Add calendar days (not 24-hour periods) - [DST example](references/arithmetic/add-days.md) |
| `addHours(input, hours)` | Add hours |
| `addMinutes(input, minutes)` | Add minutes |
| `addSeconds(input, seconds)` | Add seconds |
| `addMilliseconds/Microseconds/Nanoseconds` | Add sub-second units |

### Subtract Functions

| Function | Description |
|----------|-------------|
| `subYears/Months/Weeks/Days` | Subtract calendar units |
| `subHours/Minutes/Seconds` | Subtract time units |
| `subMilliseconds/Microseconds/Nanoseconds` | Subtract sub-second units |

## Boundaries

Get start/end of time periods. [Overview](references/boundaries/boundaries-overview.md)

| Function | Description |
|----------|-------------|
| `startOfDay(input)` | Get 00:00:00.000000000 of the day |
| `endOfDay(input)` | Get 23:59:59.999999999 of the day |
| `startOfWeek(input)` | Get start of week (Sunday) |
| `endOfWeek(input)` | Get end of week (Saturday) |
| `startOfMonth(input)` | Get first day of month at 00:00:00 |
| `endOfMonth(input)` | Get last day of month at 23:59:59 |
| `startOfYear(input)` | Get Jan 1 at 00:00:00 |
| `endOfYear(input)` | Get Dec 31 at 23:59:59 |

## Comparison

Compare datetimes or check if a datetime is past/future. [Overview](references/comparison/comparison-overview.md)

### Order Comparison

| Function | Description |
|----------|-------------|
| `isBefore(a, b)` | Check if a is before b |
| `isAfter(a, b)` | Check if a is after b |
| `isFuture(input)` | Check if datetime is in the future |
| `isPast(input)` | Check if datetime is in the past |

### Same Period Comparison

| Function | Description |
|----------|-------------|
| `isSameDay(a, b)` | Check if same calendar day |
| `isSameWeek(a, b)` | Check if same calendar week |
| `isSameMonth(a, b)` | Check if same calendar month |
| `isSameYear(a, b)` | Check if same calendar year |
| `isSameHour/Minute/Second` | Check if same hour/minute/second |
| `isSameMillisecond/Microsecond/Nanosecond` | Check if same sub-second unit |

### PlainDate Comparison

| Function | Description |
|----------|-------------|
| `isPlainDateBefore(a, b)` | Check if PlainDate a is before b |
| `isPlainDateAfter(a, b)` | Check if PlainDate a is after b |
| `isPlainDateEqual(a, b)` | Check if PlainDates are equal |

## Difference

Calculate the difference between two datetimes. [Overview](references/difference/difference-overview.md)

| Function | Description |
|----------|-------------|
| `differenceInYears(later, earlier)` | Get difference in years |
| `differenceInMonths(later, earlier)` | Get difference in months |
| `differenceInWeeks(later, earlier)` | Get difference in weeks |
| `differenceInDays(later, earlier)` | Get difference in days (DST-aware) |
| `differenceInHours(later, earlier)` | Get difference in hours |
| `differenceInMinutes(later, earlier)` | Get difference in minutes |
| `differenceInSeconds(later, earlier)` | Get difference in seconds |
| `differenceInMilliseconds/Microseconds/Nanoseconds` | Get sub-second differences |

## Types

```ts
import type { Timezone, IANATimezone } from '@gobrand/tiempo';

// Timezone: accepts IANA timezones + "UTC"
const tz: Timezone = 'America/New_York';  // Autocomplete for 400+ timezones

// IANATimezone: strictly IANA identifiers (excludes "UTC")
const iana: IANATimezone = 'Europe/London';
```
