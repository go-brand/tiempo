# roundToNearestSecond

Rounds a datetime to the nearest second, or to intervals of several seconds with `nearestTo`.

## Signature

```ts
function roundToNearestSecond(
  input: Temporal.Instant | Temporal.ZonedDateTime,
  options?: RoundToNearestSecondOptions
): Temporal.ZonedDateTime

interface RoundToNearestSecondOptions {
  mode?: 'round' | 'ceil' | 'floor';
  nearestTo?: 1 | 2 | 3 | 4 | 5 | 6 | 10 | 12 | 15 | 20 | 30;
}
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `input` | `Temporal.Instant \| Temporal.ZonedDateTime` | The datetime to round |
| `options.mode` | `'round' \| 'ceil' \| 'floor'` | `'round'` (default) goes to the nearest interval, halfway rounds up. `'ceil'` always goes up, `'floor'` always goes down |
| `options.nearestTo` | `1 \| 2 \| 3 \| 4 \| 5 \| 6 \| 10 \| 12 \| 15 \| 20 \| 30` | Interval size in seconds, counted from the start of the minute. Default `1` |

## Returns

A `Temporal.ZonedDateTime` on the interval boundary, with milliseconds and smaller units set to zero. `ZonedDateTime` inputs keep their timezone; `Instant` inputs return a UTC `ZonedDateTime`.

## Examples

### Strip milliseconds from a log timestamp

```ts
import { roundToNearestSecond } from '@gobrand/tiempo';

const loggedAt = Temporal.Instant.from('2026-01-20T14:37:42.567Z');

roundToNearestSecond(loggedAt); // 2026-01-20T14:37:43+00:00[UTC] (567 ms rounds up)
roundToNearestSecond(loggedAt, { mode: 'floor' }); // 2026-01-20T14:37:42+00:00[UTC]
```

### Bucket metrics into 10-second windows

```ts
import { roundToNearestSecond } from '@gobrand/tiempo';

const sample = Temporal.ZonedDateTime.from('2026-01-20T14:37:42.300[Europe/Berlin]');

roundToNearestSecond(sample, { mode: 'floor', nearestTo: 10 }); // 2026-01-20T14:37:40+01:00[Europe/Berlin]
roundToNearestSecond(sample, { mode: 'ceil', nearestTo: 10 }); // 2026-01-20T14:37:50+01:00[Europe/Berlin]
```

## Good to know

- A time already on a boundary is returned unchanged in every mode.
- `nearestTo` must divide 60. Other values are a TypeScript error and throw a `RangeError` at runtime.
