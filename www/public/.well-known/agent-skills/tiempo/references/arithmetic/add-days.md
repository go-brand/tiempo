# addDays

Add days to a datetime or calendar date. DST-safe—adds calendar days, not 24-hour periods.

PlainDate inputs return a PlainDate and preserve its calendar, without choosing a timezone. Instant inputs continue to return a ZonedDateTime in UTC; ZonedDateTime inputs preserve their timezone. Counts may be negative; fractional calendar counts are rejected by Temporal. Month/year arithmetic uses Temporal’s default month-end constraining.

## Signature

```ts
function addDays(
  input: Temporal.Instant | Temporal.ZonedDateTime,
  days: number
): Temporal.ZonedDateTime;
function addDays(input: Temporal.PlainDate, days: number): Temporal.PlainDate;
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `input` | `Temporal.Instant \| Temporal.ZonedDateTime \| Temporal.PlainDate` | The datetime to add days to |
| `days` | `number` | Number of days to add (can be negative) |

## Returns

A `Temporal.PlainDate` for a date-only input, or a `Temporal.ZonedDateTime` for an Instant/ZonedDateTime input, with the days added.

## Examples

### Basic usage

```ts
import { addDays } from '@gobrand/tiempo';

const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
addDays(instant, 5);
// 2025-01-25T12:00:00Z[UTC]
```

### Preserves timezone

```ts
const zoned = Temporal.ZonedDateTime.from('2025-01-20T15:30:00-05:00[America/New_York]');
addDays(zoned, 10);
// 2025-01-30T15:30:00-05:00[America/New_York]
```

### Negative values subtract

```ts
addDays(instant, -7);
// 2025-01-13T12:00:00Z[UTC]
```

## DST Handling

`addDays` properly handles Daylight Saving Time transitions:

```ts
import { addDays, addHours } from '@gobrand/tiempo';

// DST transition in US (March 9, 2025 at 2:00 AM)
const beforeDst = Temporal.ZonedDateTime.from('2025-03-08T12:00:00-05:00[America/New_York]');

// Adding 1 day = calendar day (still 12:00 PM)
const nextDay = addDays(beforeDst, 1);
// 2025-03-09T12:00:00-04:00[America/New_York]

// Compare with addHours: Adding 24 hours = 24 hours of elapsed time
const plus24h = addHours(beforeDst, 24);
// 2025-03-09T13:00:00-04:00[America/New_York]
// (One hour later because DST "lost" an hour)
```

## Date-only arithmetic

```ts
import { addDays, toPlainDate } from '@gobrand/tiempo';

const date = toPlainDate('2024-01-31');
const result = addDays(date, 1); // Temporal.PlainDate
result.toString(); // "2024-02-01"
```
