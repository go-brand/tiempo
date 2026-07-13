# endOfQuarter

Returns a `ZonedDateTime` at the last moment of the quarter (last day of the quarter's ending month at 23:59:59.999999999). Quarters: Q1 = Jan–Mar, Q2 = Apr–Jun, Q3 = Jul–Sep, Q4 = Oct–Dec.

## Signature

```ts
function endOfQuarter(
  input: Temporal.Instant | Temporal.ZonedDateTime
): Temporal.ZonedDateTime
function endOfQuarter(input: Temporal.PlainDate): Temporal.PlainDate
function endOfQuarter(
  input: Temporal.PlainDate,
  timezone: Timezone
): Temporal.ZonedDateTime
```

A `PlainDate` with no timezone stays in calendar space and returns the quarter's last day as a `PlainDate`. Pass a timezone to bridge into a zoned `ZonedDateTime` at the last nanosecond.

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `input` | `Temporal.Instant \| Temporal.ZonedDateTime` | The datetime to get the end of quarter for |

## Returns

A `Temporal.ZonedDateTime` at the last nanosecond of the last day of the quarter (March, June, September, or December).

## Examples

```ts
import { endOfQuarter } from '@gobrand/tiempo';

const instant = Temporal.Instant.from('2025-05-15T12:00:00Z');
endOfQuarter(instant);
// 2025-06-30T23:59:59.999999999Z[UTC]

const zoned = Temporal.ZonedDateTime.from('2025-02-15T15:30:00-05:00[America/New_York]');
endOfQuarter(zoned);
// 2025-03-31T23:59:59.999999999-04:00[America/New_York]

// PlainDate in → PlainDate out (no timezone)
endOfQuarter(Temporal.PlainDate.from('2025-05-15'));
// 2025-06-30
```
