# subMinutes

The reverse of [addMinutes](https://tiempo.gobrand.app/docs/arithmetic/add-minutes): goes back exact minutes of elapsed time.

## Signature

```ts
function subMinutes(
  input: Temporal.Instant | Temporal.ZonedDateTime,
  minutes: number
): Temporal.ZonedDateTime;
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `input` | `Temporal.Instant \| Temporal.ZonedDateTime` | The starting datetime |
| `minutes` | `number` | Whole number of minutes to subtract; negative goes forward. Fractions throw a `RangeError`. |

## Returns

A `ZonedDateTime` in the input's timezone, or in UTC for an `Instant`.

## Examples

### Send a reminder 15 minutes before a booking

```ts
import { subMinutes } from '@gobrand/tiempo';

const appointment = Temporal.ZonedDateTime.from('2026-05-12T09:30:00+01:00[Europe/London]');

subMinutes(appointment, 15); // 2026-05-12T09:15:00+01:00[Europe/London]
```
