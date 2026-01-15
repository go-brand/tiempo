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
import { utcToZonedTime, zonedTimeToUtc } from '@gobrand/tiempo';

// Backend sends: "2025-01-20T20:00:00.000Z"
const zoned = utcToZonedTime("2025-01-20T20:00:00.000Z", "America/New_York");
console.log(zoned.hour); // 15 (3 PM in New York)

// Send back to backend:
const utc = zonedTimeToUtc(zoned);
console.log(utc); // "2025-01-20T20:00:00Z"
```

## API

### `utcToZonedTime(isoString, timezone)`

Convert a UTC ISO string to a ZonedDateTime in the given timezone.

**Parameters:**
- `isoString` (string): A UTC ISO 8601 string (e.g., `"2025-01-20T20:00:00.000Z"`)
- `timezone` (string): An IANA timezone identifier (e.g., `"America/New_York"`, `"Europe/London"`)

**Returns:** `Temporal.ZonedDateTime` - The same instant in the specified timezone

**Example:**
```typescript
import { utcToZonedTime } from '@gobrand/tiempo';

// Backend sends: "2025-01-20T20:00:00.000Z"
const zoned = utcToZonedTime("2025-01-20T20:00:00.000Z", "America/New_York");

console.log(zoned.hour); // 15 (3 PM in New York)
console.log(zoned.toString()); // "2025-01-20T15:00:00-05:00[America/New_York]"
```

### `zonedTimeToUtc(zonedDateTime)`

Convert a ZonedDateTime to a UTC ISO string.

**Parameters:**
- `zonedDateTime` (`Temporal.ZonedDateTime`): A Temporal.ZonedDateTime instance

**Returns:** `string` - A UTC ISO 8601 string representation of the instant

**Example:**
```typescript
import { zonedTimeToUtc, utcToZonedTime } from '@gobrand/tiempo';

const zoned = utcToZonedTime("2025-01-20T20:00:00.000Z", "America/New_York");

// Send back to backend:
const utc = zonedTimeToUtc(zoned);
console.log(utc); // "2025-01-20T20:00:00Z"
```

## Complete Workflow Example

```typescript
import { utcToZonedTime, zonedTimeToUtc } from '@gobrand/tiempo';

// 1. Receive UTC datetime from backend
const scheduledAtUTC = "2025-01-20T20:00:00.000Z";

// 2. Convert to user's timezone for display/editing
const userTimezone = "America/New_York";
const zonedDateTime = utcToZonedTime(scheduledAtUTC, userTimezone);

console.log(`Scheduled for: ${zonedDateTime.hour}:00`); // "Scheduled for: 15:00"

// 3. User modifies the time
const updatedZoned = zonedDateTime.with({ hour: 16 });

// 4. Convert back to UTC for sending to backend
const updatedUTC = zonedTimeToUtc(updatedZoned);
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
