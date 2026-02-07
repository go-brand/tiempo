# toUtc

Convert a UTC ISO string, Unix timestamp, Date, or ZonedDateTime to a `Temporal.Instant` (UTC).

## Signature

```ts
function toUtc(
  input: string | number | Date | Temporal.ZonedDateTime
): Temporal.Instant
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `input` | `string \| number \| Date \| Temporal.ZonedDateTime` | A UTC ISO 8601 string, Unix timestamp (milliseconds), Date object, or Temporal.ZonedDateTime |

## Returns

A `Temporal.Instant` representing the same moment in UTC.

## Examples

### From ISO string

```ts
import { toUtc } from '@gobrand/tiempo';

const instant = toUtc("2025-01-20T20:00:00.000Z");
```

### From Unix timestamp

```ts
// Common with database BIGINT timestamps or API responses
const instant = toUtc(1737403200000);
```

### From Date (e.g., from Drizzle ORM)

```ts
const date = new Date("2025-01-20T20:00:00.000Z");
const instant = toUtc(date);
```

### From ZonedDateTime

```ts
const zoned = Temporal.ZonedDateTime.from("2025-01-20T15:00:00-05:00[America/New_York]");
const instant = toUtc(zoned);
// Represents the same moment: 2025-01-20T20:00:00Z
```
