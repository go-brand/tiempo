# subWeeks

The reverse of [addWeeks](https://tiempo.gobrand.app/docs/arithmetic/add-weeks): goes back 7-day weeks, landing on the same weekday at the same wall-clock time.

## Signature

```ts
function subWeeks(input: Temporal.PlainDate, weeks: number): Temporal.PlainDate;
function subWeeks(
  input: Temporal.Instant | Temporal.ZonedDateTime,
  weeks: number
): Temporal.ZonedDateTime;
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `input` | `Temporal.PlainDate \| Temporal.Instant \| Temporal.ZonedDateTime` | The starting date or datetime |
| `weeks` | `number` | Whole number of weeks to subtract; negative goes forward. Fractions throw a `RangeError`. |

## Returns

A `PlainDate` for a `PlainDate` input. Otherwise a `ZonedDateTime` in the input's timezone, or in UTC for an `Instant`.

## Examples

### Show the last four weeks of activity

```ts
import { subWeeks } from '@gobrand/tiempo';

const reportDate = Temporal.PlainDate.from('2026-03-30');

subWeeks(reportDate, 4); // 2026-03-02
```
