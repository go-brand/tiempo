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
import { toZonedTime, toIso8601 } from '@gobrand/tiempo';

// Backend sends: "2025-01-20T20:00:00.000Z"
const zoned = toZonedTime("2025-01-20T20:00:00.000Z", "America/New_York");
console.log(zoned.hour); // 15 (3 PM in New York)

// Send back to backend:
const utc = toIso8601(zoned);
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

### `toIso8601(input)`

Convert a Temporal.Instant or ZonedDateTime to a UTC ISO 8601 string.

**Parameters:**
- `input` (Temporal.Instant | Temporal.ZonedDateTime): A Temporal.Instant or Temporal.ZonedDateTime

**Returns:** `string` - A UTC ISO 8601 string representation

**Example:**
```typescript
import { toIso8601 } from '@gobrand/tiempo';

// From ZonedDateTime
const zoned = Temporal.ZonedDateTime.from("2025-01-20T15:00:00-05:00[America/New_York]");
const iso = toIso8601(zoned);
console.log(iso); // "2025-01-20T20:00:00Z"

// From Instant
const instant = Temporal.Instant.from("2025-01-20T20:00:00Z");
const iso2 = toIso8601(instant);
console.log(iso2); // "2025-01-20T20:00:00Z"
```

## Complete Workflow Example

```typescript
import { toZonedTime, toIso8601 } from '@gobrand/tiempo';

// 1. Receive UTC datetime from backend
const scheduledAtUTC = "2025-01-20T20:00:00.000Z";

// 2. Convert to user's timezone for display/editing
const userTimezone = "America/New_York";
const zonedDateTime = toZonedTime(scheduledAtUTC, userTimezone);

console.log(`Scheduled for: ${zonedDateTime.hour}:00`); // "Scheduled for: 15:00"

// 3. User modifies the time
const updatedZoned = zonedDateTime.with({ hour: 16 });

// 4. Convert back to UTC for sending to backend
const updatedUTC = toIso8601(updatedZoned);
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
