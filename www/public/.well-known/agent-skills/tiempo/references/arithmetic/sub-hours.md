# subHours

The reverse of [addHours](https://tiempo.gobrand.app/docs/arithmetic/add-hours): goes back exact hours, so the wall-clock time shifts across a daylight saving time change. To keep the same local time on an earlier day, use [subDays](https://tiempo.gobrand.app/docs/arithmetic/sub-days).

## Signature

```ts
function subHours(
  input: Temporal.Instant | Temporal.ZonedDateTime,
  hours: number
): Temporal.ZonedDateTime;
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `input` | `Temporal.Instant \| Temporal.ZonedDateTime` | The starting datetime |
| `hours` | `number` | Whole number of hours to subtract; negative goes forward. Fractions throw a `RangeError`. |

## Returns

A `ZonedDateTime` in the input's timezone, or in UTC for an `Instant`.

## Examples

### Look back 24 hours across a DST change

Clocks in New York moved forward at 02:00 on March 8, 2026.

```ts
import { subHours } from '@gobrand/tiempo';

const now = Temporal.ZonedDateTime.from('2026-03-08T12:00:00-04:00[America/New_York]');

subHours(now, 24); // 2026-03-07T11:00:00-05:00[America/New_York]
```
