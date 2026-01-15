# tiempo

[![npm version](https://img.shields.io/npm/v/@gobrand/tiempo.svg)](https://www.npmjs.com/package/@gobrand/tiempo)
[![CI](https://github.com/go-brand/tiempo/actions/workflows/ci.yml/badge.svg)](https://github.com/go-brand/tiempo/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Lightweight utility functions for converting between UTC and timezone-aware datetimes using the [Temporal API](https://tc39.es/proposal-temporal/docs/).

## Installation

```bash
npm install @gobrand/tiempo
# or
pnpm add @gobrand/tiempo
# or
yarn add @gobrand/tiempo
```

## Why tiempo?

The Temporal API is already designed for timezone conversions, but it requires understanding its various methods and objects. `tiempo` provides a simple, focused API for the most common use case: converting between UTC ISO strings (from your backend) and timezone-aware ZonedDateTime objects (for your frontend).

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

### `toZonedTime(input, timezone)`

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

### `toUtc(input)`

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

### `toUtcString(input)`

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

### `format(input, formatStr, options?)`

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

## Complete Workflow Example

```typescript
import { toZonedTime, toUtcString } from '@gobrand/tiempo';

// 1. Receive UTC datetime from backend
const scheduledAtUTC = "2025-01-20T20:00:00.000Z";

// 2. Convert to user's timezone for display/editing
const userTimezone = "America/New_York";
const zonedDateTime = toZonedTime(scheduledAtUTC, userTimezone);

console.log(`Scheduled for: ${zonedDateTime.hour}:00`); // "Scheduled for: 15:00"

// 3. User modifies the time
const updatedZoned = zonedDateTime.with({ hour: 16 });

// 4. Convert back to UTC for sending to backend
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
