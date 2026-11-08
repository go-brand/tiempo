# roundToNearestHour

Rounds a datetime to the nearest hour, or to blocks of several hours with `nearestTo`.

## Signature

```ts
function roundToNearestHour(
  input: Temporal.Instant | Temporal.ZonedDateTime,
  options?: RoundToNearestHourOptions
): Temporal.ZonedDateTime

interface RoundToNearestHourOptions {
  mode?: 'round' | 'ceil' | 'floor';
  nearestTo?: 1 | 2 | 3 | 4 | 6 | 8 | 12;
}
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `input` | `Temporal.Instant \| Temporal.ZonedDateTime` | The datetime to round |
| `options.mode` | `'round' \| 'ceil' \| 'floor'` | `'round'` (default) goes to the nearest hour, half past rounds up. `'ceil'` always goes up, `'floor'` always goes down |
| `options.nearestTo` | `1 \| 2 \| 3 \| 4 \| 6 \| 8 \| 12` | Size of the hour block, counted from midnight. Default `1` |

## Returns

A `Temporal.ZonedDateTime` on the boundary, with minutes and smaller units set to zero. `ZonedDateTime` inputs keep their timezone; `Instant` inputs return a UTC `ZonedDateTime`.

## Examples

### Show an approximate arrival time

```ts
import { roundToNearestHour } from '@gobrand/tiempo';

const eta = Temporal.ZonedDateTime.from('2026-04-10T14:20:00[Europe/Madrid]');

roundToNearestHour(eta); // 2026-04-10T14:00:00+02:00[Europe/Madrid]
roundToNearestHour(eta.with({ minute: 30 })); // 2026-04-10T15:00:00+02:00[Europe/Madrid] (half past rounds up)
```

### Assign an alert to a 6-hour shift

With `nearestTo: 6` the boundaries are 00:00, 06:00, 12:00, and 18:00.

```ts
import { roundToNearestHour } from '@gobrand/tiempo';

const alert = Temporal.ZonedDateTime.from('2026-04-10T14:48:00[America/Chicago]');

roundToNearestHour(alert, { mode: 'floor', nearestTo: 6 }); // 2026-04-10T12:00:00-05:00[America/Chicago]
roundToNearestHour(alert, { mode: 'ceil', nearestTo: 6 }); // 2026-04-10T18:00:00-05:00[America/Chicago]
```

## Good to know

- A time already on a boundary is returned unchanged in every mode: `ceil` of 14:00 is 14:00.
- `nearestTo` must divide 24. Other values are a TypeScript error and throw a `RangeError` at runtime.
