# isSameHour

Returns `true` when both timestamps fall in the same hour of the same day, for example both between 15:00 and 15:59. Like [isSameDay](https://tiempo.gobrand.app/docs/comparison/is-same-day), each value is read in its own timezone, with Instants in UTC.

## Signature

```ts
function isSameHour(
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

`true` if both values have the same date and hour in their own timezones, otherwise `false`.

## Examples

### Bucket API requests by hour

```ts
import { isSameHour } from '@gobrand/tiempo';

const first = Temporal.Instant.from('2026-04-01T10:10:00Z');

isSameHour(first, Temporal.Instant.from('2026-04-01T10:59:00Z')); // true
isSameHour(first, Temporal.Instant.from('2026-04-01T11:00:00Z')); // false (a new clock hour, 50 minutes later)
```

## Good to know

- In zones with a half-hour offset, such as `Asia/Kolkata`, one UTC hour spans two local hours; convert with [toZonedTime](https://tiempo.gobrand.app/docs/conversion/to-zoned-time) when the local hour is what you mean.
