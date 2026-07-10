# startOfQuarter

Returns a `ZonedDateTime` at the first moment of the quarter (1st day of the quarter's starting month at midnight). Quarters: Q1 = Jan–Mar, Q2 = Apr–Jun, Q3 = Jul–Sep, Q4 = Oct–Dec.

## Signature

```ts
function startOfQuarter(
  input: Temporal.Instant | Temporal.ZonedDateTime
): Temporal.ZonedDateTime
function startOfQuarter(input: Temporal.PlainDate): Temporal.PlainDate
function startOfQuarter(
  input: Temporal.PlainDate,
  timezone: Timezone
): Temporal.ZonedDateTime
```

A `PlainDate` with no timezone stays in calendar space and returns a `PlainDate`. Pass a timezone to bridge a `PlainDate` into a zoned `ZonedDateTime`.

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `input` | `Temporal.Instant \| Temporal.ZonedDateTime` | The datetime to get the start of quarter for |

## Returns

A `Temporal.ZonedDateTime` at midnight on the 1st day of the quarter (January, April, July, or October).

## Examples

```ts
import { startOfQuarter } from '@gobrand/tiempo';

const instant = Temporal.Instant.from('2025-05-15T12:00:00Z');
startOfQuarter(instant);
// 2025-04-01T00:00:00Z[UTC]

const zoned = Temporal.ZonedDateTime.from('2025-08-15T15:30:00-04:00[America/New_York]');
startOfQuarter(zoned);
// 2025-07-01T00:00:00-04:00[America/New_York]

// PlainDate in → PlainDate out (no timezone)
startOfQuarter(Temporal.PlainDate.from('2025-05-15'));
// 2025-04-01
```

## Common Patterns

### Quarter-to-date

```ts
import { startOfQuarter, now } from '@gobrand/tiempo';

const current = now('America/New_York');
const quarterStart = startOfQuarter(current);

// Quarter-to-date range: [quarterStart, current]
```
