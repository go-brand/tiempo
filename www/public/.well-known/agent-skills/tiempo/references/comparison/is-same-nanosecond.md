# isSameNanosecond

Returns `true` when both timestamps show the same date and time down to the nanosecond, each read in its own timezone (Instants in UTC). To ask whether two values are the same instant, use [isEqual](https://tiempo.gobrand.app/docs/comparison/is-equal) instead.

## Signature

```ts
function isSameNanosecond(
  date1: Temporal.Instant | Temporal.ZonedDateTime,
  date2: Temporal.Instant | Temporal.ZonedDateTime
): boolean;
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `date1` | `Instant \| ZonedDateTime` | The first timestamp |
| `date2` | `Instant \| ZonedDateTime` | The second timestamp |

## Returns

`true` if both values match from the year down to the nanosecond in their own timezones, otherwise `false`.

## Examples

### The same instant in two timezones has different clock readings

```ts
import { isEqual, isSameNanosecond } from '@gobrand/tiempo';

const madrid = Temporal.ZonedDateTime.from('2026-06-15T12:00:00+02:00[Europe/Madrid]');
const newYork = Temporal.ZonedDateTime.from('2026-06-15T06:00:00-04:00[America/New_York]');

isEqual(madrid, newYork); // true (same instant)
isSameNanosecond(madrid, newYork); // false (12:00 and 06:00)
```

## Good to know

- When clocks fall back, a reading repeats: `01:30-04:00` and `01:30-05:00` in New York are an hour apart, but `isSameNanosecond` returns `true`.
- To require the same instant, timezone, and calendar, use `zoned1.equals(zoned2)`.
