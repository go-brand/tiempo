# startOfWeek

Returns the first boundary of the ISO week (Monday). `PlainDate` inputs stay in calendar space and return a `PlainDate`; providing a timezone returns a `ZonedDateTime` at the start of Monday.

## Signature

```ts
function startOfWeek(
  input: Temporal.Instant | Temporal.ZonedDateTime
): Temporal.ZonedDateTime

function startOfWeek(input: Temporal.PlainDate): Temporal.PlainDate

function startOfWeek(
  input: Temporal.PlainDate,
  timezone: Timezone
): Temporal.ZonedDateTime
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `input` | `Temporal.Instant \| Temporal.ZonedDateTime \| Temporal.PlainDate` | The date or datetime to get the start of week for |
| `timezone` | `Timezone` | Required only when converting a `PlainDate` boundary to a `ZonedDateTime` |

## Returns

A `Temporal.PlainDate` for calendar-only input, or a `Temporal.ZonedDateTime` at the start of Monday for datetime input or an explicit timezone.

## Examples

### From Instant (Monday)

```ts
import { startOfWeek } from '@gobrand/tiempo';

const instant = Temporal.Instant.from('2025-01-20T12:00:00Z'); // Monday
startOfWeek(instant);
// 2025-01-20T00:00:00Z[UTC] (same day, already Monday)
```

### From ZonedDateTime (Wednesday)

```ts
const zoned = Temporal.ZonedDateTime.from('2025-01-22T15:30:00-05:00[America/New_York]');
startOfWeek(zoned);
// 2025-01-20T00:00:00-05:00[America/New_York] (previous Monday)
```

### From PlainDate

```ts
const date = Temporal.PlainDate.from('2025-01-22');
startOfWeek(date);
// 2025-01-20

startOfWeek(date, 'America/New_York');
// 2025-01-20T00:00:00-05:00[America/New_York]
```

## Common Patterns

### This week's range

```ts
import { startOfWeek, endOfWeek } from '@gobrand/tiempo';

const now = Temporal.Now.zonedDateTimeISO('America/New_York');
const weekStart = startOfWeek(now);
const weekEnd = endOfWeek(now);
```
