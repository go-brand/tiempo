# endOfWeek

Returns the last boundary of the ISO week (Sunday). `PlainDate` inputs stay in calendar space and return a `PlainDate`; providing a timezone returns a `ZonedDateTime` at the last moment of Sunday.

## Signature

```ts
function endOfWeek(
  input: Temporal.Instant | Temporal.ZonedDateTime
): Temporal.ZonedDateTime

function endOfWeek(input: Temporal.PlainDate): Temporal.PlainDate

function endOfWeek(
  input: Temporal.PlainDate,
  timezone: Timezone
): Temporal.ZonedDateTime
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `input` | `Temporal.Instant \| Temporal.ZonedDateTime \| Temporal.PlainDate` | The date or datetime to get the end of week for |
| `timezone` | `Timezone` | Required only when converting a `PlainDate` boundary to a `ZonedDateTime` |

## Returns

A `Temporal.PlainDate` for calendar-only input, or a `Temporal.ZonedDateTime` at the last moment of Sunday for datetime input or an explicit timezone.

## Examples

### From Instant (Monday)

```ts
import { endOfWeek } from '@gobrand/tiempo';

const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
endOfWeek(instant);
// 2025-01-26T23:59:59.999999999Z[UTC] (next Sunday)
```

### From ZonedDateTime (Wednesday)

```ts
const zoned = Temporal.ZonedDateTime.from('2025-01-22T15:30:00-05:00[America/New_York]');
endOfWeek(zoned);
// 2025-01-26T23:59:59.999999999-05:00[America/New_York]
```

### From PlainDate

```ts
const date = Temporal.PlainDate.from('2025-01-22');
endOfWeek(date);
// 2025-01-26

endOfWeek(date, 'America/New_York');
// 2025-01-26T23:59:59.999999999-05:00[America/New_York]
```
