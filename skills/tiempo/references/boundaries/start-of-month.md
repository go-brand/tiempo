# startOfMonth

Returns the first boundary of the month. `PlainDate` inputs stay in calendar space and return the first date of the month; providing a timezone returns a `ZonedDateTime` at the start of that date.

## Signature

```ts
function startOfMonth(
  input: Temporal.Instant | Temporal.ZonedDateTime
): Temporal.ZonedDateTime

function startOfMonth(input: Temporal.PlainDate): Temporal.PlainDate

function startOfMonth(
  input: Temporal.PlainDate,
  timezone: Timezone
): Temporal.ZonedDateTime
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `input` | `Temporal.Instant \| Temporal.ZonedDateTime \| Temporal.PlainDate` | The date or datetime to get the start of month for |
| `timezone` | `Timezone` | Required only when converting a `PlainDate` boundary to a `ZonedDateTime` |

## Returns

A `Temporal.PlainDate` for calendar-only input, or a `Temporal.ZonedDateTime` at the start of the first day for datetime input or an explicit timezone.

## Examples

```ts
import { startOfMonth } from '@gobrand/tiempo';

const instant = Temporal.Instant.from('2025-01-15T12:00:00Z');
startOfMonth(instant);
// 2025-01-01T00:00:00Z[UTC]

const zoned = Temporal.ZonedDateTime.from('2025-01-15T15:30:00-05:00[America/New_York]');
startOfMonth(zoned);
// 2025-01-01T00:00:00-05:00[America/New_York]

const date = Temporal.PlainDate.from('2025-01-15');
startOfMonth(date);
// 2025-01-01

startOfMonth(date, 'America/New_York');
// 2025-01-01T00:00:00-05:00[America/New_York]
```

## Common Patterns

### Month-to-date

```ts
import { startOfMonth, now } from '@gobrand/tiempo';

const current = now('America/New_York');
const monthStart = startOfMonth(current);

// Month-to-date range: [monthStart, current]
```
