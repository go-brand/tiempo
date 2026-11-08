# addWeeks

Adds weeks of seven calendar days, so the result falls on the same weekday at the same wall-clock time, even across a daylight saving time change.

## Signature

```ts
function addWeeks(input: Temporal.PlainDate, weeks: number): Temporal.PlainDate;
function addWeeks(
  input: Temporal.Instant | Temporal.ZonedDateTime,
  weeks: number
): Temporal.ZonedDateTime;
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `input` | `Temporal.PlainDate \| Temporal.Instant \| Temporal.ZonedDateTime` | The starting date or datetime |
| `weeks` | `number` | Whole number of weeks to add; negative goes back. Fractions throw a `RangeError`. |

## Returns

A `PlainDate` for a `PlainDate` input. Otherwise a `ZonedDateTime` in the input's timezone, or in UTC for an `Instant`.

## Examples

### Plan two-week sprints

```ts
import { addWeeks } from '@gobrand/tiempo';

const sprint1 = Temporal.PlainDate.from('2026-01-05');

addWeeks(sprint1, 2); // 2026-01-19 (sprint 2)
```

### Keep a weekly standup at 09:30 in Los Angeles

US daylight saving time starts on March 8, 2026; only the offset changes.

```ts
import { addWeeks } from '@gobrand/tiempo';

const standup = Temporal.ZonedDateTime.from('2026-03-02T09:30:00-08:00[America/Los_Angeles]');

addWeeks(standup, 1); // 2026-03-09T09:30:00-07:00[America/Los_Angeles]
```
