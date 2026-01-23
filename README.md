# @gobrand/tiempo

[![npm version](https://img.shields.io/npm/v/@gobrand/tiempo.svg)](https://www.npmjs.com/package/@gobrand/tiempo)
[![CI](https://github.com/go-brand/tiempo/actions/workflows/ci.yml/badge.svg)](https://github.com/go-brand/tiempo/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Comprehensive datetime utilities for the [Temporal API](https://tc39.es/proposal-temporal/docs/). Full timezone support, nanosecond precision, and a familiar API.

## Installation

```bash
npm install @gobrand/tiempo
# or
pnpm add @gobrand/tiempo
# or
yarn add @gobrand/tiempo
```

## Why tiempo?

The Temporal API is powerful but requires understanding its various methods and objects. **tiempo** (`@gobrand/tiempo`) provides intuitive utilities for every datetime task:

- **🌍 Timezone conversions** - Convert between UTC and any timezone effortlessly
- **➕ Complete arithmetic** - Add/subtract any time unit from nanoseconds to years
- **📅 Calendar operations** - Start/end of day, week, month, year with DST handling
- **🔍 Comparisons** - Check if dates are before, after, same day, future, or past
- **📊 Differences** - Calculate precise differences in any time unit
- **🎨 Formatting** - Format dates with date-fns-style tokens or Intl
- **⚡️ Type-safe** - Full TypeScript support with proper Temporal types
- **🎯 Zero config** - Simple, direct function signatures

**Key features:**
- ✅ Native timezone support with Temporal API
- ✅ DST transitions handled automatically
- ✅ Nanosecond precision (beyond milliseconds)
- ✅ Calendar-aware arithmetic (leap years, month-end dates)
- ✅ Familiar date-fns-style API, built for the future

**Perfect for:**
- Social media scheduling apps
- Calendar applications
- Booking systems
- Time tracking tools
- Analytics dashboards
- Any app that needs to handle user timezones

## Quick Start

```typescript
import { toZonedTime, toUtcString, toUtc, toDate } from '@gobrand/tiempo';

// From ISO string (typical backend API)
const zoned = toZonedTime("2025-01-20T20:00:00.000Z", "America/New_York");
console.log(zoned.hour); // 15 (3 PM in New York)

// From Date object (e.g., Drizzle ORM)
const date = new Date("2025-01-20T20:00:00.000Z");
const zonedFromDate = toZonedTime(date, "America/New_York");
console.log(zonedFromDate.hour); // 15 (3 PM in New York)

// Back to ISO string
const utcString = toUtcString(zoned);
console.log(utcString); // "2025-01-20T20:00:00Z"

// Back to Date object (for Drizzle ORM)
const backToDate = toDate(zoned);
console.log(backToDate.toISOString()); // "2025-01-20T20:00:00.000Z"
```

## API

### Core Conversions

#### `toZonedTime(input, timezone)`

Convert a UTC ISO string, Date, Instant, or ZonedDateTime to a ZonedDateTime in the specified timezone.

**Parameters:**
- `input` (string | Date | Temporal.Instant | Temporal.ZonedDateTime): A UTC ISO 8601 string, Date object, Temporal.Instant, or Temporal.ZonedDateTime
- `timezone` (string): An IANA timezone identifier (e.g., `"America/New_York"`, `"Europe/London"`)

**Returns:** `Temporal.ZonedDateTime` - The same instant in the specified timezone

**Example:**
```typescript
import { toZonedTime } from '@gobrand/tiempo';

// From ISO string
const zoned = toZonedTime("2025-01-20T20:00:00.000Z", "America/New_York");
console.log(zoned.hour); // 15 (3 PM in New York)
console.log(zoned.toString()); // "2025-01-20T15:00:00-05:00[America/New_York]"

// From Date (e.g., from Drizzle ORM)
const date = new Date("2025-01-20T20:00:00.000Z");
const zoned2 = toZonedTime(date, "America/New_York");
console.log(zoned2.hour); // 15 (3 PM in New York)

// From Instant
const instant = Temporal.Instant.from("2025-01-20T20:00:00Z");
const zoned3 = toZonedTime(instant, "Asia/Tokyo");

// From ZonedDateTime (convert to different timezone)
const nyTime = Temporal.ZonedDateTime.from("2025-01-20T15:00:00-05:00[America/New_York]");
const tokyoTime = toZonedTime(nyTime, "Asia/Tokyo");
```

#### `toUtc(input)`

Convert a UTC ISO string, Date, or ZonedDateTime to a Temporal.Instant (UTC).

**Parameters:**
- `input` (string | Date | Temporal.ZonedDateTime): A UTC ISO 8601 string, Date object, or Temporal.ZonedDateTime

**Returns:** `Temporal.Instant` - A Temporal.Instant representing the same moment in UTC

**Example:**
```typescript
import { toUtc } from '@gobrand/tiempo';

// From ISO string
const instant = toUtc("2025-01-20T20:00:00.000Z");

// From Date (e.g., from Drizzle ORM)
const date = new Date("2025-01-20T20:00:00.000Z");
const instant2 = toUtc(date);

// From ZonedDateTime
const zoned = Temporal.ZonedDateTime.from("2025-01-20T15:00:00-05:00[America/New_York]");
const instant3 = toUtc(zoned);
// All represent the same UTC moment: 2025-01-20T20:00:00Z
```

#### `toUtcString(input)`

Convert a Temporal.Instant or ZonedDateTime to a UTC ISO 8601 string.

**Parameters:**
- `input` (Temporal.Instant | Temporal.ZonedDateTime): A Temporal.Instant or Temporal.ZonedDateTime

**Returns:** `string` - A UTC ISO 8601 string representation

**Example:**
```typescript
import { toUtcString } from '@gobrand/tiempo';

// From ZonedDateTime
const zoned = Temporal.ZonedDateTime.from("2025-01-20T15:00:00-05:00[America/New_York]");
const iso = toUtcString(zoned);
console.log(iso); // "2025-01-20T20:00:00Z"

// From Instant
const instant = Temporal.Instant.from("2025-01-20T20:00:00Z");
const iso2 = toUtcString(instant);
console.log(iso2); // "2025-01-20T20:00:00Z"
```

#### `toDate(input)`

Convert a Temporal.Instant or ZonedDateTime to a Date object.

**Parameters:**
- `input` (Temporal.Instant | Temporal.ZonedDateTime): A Temporal.Instant or Temporal.ZonedDateTime

**Returns:** `Date` - A Date object representing the same moment in time

**Example:**
```typescript
import { toDate } from '@gobrand/tiempo';

// From Instant
const instant = Temporal.Instant.from("2025-01-20T20:00:00Z");
const date = toDate(instant);
console.log(date.toISOString()); // "2025-01-20T20:00:00.000Z"

// From ZonedDateTime
const zoned = Temporal.ZonedDateTime.from("2025-01-20T15:00:00-05:00[America/New_York]");
const date2 = toDate(zoned);
console.log(date2.toISOString()); // "2025-01-20T20:00:00.000Z"

// Use with Drizzle ORM (for storing back to database)
const instant = Temporal.Instant.from("2025-01-20T20:00:00Z");
const dateForDb = toDate(instant);
await db.update(posts).set({ publishedAt: dateForDb });
```

### Formatting

#### `intlFormatDistance(laterDate, earlierDate, options?)`

Format the distance between two dates as a human-readable, internationalized string using `Intl.RelativeTimeFormat`. Automatically selects the most appropriate unit (seconds, minutes, hours, days, weeks, months, years) based on the distance.

**Parameters:**
- `laterDate` (Temporal.Instant | Temporal.ZonedDateTime): The later date to compare
- `earlierDate` (Temporal.Instant | Temporal.ZonedDateTime): The earlier date to compare with
- `options` (IntlFormatDistanceOptions, optional): Formatting options
  - `unit` (Intl.RelativeTimeFormatUnit): Force a specific unit instead of automatic selection
  - `locale` (string | string[]): Locale for formatting (default: system locale)
  - `numeric` ('always' | 'auto'): Use numeric values always or allow natural language like "tomorrow" (default: 'auto')
  - `style` ('long' | 'short' | 'narrow'): Formatting style (default: 'long')
  - `localeMatcher` ('best fit' | 'lookup'): Locale matching algorithm

**Returns:** `string` - Formatted relative time string

**Automatic unit selection:**
- < 60 seconds → "in X seconds" / "X seconds ago"
- < 60 minutes → "in X minutes" / "X minutes ago"
- < 24 hours → "in X hours" / "X hours ago"
- < 7 days → "tomorrow" / "yesterday" / "in X days" / "X days ago"
- < 4 weeks → "next week" / "last week" / "in X weeks" / "X weeks ago"
- < 12 months → "next month" / "last month" / "in X months" / "X months ago"
- ≥ 12 months → "next year" / "last year" / "in X years" / "X years ago"

**Example:**
```typescript
import { intlFormatDistance } from '@gobrand/tiempo';

const later = Temporal.Instant.from('2025-01-20T12:00:00Z');
const earlier = Temporal.Instant.from('2025-01-20T11:00:00Z');

// Basic usage
intlFormatDistance(later, earlier);
// => "in 1 hour"

intlFormatDistance(earlier, later);
// => "1 hour ago"

// With different locales
intlFormatDistance(later, earlier, { locale: 'es' });
// => "dentro de 1 hora"

intlFormatDistance(later, earlier, { locale: 'ja' });
// => "1 時間後"

// Force numeric format
const tomorrow = Temporal.Instant.from('2025-01-21T00:00:00Z');
const today = Temporal.Instant.from('2025-01-20T00:00:00Z');

intlFormatDistance(tomorrow, today, { numeric: 'auto' });
// => "tomorrow"

intlFormatDistance(tomorrow, today, { numeric: 'always' });
// => "in 1 day"

// Different styles
const future = Temporal.Instant.from('2027-01-20T00:00:00Z');
const now = Temporal.Instant.from('2025-01-20T00:00:00Z');

intlFormatDistance(future, now, { style: 'long' });
// => "in 2 years"

intlFormatDistance(future, now, { style: 'short' });
// => "in 2 yr."

intlFormatDistance(future, now, { style: 'narrow' });
// => "in 2y"

// Force specific units
intlFormatDistance(future, now, { unit: 'quarter' });
// => "in 8 quarters"

const dayLater = Temporal.Instant.from('2025-01-21T00:00:00Z');
intlFormatDistance(dayLater, today, { unit: 'hour' });
// => "in 24 hours"
```

#### `format(input, formatStr, options?)`

Format a Temporal.Instant or ZonedDateTime using date-fns-like format tokens.

**Parameters:**
- `input` (Temporal.Instant | Temporal.ZonedDateTime): A Temporal.Instant or Temporal.ZonedDateTime to format
- `formatStr` (string): Format string using date-fns tokens (e.g., "yyyy-MM-dd HH:mm:ss")
- `options` (FormatOptions, optional): Configuration for locale and timezone
  - `locale` (string): BCP 47 language tag (default: "en-US")
  - `timeZone` (string): IANA timezone identifier to convert to before formatting

**Returns:** `string` - Formatted date string

**Supported tokens:**
- **Year**: `yyyy` (2025), `yy` (25), `y` (2025)
- **Month**: `MMMM` (January), `MMM` (Jan), `MM` (01), `M` (1), `Mo` (1st)
- **Day**: `dd` (20), `d` (20), `do` (20th)
- **Weekday**: `EEEE` (Monday), `EEE` (Mon), `EEEEE` (M)
- **Hour**: `HH` (15, 24h), `H` (15), `hh` (03, 12h), `h` (3)
- **Minute**: `mm` (30), `m` (30)
- **Second**: `ss` (45), `s` (45)
- **AM/PM**: `a` (PM), `aa` (PM), `aaa` (pm), `aaaa` (p.m.), `aaaaa` (p)
- **Timezone**: `xxx` (-05:00), `xx` (-0500), `XXX` (Z or -05:00), `zzzz` (Eastern Standard Time)
- **Quarter**: `Q` (1), `QQQ` (Q1), `QQQQ` (1st quarter)
- **Milliseconds**: `SSS` (123)
- **Timestamp**: `T` (milliseconds), `t` (seconds)
- **Escape text**: Use single quotes `'...'`, double single quotes `''` for literal quote

**Example:**
```typescript
import { format, toZonedTime, toUtc } from '@gobrand/tiempo';

// From ISO string to ZonedDateTime, then format
const isoString = "2025-01-20T20:30:45.000Z";
const zoned = toZonedTime(isoString, "America/New_York");

format(zoned, "yyyy-MM-dd"); // "2025-01-20"
format(zoned, "MMMM d, yyyy"); // "January 20, 2025"
format(zoned, "h:mm a"); // "3:30 PM"
format(zoned, "EEEE, MMMM do, yyyy 'at' h:mm a"); // "Monday, January 20th, 2025 at 3:30 PM"

// With locale
format(zoned, "MMMM d, yyyy", { locale: "es-ES" }); // "enero 20, 2025"
format(zoned, "EEEE", { locale: "fr-FR" }); // "lundi"

// From ISO string to Instant (UTC), then format with timezone conversion
const instant = toUtc(isoString);
format(instant, "yyyy-MM-dd HH:mm", { timeZone: "America/New_York" }); // "2025-01-20 15:30"
format(instant, "yyyy-MM-dd HH:mm", { timeZone: "Asia/Tokyo" }); // "2025-01-21 05:30"
```

#### `formatPlainDate(date, formatStr, options?)`

Format a Temporal.PlainDate using date-fns-like format tokens. Only supports date-related tokens (no time or timezone tokens).

**Parameters:**
- `date` (Temporal.PlainDate): A Temporal.PlainDate to format
- `formatStr` (string): Format string using date-fns tokens (e.g., "yyyy-MM-dd")
- `options` (FormatPlainDateOptions, optional): Configuration for locale
  - `locale` (string): BCP 47 language tag (default: "en-US")

**Returns:** `string` - Formatted date string

**Supported tokens:**
- **Year**: `yyyy` (2025), `yy` (25), `y` (2025)
- **Month**: `MMMM` (January), `MMM` (Jan), `MM` (01), `M` (1), `Mo` (1st)
- **Day**: `dd` (20), `d` (20), `do` (20th)
- **Weekday**: `EEEE` (Monday), `EEE` (Mon), `EEEEE` (M)
- **Quarter**: `Q` (1), `QQQ` (Q1), `QQQQ` (1st quarter)
- **Era**: `G` (AD), `GGGG` (Anno Domini)
- **Escape text**: Use single quotes `'...'`, double single quotes `''` for literal quote

**Example:**
```typescript
import { formatPlainDate, today } from '@gobrand/tiempo';

const date = Temporal.PlainDate.from("2025-01-20");

formatPlainDate(date, "yyyy-MM-dd"); // "2025-01-20"
formatPlainDate(date, "MMMM d, yyyy"); // "January 20, 2025"
formatPlainDate(date, "EEEE, MMMM do, yyyy"); // "Monday, January 20th, 2025"
formatPlainDate(date, "MM/dd/yyyy"); // "01/20/2025"

// With locale
formatPlainDate(date, "MMMM d, yyyy", { locale: "es-ES" }); // "enero 20, 2025"
formatPlainDate(date, "EEEE", { locale: "de-DE" }); // "Montag"

// Use with today()
const todayFormatted = formatPlainDate(today(), "EEEE, MMMM do");
// "Thursday, January 23rd"
```

#### `simpleFormat(input, options?)`

Format a Temporal date in a human-friendly way: "Dec 23" or "Dec 23, 2020". By default, shows the year only if the date is not in the current year. Optionally includes time in 12-hour or 24-hour format.

**Parameters:**
- `input` (Temporal.PlainDate | Temporal.ZonedDateTime | Temporal.Instant): The date to format
- `options` (object, optional): Formatting options
  - `locale` (string): BCP 47 language tag (default: "en-US")
  - `year` ('auto' | 'always' | 'never'): Control year display (default: 'auto')
  - `time` ('12h' | '24h'): Include time in output (not available for PlainDate)
  - `timeZone` (string): IANA timezone identifier (required for Instant, optional for ZonedDateTime)

**Returns:** `string` - Human-friendly formatted date string

**Example:**
```typescript
import { simpleFormat, today, now } from '@gobrand/tiempo';

// Assuming current year is 2026
const date2026 = Temporal.ZonedDateTime.from("2026-12-23T15:30:00[America/New_York]");
const date2020 = Temporal.ZonedDateTime.from("2020-12-23T15:30:00[America/New_York]");

// Basic usage - year shown only for past years
simpleFormat(date2026); // "Dec 23"
simpleFormat(date2020); // "Dec 23, 2020"

// With time
simpleFormat(date2026, { time: '12h' }); // "Dec 23, 3:30 PM"
simpleFormat(date2026, { time: '24h' }); // "Dec 23, 15:30"

// Control year display
simpleFormat(date2026, { year: 'always' }); // "Dec 23, 2026"
simpleFormat(date2020, { year: 'never' }); // "Dec 23"

// With Instant (timeZone required)
const instant = Temporal.Instant.from("2026-12-23T20:30:00Z");
simpleFormat(instant, { timeZone: 'America/New_York' }); // "Dec 23"
simpleFormat(instant, { timeZone: 'America/New_York', time: '12h' }); // "Dec 23, 3:30 PM"

// With PlainDate (no time option available)
const plain = Temporal.PlainDate.from("2020-12-23");
simpleFormat(plain); // "Dec 23, 2020"

// Different locales
simpleFormat(date2020, { locale: 'es-ES' }); // "23 dic 2020"
simpleFormat(date2020, { locale: 'de-DE' }); // "23. Dez. 2020"
```

### Start/End Utilities

#### `today(timezone?)`

Get today's date in the system's local timezone or a specified timezone.

**Parameters:**
- `timezone` (string, optional): An IANA timezone identifier (e.g., `"America/New_York"`, `"Europe/Madrid"`) or `"UTC"`. If not provided, uses the system's local timezone.

**Returns:** `Temporal.PlainDate` - A Temporal.PlainDate representing today's date

**Example:**
```typescript
import { today } from '@gobrand/tiempo';

const date = today(); // 2025-01-20
date.year;      // 2025
date.month;     // 1
date.day;       // 20

// Get today in a specific timezone
const dateInTokyo = today("Asia/Tokyo"); // 2025-01-21 (next day due to timezone)
```

#### `now(timezone?)`

Get the current date and time in the system's local timezone or a specified timezone.

**Parameters:**
- `timezone` (string, optional): An IANA timezone identifier (e.g., `"America/New_York"`, `"Europe/Madrid"`) or `"UTC"`. If not provided, uses the system's local timezone.

**Returns:** `Temporal.ZonedDateTime` - A Temporal.ZonedDateTime representing the current date and time

**Example:**
```typescript
import { now } from '@gobrand/tiempo';

const current = now(); // 2025-01-20T15:30:45.123-05:00[America/New_York]
current.hour;   // 15
current.minute; // 30

// Get current time in a specific timezone
const currentInTokyo = now("Asia/Tokyo"); // 2025-01-21T05:30:45.123+09:00[Asia/Tokyo]
```

#### `startOfDay(input)` / `endOfDay(input)`

Get the start or end of the day for a given datetime.

```typescript
import { startOfDay, endOfDay } from '@gobrand/tiempo';

const zoned = Temporal.ZonedDateTime.from('2025-01-20T15:30:00-05:00[America/New_York]');

startOfDay(zoned); // 2025-01-20T00:00:00-05:00[America/New_York]
endOfDay(zoned);   // 2025-01-20T23:59:59.999999999-05:00[America/New_York]
```

#### `startOfWeek(input)` / `endOfWeek(input)`

Get the start or end of the week. Uses ISO 8601 week definition (Monday to Sunday).

```typescript
import { startOfWeek, endOfWeek } from '@gobrand/tiempo';

const zoned = Temporal.ZonedDateTime.from('2025-01-20T15:30:00-05:00[America/New_York]'); // Monday

startOfWeek(zoned); // 2025-01-20T00:00:00-05:00[America/New_York] (Monday)
endOfWeek(zoned);   // 2025-01-26T23:59:59.999999999-05:00[America/New_York] (Sunday)
```

#### `startOfMonth(input)` / `endOfMonth(input)`

Get the start or end of the month.

```typescript
import { startOfMonth, endOfMonth } from '@gobrand/tiempo';

const zoned = Temporal.ZonedDateTime.from('2025-01-20T15:30:00-05:00[America/New_York]');

startOfMonth(zoned); // 2025-01-01T00:00:00-05:00[America/New_York]
endOfMonth(zoned);   // 2025-01-31T23:59:59.999999999-05:00[America/New_York]
```

#### `startOfYear(input)` / `endOfYear(input)`

Get the start or end of the year.

```typescript
import { startOfYear, endOfYear } from '@gobrand/tiempo';

const zoned = Temporal.ZonedDateTime.from('2025-01-20T15:30:00-05:00[America/New_York]');

startOfYear(zoned); // 2025-01-01T00:00:00-05:00[America/New_York]
endOfYear(zoned);   // 2025-12-31T23:59:59.999999999-05:00[America/New_York]
```

### Addition/Subtraction Utilities

tiempo provides comprehensive datetime arithmetic functions for all time units, from nanoseconds to years. All functions:
- Accept `Temporal.Instant` or `Temporal.ZonedDateTime` as input
- Return `Temporal.ZonedDateTime` preserving the original timezone
- Properly handle DST transitions, leap years, and month-end edge cases
- Support negative values for subtraction

#### Addition Functions

##### `addYears(input, years)` / `addMonths(input, months)` / `addWeeks(input, weeks)` / `addDays(input, days)`

Add calendar units (years, months, weeks, or days) to a datetime.

```typescript
import { addYears, addMonths, addWeeks, addDays } from '@gobrand/tiempo';

const date = Temporal.Instant.from('2025-01-20T12:00:00Z');

addYears(date, 2);   // 2027-01-20T12:00:00Z[UTC] (2 years later)
addMonths(date, 3);  // 2025-04-20T12:00:00Z[UTC] (3 months later)
addWeeks(date, 2);   // 2025-02-03T12:00:00Z[UTC] (2 weeks later)
addDays(date, 5);    // 2025-01-25T12:00:00Z[UTC] (5 days later)

// Handle month-end edge cases automatically
const endOfJan = Temporal.Instant.from('2025-01-31T12:00:00Z');
addMonths(endOfJan, 1); // 2025-02-28T12:00:00Z[UTC] (Jan 31 → Feb 28)

// Negative values subtract
addMonths(date, -3); // 2024-10-20T12:00:00Z[UTC] (3 months earlier)
```

##### `addHours(input, hours)` / `addMinutes(input, minutes)` / `addSeconds(input, seconds)`

Add time units (hours, minutes, or seconds) to a datetime.

```typescript
import { addHours, addMinutes, addSeconds } from '@gobrand/tiempo';

const time = Temporal.Instant.from('2025-01-20T12:00:00Z');

addHours(time, 3);    // 2025-01-20T15:00:00Z[UTC] (3 hours later)
addMinutes(time, 30); // 2025-01-20T12:30:00Z[UTC] (30 minutes later)
addSeconds(time, 45); // 2025-01-20T12:00:45Z[UTC] (45 seconds later)

// Works with ZonedDateTime and preserves timezone
const ny = Temporal.ZonedDateTime.from('2025-01-20T15:00:00-05:00[America/New_York]');
addHours(ny, 2); // 2025-01-20T17:00:00-05:00[America/New_York]
```

##### `addMilliseconds(input, ms)` / `addMicroseconds(input, μs)` / `addNanoseconds(input, ns)`

Add sub-second precision units (milliseconds, microseconds, or nanoseconds) to a datetime.

```typescript
import { addMilliseconds, addMicroseconds, addNanoseconds } from '@gobrand/tiempo';

const precise = Temporal.Instant.from('2025-01-20T12:00:00Z');

addMilliseconds(precise, 500); // 2025-01-20T12:00:00.500Z[UTC]
addMicroseconds(precise, 500); // 2025-01-20T12:00:00.000500Z[UTC]
addNanoseconds(precise, 500);  // 2025-01-20T12:00:00.000000500Z[UTC]
```

#### Subtraction Functions

All subtraction functions are convenience wrappers that call their corresponding addition functions with negated values.

##### `subYears(input, years)` / `subMonths(input, months)` / `subWeeks(input, weeks)` / `subDays(input, days)`

```typescript
import { subYears, subMonths, subWeeks, subDays } from '@gobrand/tiempo';

const date = Temporal.Instant.from('2025-01-20T12:00:00Z');

subYears(date, 2);  // 2023-01-20T12:00:00Z[UTC] (2 years earlier)
subMonths(date, 3); // 2024-10-20T12:00:00Z[UTC] (3 months earlier)
subWeeks(date, 2);  // 2025-01-06T12:00:00Z[UTC] (2 weeks earlier)
subDays(date, 5);   // 2025-01-15T12:00:00Z[UTC] (5 days earlier)
```

##### `subHours(input, hours)` / `subMinutes(input, minutes)` / `subSeconds(input, seconds)`

```typescript
import { subHours, subMinutes, subSeconds } from '@gobrand/tiempo';

const time = Temporal.Instant.from('2025-01-20T12:00:00Z');

subHours(time, 3);    // 2025-01-20T09:00:00Z[UTC] (3 hours earlier)
subMinutes(time, 30); // 2025-01-20T11:30:00Z[UTC] (30 minutes earlier)
subSeconds(time, 45); // 2025-01-20T11:59:15Z[UTC] (45 seconds earlier)
```

##### `subMilliseconds(input, ms)` / `subMicroseconds(input, μs)` / `subNanoseconds(input, ns)`

```typescript
import { subMilliseconds, subMicroseconds, subNanoseconds } from '@gobrand/tiempo';

const precise = Temporal.Instant.from('2025-01-20T12:00:00.500Z');

subMilliseconds(precise, 250); // 2025-01-20T12:00:00.250Z[UTC]
subMicroseconds(precise, 250); // 2025-01-20T12:00:00.499750Z[UTC]
subNanoseconds(precise, 250);  // 2025-01-20T12:00:00.499999750Z[UTC]
```

#### Real-world Example: Meeting Scheduler

```typescript
import {
  toZonedTime,
  addDays,
  addMinutes,
  format
} from '@gobrand/tiempo';

// User's current meeting time
const meeting = toZonedTime('2025-01-20T15:00:00Z', 'America/New_York');
// 2025-01-20T10:00:00-05:00[America/New_York] (10 AM in NY)

// Reschedule to tomorrow, same time
const tomorrow = addDays(meeting, 1);
format(tomorrow, 'EEEE, MMMM do'); // "Tuesday, January 21st"

// Add 30-minute buffer before the meeting
const arriveBy = subMinutes(tomorrow, 30);
format(arriveBy, 'h:mm a'); // "9:30 AM"

// Schedule follow-up 2 weeks later
const followUp = addWeeks(tomorrow, 2);
format(followUp, 'MMM d'); // "Feb 4"
```

### Comparison Utilities

#### `isBefore(date1, date2)` / `isAfter(date1, date2)`

Check if the first datetime is before or after the second. Compares the underlying instant in time.

```typescript
import { isBefore, isAfter } from '@gobrand/tiempo';

const earlier = Temporal.ZonedDateTime.from('2025-01-20T10:00:00-05:00[America/New_York]');
const later = Temporal.ZonedDateTime.from('2025-01-20T15:00:00-05:00[America/New_York]');

isBefore(earlier, later); // true
isBefore(later, earlier); // false

isAfter(later, earlier); // true
isAfter(earlier, later); // false
```

### Difference Utilities

All difference functions compare the underlying instant in time and return a positive value if laterDate is after earlierDate, negative if before.

#### Time-based precision (instant comparison)

##### `differenceInNanoseconds(laterDate, earlierDate)`

Returns the difference in nanoseconds as a BigInt. Provides the highest precision available in Temporal.

```typescript
import { differenceInNanoseconds } from '@gobrand/tiempo';

const later = Temporal.Instant.from('2025-01-20T12:30:20.000000500Z');
const earlier = Temporal.Instant.from('2025-01-20T12:30:20.000000000Z');
differenceInNanoseconds(later, earlier); // 500n
```

##### `differenceInMicroseconds(laterDate, earlierDate)`

Returns the difference in microseconds (1/1,000,000 second).

```typescript
import { differenceInMicroseconds } from '@gobrand/tiempo';

const later = Temporal.Instant.from('2025-01-20T12:30:20.001000Z');
const earlier = Temporal.Instant.from('2025-01-20T12:30:20.000000Z');
differenceInMicroseconds(later, earlier); // 1000
```

##### `differenceInMilliseconds(laterDate, earlierDate)`

Returns the difference in milliseconds (1/1,000 second).

```typescript
import { differenceInMilliseconds } from '@gobrand/tiempo';

const later = Temporal.Instant.from('2025-01-20T12:30:21.700Z');
const earlier = Temporal.Instant.from('2025-01-20T12:30:20.600Z');
differenceInMilliseconds(later, earlier); // 1100
```

##### `differenceInSeconds(laterDate, earlierDate)`

Returns the difference in seconds (truncates sub-second precision).

```typescript
import { differenceInSeconds } from '@gobrand/tiempo';

const later = Temporal.Instant.from('2025-01-20T12:30:25Z');
const earlier = Temporal.Instant.from('2025-01-20T12:30:20Z');
differenceInSeconds(later, earlier); // 5
```

##### `differenceInMinutes(laterDate, earlierDate)`

Returns the difference in minutes (truncates sub-minute precision).

```typescript
import { differenceInMinutes } from '@gobrand/tiempo';

const later = Temporal.Instant.from('2025-01-20T12:45:00Z');
const earlier = Temporal.Instant.from('2025-01-20T12:30:00Z');
differenceInMinutes(later, earlier); // 15
```

##### `differenceInHours(laterDate, earlierDate)`

Returns the difference in hours (truncates sub-hour precision).

```typescript
import { differenceInHours } from '@gobrand/tiempo';

const later = Temporal.Instant.from('2025-01-20T18:00:00Z');
const earlier = Temporal.Instant.from('2025-01-20T15:00:00Z');
differenceInHours(later, earlier); // 3
```

#### Calendar-aware precision

These functions use Temporal's `until()` method to account for variable-length calendar units.

##### `differenceInDays(laterDate, earlierDate)`

Returns the difference in days. Calendar-aware, so it properly handles DST transitions where days can be 23, 24, or 25 hours.

```typescript
import { differenceInDays } from '@gobrand/tiempo';

const later = Temporal.Instant.from('2025-01-25T12:00:00Z');
const earlier = Temporal.Instant.from('2025-01-20T12:00:00Z');
differenceInDays(later, earlier); // 5

// Handles DST transitions correctly
const afterDst = Temporal.ZonedDateTime.from('2025-03-10T12:00:00-04:00[America/New_York]');
const beforeDst = Temporal.ZonedDateTime.from('2025-03-08T12:00:00-05:00[America/New_York]');
differenceInDays(afterDst, beforeDst); // 2 (calendar days, not 48 hours)
```

##### `differenceInWeeks(laterDate, earlierDate)`

Returns the difference in weeks (7-day periods).

```typescript
import { differenceInWeeks } from '@gobrand/tiempo';

const later = Temporal.Instant.from('2025-02-10T12:00:00Z');
const earlier = Temporal.Instant.from('2025-01-20T12:00:00Z');
differenceInWeeks(later, earlier); // 3
```

##### `differenceInMonths(laterDate, earlierDate)`

Returns the difference in months. Calendar-aware, properly handling months with different numbers of days (28-31).

```typescript
import { differenceInMonths } from '@gobrand/tiempo';

const later = Temporal.Instant.from('2025-04-20T12:00:00Z');
const earlier = Temporal.Instant.from('2025-01-20T12:00:00Z');
differenceInMonths(later, earlier); // 3
```

##### `differenceInYears(laterDate, earlierDate)`

Returns the difference in years. Calendar-aware, properly handling leap years (366 days) and regular years (365 days).

```typescript
import { differenceInYears } from '@gobrand/tiempo';

const later = Temporal.Instant.from('2028-01-20T12:00:00Z');
const earlier = Temporal.Instant.from('2025-01-20T12:00:00Z');
differenceInYears(later, earlier); // 3

// Calculate age
const today = Temporal.ZonedDateTime.from('2025-01-20T12:00:00Z[UTC]');
const birthdate = Temporal.ZonedDateTime.from('1990-01-20T12:00:00Z[UTC]');
differenceInYears(today, birthdate); // 35
```

#### `isFuture(date)` / `isPast(date)`

Check if a datetime is in the future or past relative to the current moment. Compares against `Temporal.Now.instant()`.

```typescript
import { isFuture, isPast } from '@gobrand/tiempo';

const tomorrow = Temporal.Now.zonedDateTimeISO().add({ days: 1 });
const yesterday = Temporal.Now.zonedDateTimeISO().subtract({ days: 1 });

isFuture(tomorrow); // true
isFuture(yesterday); // false

isPast(yesterday); // true
isPast(tomorrow); // false
```

#### `isSameDay(date1, date2)`

Check if two datetimes fall on the same calendar day. Compares year, month, and day fields directly.

**Important:** For ZonedDateTime inputs with different timezones, each date is compared in its own timezone. Convert to a common timezone first if you need a specific perspective.

```typescript
import { isSameDay } from '@gobrand/tiempo';

// Same timezone, same day
const morning = Temporal.ZonedDateTime.from('2025-01-20T08:00:00Z[UTC]');
const evening = Temporal.ZonedDateTime.from('2025-01-20T23:00:00Z[UTC]');
isSameDay(morning, evening); // true

// Different timezones - compares in their respective timezones
const ny = Temporal.ZonedDateTime.from('2025-01-20T23:00:00-05:00[America/New_York]');
const tokyo = Temporal.ZonedDateTime.from('2025-01-21T13:00:00+09:00[Asia/Tokyo]');
isSameDay(ny, tokyo); // false (Jan 20 in NY, Jan 21 in Tokyo)

// Convert to UTC to compare in UTC timezone
isSameDay(ny.withTimeZone('UTC'), tokyo.withTimeZone('UTC')); // true (both Jan 21 in UTC)

// Instant inputs are automatically converted to UTC
const instant1 = Temporal.Instant.from('2025-01-20T10:00:00Z');
const instant2 = Temporal.Instant.from('2025-01-20T23:00:00Z');
isSameDay(instant1, instant2); // true (both Jan 20 in UTC)
```

## Drizzle ORM Integration

tiempo seamlessly integrates with Drizzle ORM for database datetime operations. When using Drizzle with PostgreSQL `timestamptz` columns and `mode: 'date'`, tiempo provides utilities to convert between Date objects and Temporal.

```typescript
import { toZonedTime, toUtc, toDate } from '@gobrand/tiempo';

// 1. Reading from database (Drizzle returns Date with mode: 'date')
const post = await db.query.posts.findFirst();
const publishedAt = post.publishedAt; // Date object

// 2. Convert to user's timezone for display
const userTimezone = "America/New_York";
const zonedTime = toZonedTime(publishedAt, userTimezone);
console.log(zonedTime.hour); // Local hour in user's timezone

// 3. User reschedules post to tomorrow at 3 PM their time
const rescheduled = zonedTime.add({ days: 1 }).with({ hour: 15, minute: 0 });

// 4. Convert back to Date for database storage
const dateForDb = toDate(rescheduled);
await db.update(posts).set({ publishedAt: dateForDb }).where(eq(posts.id, post.id));
```

**Why this works:**
- Drizzle's `mode: 'date'` returns JavaScript `Date` objects (timestamps)
- `toZonedTime(date, tz)` converts the Date to a timezone-aware Temporal object
- Work with Temporal's powerful API for date arithmetic and manipulation
- `toDate(temporal)` converts back to Date for Drizzle storage

## Real World Examples

### Example 1: Social Media Post Scheduler

This example demonstrates the complete workflow of working with datetimes in a frontend application: receiving a UTC ISO 8601 string from your backend, converting it to a Temporal object in the user's timezone, formatting it for display, manipulating it with tiempo's arithmetic functions, and sending it back to your backend as a UTC ISO 8601 string.

```typescript
import {
  toZonedTime,
  toUtcString,
  format,
  addDays,
  addHours,
  subMinutes
} from '@gobrand/tiempo';

// 1. Receive UTC ISO 8601 string from backend
const scheduledAtUTC = "2025-01-20T20:00:00.000Z";

// 2. Convert to user's timezone (Temporal.ZonedDateTime)
const userTimezone = "America/New_York";
const zonedDateTime = toZonedTime(scheduledAtUTC, userTimezone);

// 3. Format for display in the UI
const displayTime = format(zonedDateTime, "EEEE, MMMM do 'at' h:mm a");
console.log(displayTime); // "Monday, January 20th at 3:00 PM"

// 4. User wants to reschedule to tomorrow, 2 hours later
const tomorrow = addDays(zonedDateTime, 1);
const twoHoursLater = addHours(tomorrow, 2);

// 5. Format the updated time for confirmation
const confirmTime = format(twoHoursLater, "EEEE 'at' h:mm a");
console.log(`Rescheduled to ${confirmTime}`); // "Tuesday at 5:00 PM"

// 6. Convert back to UTC ISO 8601 string for backend
const updatedUTC = toUtcString(twoHoursLater);
console.log(updatedUTC); // "2025-01-21T22:00:00Z"
```

### Example 2: Meeting Reminder System

```typescript
import {
  toZonedTime,
  format,
  subMinutes,
  subHours,
  differenceInMinutes,
  isFuture
} from '@gobrand/tiempo';

// Meeting scheduled for 2 PM
const meeting = toZonedTime('2025-01-20T19:00:00Z', 'America/New_York');
// 2025-01-20T14:00:00-05:00[America/New_York]

// Send reminders at multiple intervals
const reminders = [
  { time: subMinutes(meeting, 15), label: '15 minutes before' },
  { time: subHours(meeting, 1), label: '1 hour before' },
  { time: subHours(meeting, 24), label: '1 day before' },
];

reminders.forEach(({ time, label }) => {
  if (isFuture(time)) {
    const formatted = format(time, 'MMM d, h:mm a');
    console.log(`Send reminder "${label}" at ${formatted}`);
  }
});

// Calculate time until meeting
const now = Temporal.Now.zonedDateTimeISO('America/New_York');
const minutesUntil = differenceInMinutes(meeting, now);
console.log(`Meeting starts in ${minutesUntil} minutes`);
```

### PlainDate Comparisons

For comparing calendar dates without time or timezone considerations, tiempo provides dedicated PlainDate comparison functions. These are useful for calendars, date pickers, and scheduling UIs where you work with pure dates.

#### `isPlainDateBefore(date1, date2)` / `isPlainDateAfter(date1, date2)` / `isPlainDateEqual(date1, date2)`

Compare two `Temporal.PlainDate` values. Unlike `isBefore`/`isAfter` which compare instants in time, these functions compare pure calendar dates.

```typescript
import { isPlainDateBefore, isPlainDateAfter, isPlainDateEqual } from '@gobrand/tiempo';

const jan20 = Temporal.PlainDate.from('2025-01-20');
const jan25 = Temporal.PlainDate.from('2025-01-25');

isPlainDateBefore(jan20, jan25); // true
isPlainDateBefore(jan25, jan20); // false

isPlainDateAfter(jan25, jan20); // true
isPlainDateAfter(jan20, jan25); // false

isPlainDateEqual(jan20, Temporal.PlainDate.from('2025-01-20')); // true
isPlainDateEqual(jan20, jan25); // false
```

**When to use PlainDate vs Instant/ZonedDateTime:**
- Use `isPlainDateBefore`/`isPlainDateAfter` when comparing calendar dates (e.g., "Is January 20th before January 25th?")
- Use `isBefore`/`isAfter` when comparing specific moments in time (e.g., "Did event A happen before event B?")

```typescript
// Calendar UI: Disable dates before today
const isDateDisabled = (date: Temporal.PlainDate) =>
  isPlainDateBefore(date, today());

// Booking system: Check if selected date is in the past
const isPastDate = (date: Temporal.PlainDate) =>
  isPlainDateBefore(date, today());
```

## Browser Support

The Temporal API is a Stage 3 TC39 proposal. The polyfill `@js-temporal/polyfill` is included as a dependency, so you're ready to go!

```typescript
import { Temporal } from '@js-temporal/polyfill';
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © [Go Brand](https://github.com/go-brand)

## Built by Go Brand

tiempo is built and maintained by [Go Brand](https://gobrand.app) - a modern social media management platform.
