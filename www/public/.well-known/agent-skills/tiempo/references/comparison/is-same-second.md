# isSameSecond

Returns `true` when both timestamps fall in the same second, ignoring milliseconds and smaller units. Like [isSameDay](https://tiempo.gobrand.app/docs/comparison/is-same-day), each value is read in its own timezone, with Instants in UTC.

## Signature

```ts
function isSameSecond(
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

`true` if both values match from the year down to the second in their own timezones, otherwise `false`.

## Examples

### Ignore a double-clicked submit button

```ts
import { isSameSecond } from '@gobrand/tiempo';

const firstClick = Temporal.Instant.from('2026-02-10T12:00:05.120Z');

isSameSecond(firstClick, Temporal.Instant.from('2026-02-10T12:00:05.870Z')); // true
isSameSecond(firstClick, Temporal.Instant.from('2026-02-10T12:00:06.010Z')); // false (a new second)
```

To check whether two events are within one second of each other, use [differenceInMilliseconds](https://tiempo.gobrand.app/docs/difference/difference-in-milliseconds).
