# subYears

The reverse of [addYears](https://tiempo.gobrand.app/docs/arithmetic/add-years): goes back calendar years, keeping the month, day, and wall-clock time. February 29 moves to February 28 in a year without one.

## Signature

```ts
function subYears(input: Temporal.PlainDate, years: number): Temporal.PlainDate;
function subYears(
  input: Temporal.Instant | Temporal.ZonedDateTime,
  years: number
): Temporal.ZonedDateTime;
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `input` | `Temporal.PlainDate \| Temporal.Instant \| Temporal.ZonedDateTime` | The starting date or datetime |
| `years` | `number` | Whole number of years to subtract; negative goes forward. Fractions throw a `RangeError`. |

## Returns

A `PlainDate` for a `PlainDate` input. Otherwise a `ZonedDateTime` in the input's timezone, or in UTC for an `Instant`.

## Examples

### Find the latest birth date for someone who is 18 today

```ts
import { subYears } from '@gobrand/tiempo';

const today = Temporal.PlainDate.from('2026-11-08');

subYears(today, 18); // 2008-11-08 (born on or before this date)
```
