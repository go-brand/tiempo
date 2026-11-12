# previousDay

Returns the previous date on the given day of the week. Previous Monday from a Monday is a week earlier.

## Signature

```ts
function previousDay(input: Temporal.PlainDate, day: DayOfWeek): Temporal.PlainDate

function previousDay(
  input: Temporal.Instant | Temporal.ZonedDateTime,
  day: DayOfWeek
): Temporal.ZonedDateTime

type DayOfWeek = 1 | 2 | 3 | 4 | 5 | 6 | 7; // 1 = Monday … 7 = Sunday
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `input` | `PlainDate`, `Instant`, or `ZonedDateTime` | The starting value |
| `day` | `1 \| 2 \| 3 \| 4 \| 5 \| 6 \| 7` | The day of the week, numbered like Temporal's `dayOfWeek`: 1 = Monday … 7 = Sunday |

## Returns

A `PlainDate` for a PlainDate input. Otherwise a `ZonedDateTime` with the same wall-clock time, in the input's timezone (UTC for an Instant).

## Examples

### Find last Sunday

```ts
import { previousDay } from '@gobrand/tiempo';

const wednesday = Temporal.PlainDate.from('2026-11-11');

previousDay(wednesday, 7); // 2026-11-08
previousDay(wednesday, 3); // 2026-11-04 (a week earlier)
```

## Good to know

- The result is always before the input, never the input itself.
- Sunday is 7, not 0 as in date-fns. Passing 0 is a TypeScript error and throws a `RangeError`.
- The wall-clock time is kept across DST changes, like [addDays](https://tiempo.gobrand.app/docs/arithmetic/add-days).
