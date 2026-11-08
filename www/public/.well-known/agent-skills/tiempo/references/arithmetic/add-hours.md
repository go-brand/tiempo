# addHours

Adds exact hours of elapsed time, so the wall-clock time shifts across a daylight saving time change. To keep the same local time on another day, use [addDays](https://tiempo.gobrand.app/docs/arithmetic/add-days).

## Signature

```ts
function addHours(
  input: Temporal.Instant | Temporal.ZonedDateTime,
  hours: number
): Temporal.ZonedDateTime;
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `input` | `Temporal.Instant \| Temporal.ZonedDateTime` | The starting datetime |
| `hours` | `number` | Whole number of hours to add; negative goes back. Fractions throw a `RangeError`; for 90 minutes, use [addMinutes](https://tiempo.gobrand.app/docs/arithmetic/add-minutes). |

## Returns

A `ZonedDateTime` in the input's timezone, or in UTC for an `Instant`.

## Examples

### Set a 24-hour SLA deadline across a DST change

Clocks in New York move forward on the night of March 7, 2026.

```ts
import { addHours } from '@gobrand/tiempo';

const opened = Temporal.ZonedDateTime.from('2026-03-07T15:00:00-05:00[America/New_York]');

addHours(opened, 24); // 2026-03-08T16:00:00-04:00[America/New_York]
```

### Find a flight's arrival time in New York

An 8-hour flight from Madrid. Show the arrival in another timezone with [toZonedTime](https://tiempo.gobrand.app/docs/conversion/to-zoned-time).

```ts
import { addHours, toZonedTime } from '@gobrand/tiempo';

const departure = Temporal.ZonedDateTime.from('2026-06-10T11:00:00+02:00[Europe/Madrid]');
const arrival = addHours(departure, 8);

arrival; // 2026-06-10T19:00:00+02:00[Europe/Madrid]
toZonedTime(arrival, 'America/New_York'); // 2026-06-10T13:00:00-04:00[America/New_York]
```
