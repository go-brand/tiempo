# addDays

Adds calendar days and keeps the wall-clock time, so 09:00 stays 09:00 across a daylight saving time change. For exact 24-hour periods, use [addHours](https://tiempo.gobrand.app/docs/arithmetic/add-hours).

## Signature

```ts
function addDays(input: Temporal.PlainDate, days: number): Temporal.PlainDate;
function addDays(
  input: Temporal.Instant | Temporal.ZonedDateTime,
  days: number
): Temporal.ZonedDateTime;
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `input` | `Temporal.PlainDate \| Temporal.Instant \| Temporal.ZonedDateTime` | The starting date or datetime |
| `days` | `number` | Whole number of days to add; negative goes back. Fractions throw a `RangeError`. |

## Returns

A `PlainDate` for a `PlainDate` input. Otherwise a `ZonedDateTime` in the input's timezone, or in UTC for an `Instant`.

## Examples

### Set an invoice due date 30 days out

```ts
import { addDays } from '@gobrand/tiempo';

const issued = Temporal.PlainDate.from('2026-03-16');

addDays(issued, 30); // 2026-04-15
```

### Keep a daily reminder at 09:00 across a DST change

March 8, 2026 is only 23 hours long in New York.

```ts
import { addDays, addHours } from '@gobrand/tiempo';

const reminder = Temporal.ZonedDateTime.from('2026-03-07T09:00:00-05:00[America/New_York]');

addDays(reminder, 1); // 2026-03-08T09:00:00-04:00[America/New_York]
addHours(reminder, 24); // 2026-03-08T10:00:00-04:00[America/New_York]
```

### Count days in a local timezone, not UTC

An `Instant` is counted in UTC. Convert it with [toZonedTime](https://tiempo.gobrand.app/docs/conversion/to-zoned-time) to keep a local time.

```ts
import { addDays, toZonedTime } from '@gobrand/tiempo';

const checkIn = Temporal.Instant.from('2026-03-07T20:00:00Z');

addDays(checkIn, 2); // 2026-03-09T20:00:00+00:00[UTC]
addDays(toZonedTime(checkIn, 'America/New_York'), 2); // 2026-03-09T15:00:00-04:00[America/New_York]
```

## Good to know

- A local time skipped by a DST change moves forward by the gap: 02:30 on March 7 plus one day is 03:30 on March 8 in New York.
- To skip weekends, use [addBusinessDays](https://tiempo.gobrand.app/docs/business-days/add-business-days).
