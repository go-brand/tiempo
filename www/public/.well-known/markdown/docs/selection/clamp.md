# clamp

Returns `value` when it is inside the inclusive range, otherwise the nearer endpoint. Whichever value is returned comes back exactly as given: same type, timezone, and calendar.

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
| `value` | `PlainDate`, `PlainTime`, or `Instant \| ZonedDateTime` | The value to keep in range |
| `interval` | `{ start, end }` of the same kind | Inclusive bounds |

## Returns

`value`, `interval.start`, or `interval.end`. Throws a `RangeError` if `interval.start` is after `interval.end`.

## Examples

### Keep a date inside a billing period

```ts
import { clamp } from '@gobrand/tiempo';

const period = {
  start: Temporal.PlainDate.from('2026-01-01'),
  end: Temporal.PlainDate.from('2026-01-31'),
};

clamp(Temporal.PlainDate.from('2026-02-14'), period); // 2026-01-31
clamp(Temporal.PlainDate.from('2026-01-10'), period); // 2026-01-10
```

### Keep a delivery time inside opening hours

```ts
import { clamp } from '@gobrand/tiempo';

const opening = { start: Temporal.PlainTime.from('09:00'), end: Temporal.PlainTime.from('17:00') };

clamp(Temporal.PlainTime.from('07:45'), opening); // 09:00:00
clamp(Temporal.PlainTime.from('18:30'), opening); // 17:00:00
```

## Good to know

- Mixing a PlainDate or PlainTime with another kind throws a `TypeError`.
