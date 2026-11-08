# subDays

The reverse of [addDays](https://tiempo.gobrand.app/docs/arithmetic/add-days): goes back calendar days and keeps the wall-clock time across a daylight saving time change. For exact 24-hour periods, use [subHours](https://tiempo.gobrand.app/docs/arithmetic/sub-hours).

## Signature

```ts
function subDays(input: Temporal.PlainDate, days: number): Temporal.PlainDate;
function subDays(
  input: Temporal.Instant | Temporal.ZonedDateTime,
  days: number
): Temporal.ZonedDateTime;
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `input` | `Temporal.PlainDate \| Temporal.Instant \| Temporal.ZonedDateTime` | The starting date or datetime |
| `days` | `number` | Whole number of days to subtract; negative goes forward. Fractions throw a `RangeError`. |

## Returns

A `PlainDate` for a `PlainDate` input. Otherwise a `ZonedDateTime` in the input's timezone, or in UTC for an `Instant`.

## Examples

### Send a reminder three days before hotel check-in

US daylight saving time starts between the two dates; the reminder stays at 15:00.

```ts
import { subDays } from '@gobrand/tiempo';

const checkIn = Temporal.ZonedDateTime.from('2026-03-10T15:00:00-04:00[America/New_York]');

subDays(checkIn, 3); // 2026-03-07T15:00:00-05:00[America/New_York]
```
