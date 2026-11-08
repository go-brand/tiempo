# clamp

Restricts a value to an inclusive interval. Returns the value itself when it is inside, otherwise the nearer endpoint.

All three values are returned as given, keeping their type, timezone, and calendar. Timeline values compare by exact instant, PlainDates by date, and PlainTimes by wall-clock time. Mixed domains throw a TypeError.

## Signature

```ts
function clamp<T extends Timeline, S extends Timeline, E extends Timeline>(
  value: T,
  interval: { start: S; end: E }
): T | S | E; // Timeline = Temporal.Instant | Temporal.ZonedDateTime
function clamp(
  value: Temporal.PlainDate,
  interval: { start: Temporal.PlainDate; end: Temporal.PlainDate }
): Temporal.PlainDate;
function clamp(
  value: Temporal.PlainTime,
  interval: { start: Temporal.PlainTime; end: Temporal.PlainTime }
): Temporal.PlainTime
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `value` | `PlainDate`, `PlainTime`, or `Instant \| ZonedDateTime` | The value to restrict |
| `interval` | `{ start, end }` in the same domain | Inclusive bounds |

## Returns

`value`, `interval.start`, or `interval.end`. Throws a `RangeError` if `interval.start` is after `interval.end`.

## Examples

### Keep a date inside a billing period

```ts
import { clamp } from '@gobrand/tiempo';

const period = {
  start: Temporal.PlainDate.from('2025-01-01'),
  end: Temporal.PlainDate.from('2025-01-31'),
};

clamp(Temporal.PlainDate.from('2025-02-14'), period); // 2025-01-31
clamp(Temporal.PlainDate.from('2025-01-10'), period); // 2025-01-10
```

### Keep a time inside opening hours

```ts
import { clamp } from '@gobrand/tiempo';

const opening = { start: Temporal.PlainTime.from('09:00'), end: Temporal.PlainTime.from('17:00') };

clamp(Temporal.PlainTime.from('07:45'), opening); // 09:00:00
```
