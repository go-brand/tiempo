# tiempo

[![npm version](https://img.shields.io/npm/v/@gobrand/tiempo.svg)](https://www.npmjs.com/package/@gobrand/tiempo)
[![CI](https://github.com/go-brand/tiempo/actions/workflows/ci.yml/badge.svg)](https://github.com/go-brand/tiempo/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Lightweight utilities for timezones and datetimes with the [Temporal API](https://tc39.es/proposal-temporal/docs/).

## Installation

```bash
npm install @gobrand/tiempo
# or
pnpm add @gobrand/tiempo
# or
yarn add @gobrand/tiempo
```

## Why tiempo?

The Temporal API is powerful but requires understanding its various methods and objects. `tiempo` provides intuitive utilities for common datetime tasks: timezone conversions, formatting, start/end calculations, and comparisons. Whether you're converting UTC strings from your backend or formatting dates for display, tiempo makes working with timezones straightforward.

**Perfect for:**
- Social media scheduling apps
- Calendar applications
- Booking systems
- Any app that needs to handle user timezones

## Quick Start

```typescript
import { toZonedTime, toUtcString } from '@gobrand/tiempo';

// Backend sends: "2025-01-20T20:00:00.000Z"
const zoned = toZonedTime("2025-01-20T20:00:00.000Z", "America/New_York");
console.log(zoned.hour); // 15 (3 PM in New York)

// Send back to backend:
const utc = toUtcString(zoned);
console.log(utc); // "2025-01-20T20:00:00Z"
```

## API

### Core Conversions

#### `toZonedTime(input, timezone)`

Convert a UTC ISO string, Instant, or ZonedDateTime to a ZonedDateTime in the specified timezone.

**Parameters:**
- `input` (string | Temporal.Instant | Temporal.ZonedDateTime): A UTC ISO 8601 string, Temporal.Instant, or Temporal.ZonedDateTime
- `timezone` (string): An IANA timezone identifier (e.g., `"America/New_York"`, `"Europe/London"`)

**Returns:** `Temporal.ZonedDateTime` - The same instant in the specified timezone

**Example:**
```typescript
import { toZonedTime } from '@gobrand/tiempo';

// From ISO string
const zoned = toZonedTime("2025-01-20T20:00:00.000Z", "America/New_York");
console.log(zoned.hour); // 15 (3 PM in New York)
console.log(zoned.toString()); // "2025-01-20T15:00:00-05:00[America/New_York]"

// From Instant
const instant = Temporal.Instant.from("2025-01-20T20:00:00Z");
const zoned2 = toZonedTime(instant, "Asia/Tokyo");

// From ZonedDateTime (convert to different timezone)
const nyTime = Temporal.ZonedDateTime.from("2025-01-20T15:00:00-05:00[America/New_York]");
const tokyoTime = toZonedTime(nyTime, "Asia/Tokyo");
```

#### `toUtc(input)`

Convert a UTC ISO string or ZonedDateTime to a Temporal.Instant (UTC).

**Parameters:**
- `input` (string | Temporal.ZonedDateTime): A UTC ISO 8601 string or Temporal.ZonedDateTime

**Returns:** `Temporal.Instant` - A Temporal.Instant representing the same moment in UTC

**Example:**
```typescript
import { toUtc } from '@gobrand/tiempo';

// From ISO string
const instant = toUtc("2025-01-20T20:00:00.000Z");

// From ZonedDateTime
const zoned = Temporal.ZonedDateTime.from("2025-01-20T15:00:00-05:00[America/New_York]");
const instant2 = toUtc(zoned);
// Both represent the same UTC moment: 2025-01-20T20:00:00Z
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

### Formatting

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

## Real World Example

This example demonstrates the complete workflow of working with datetimes in a frontend application: receiving a UTC ISO 8601 string from your backend, converting it to a Temporal object in the user's timezone, formatting it for display, manipulating it based on user input, and sending it back to your backend as a UTC ISO 8601 string.

```typescript
import { toZonedTime, toUtcString, format } from '@gobrand/tiempo';

// 1. Receive UTC ISO 8601 string from backend
const scheduledAtUTC = "2025-01-20T20:00:00.000Z";

// 2. Convert to user's timezone (Temporal.ZonedDateTime)
const userTimezone = "America/New_York";
const zonedDateTime = toZonedTime(scheduledAtUTC, userTimezone);

// 3. Format for display in the UI
const displayTime = format(zonedDateTime, "EEEE, MMMM do 'at' h:mm a");
console.log(displayTime); // "Monday, January 20th at 3:00 PM"

// 4. User reschedules to 4:00 PM their time
const updatedZoned = zonedDateTime.with({ hour: 16 });

// 5. Format the updated time for confirmation
const confirmTime = format(updatedZoned, "h:mm a");
console.log(`Rescheduled to ${confirmTime}`); // "Rescheduled to 4:00 PM"

// 6. Convert back to UTC ISO 8601 string for backend
const updatedUTC = toUtcString(updatedZoned);
console.log(updatedUTC); // "2025-01-20T21:00:00Z"
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
