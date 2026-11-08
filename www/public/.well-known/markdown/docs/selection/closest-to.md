# closestTo

Returns the candidate nearest to the target, before or after it.

Timeline values measure exact elapsed time, PlainDates whole days, and PlainTimes time within one day (23:30 is far from 00:15; there is no wrapping at midnight). Ties return the first candidate. The candidate is returned as given. Mixed domains throw a TypeError.

## Signature

```ts
function closestTo<T extends Temporal.Instant | Temporal.ZonedDateTime>(
  target: Temporal.Instant | Temporal.ZonedDateTime,
  candidates: readonly T[]
): T | undefined;
function closestTo(
  target: Temporal.PlainDate,
  candidates: readonly Temporal.PlainDate[]
): Temporal.PlainDate | undefined;
function closestTo(
  target: Temporal.PlainTime,
  candidates: readonly Temporal.PlainTime[]
): Temporal.PlainTime | undefined
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `target` | `PlainDate`, `PlainTime`, or `Instant \| ZonedDateTime` | The value to measure from |
| `candidates` | Array in the same domain | Values to choose from; may be empty |

## Returns

The nearest candidate, or `undefined` when `candidates` is empty.

## Examples

```ts
import { closestTo } from '@gobrand/tiempo';

const now = Temporal.Instant.from('2025-01-20T12:00:00Z');
const departures = [
  Temporal.Instant.from('2025-01-20T09:00:00Z'),
  Temporal.Instant.from('2025-01-20T13:30:00Z'),
  Temporal.Instant.from('2025-01-20T18:00:00Z'),
];

closestTo(now, departures); // 2025-01-20T13:30:00Z
closestTo(now, []); // undefined
```

### Nearest future value

`closestTo` looks in both directions. Filter first to only look ahead:

```ts
import { closestTo, isAfter } from '@gobrand/tiempo';

const now = Temporal.Instant.from('2025-01-20T12:00:00Z');
const departures = [
  Temporal.Instant.from('2025-01-20T11:55:00Z'),
  Temporal.Instant.from('2025-01-20T13:30:00Z'),
];

closestTo(now, departures.filter((d) => isAfter(d, now))); // 2025-01-20T13:30:00Z
```
