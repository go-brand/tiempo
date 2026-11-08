# subMonths

The reverse of [addMonths](https://tiempo.gobrand.app/docs/arithmetic/add-months): goes back calendar months, keeping the day of the month and the wall-clock time. A day missing from the target month moves back to its last day: March 31 minus one month is February 28.

## Signature

```ts
function subMonths(input: Temporal.PlainDate, months: number): Temporal.PlainDate;
function subMonths(
  input: Temporal.Instant | Temporal.ZonedDateTime,
  months: number
): Temporal.ZonedDateTime;
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `input` | `Temporal.PlainDate \| Temporal.Instant \| Temporal.ZonedDateTime` | The starting date or datetime |
| `months` | `number` | Whole number of months to subtract; negative goes forward. Fractions throw a `RangeError`. |

## Returns

A `PlainDate` for a `PlainDate` input. Otherwise a `ZonedDateTime` in the input's timezone, or in UTC for an `Instant`.

## Examples

### Find the start of the previous billing period

```ts
import { subMonths } from '@gobrand/tiempo';

subMonths(Temporal.PlainDate.from('2026-04-15'), 1); // 2026-03-15
subMonths(Temporal.PlainDate.from('2026-03-31'), 1); // 2026-02-28
```
