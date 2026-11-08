# differenceInDays

Returns the calendar days from `earlierDate` to `laterDate`. Calendar days, not 24-hour blocks: 09:00 Saturday to 09:00 Monday is 2 days even across a DST change.

## Signature

```ts
function differenceInDays(
  laterDate: Temporal.PlainDate,
  earlierDate: Temporal.PlainDate,
  options?: DifferenceOptions
): number

function differenceInDays(
  laterDate: Temporal.Instant | Temporal.ZonedDateTime,
  earlierDate: Temporal.Instant | Temporal.ZonedDateTime,
  options?: DifferenceOptions
): number

interface DifferenceOptions {
  fractional?: boolean;
}
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `laterDate` | `PlainDate` or `Instant \| ZonedDateTime` | The value to subtract from |
| `earlierDate` | Same kind as `laterDate` | The value to subtract |
| `options.fractional` | `boolean` | Return the exact value instead of truncating toward zero (default `false`) |

## Returns

A signed number of days, truncated toward zero unless `fractional` is set. Two PlainDates always give a whole number.

## Examples

### Count the nights in a hotel stay

```ts
import { differenceInDays } from '@gobrand/tiempo';

const checkIn = Temporal.PlainDate.from('2026-07-14');
const checkOut = Temporal.PlainDate.from('2026-07-17');

differenceInDays(checkOut, checkIn); // 3
differenceInDays(checkIn, checkOut); // -3
```

### Count days across a DST change

```ts
import { differenceInDays, differenceInHours } from '@gobrand/tiempo';

const saturday = Temporal.ZonedDateTime.from('2026-03-07T09:00:00-05:00[America/New_York]');
const monday = Temporal.ZonedDateTime.from('2026-03-09T09:00:00-04:00[America/New_York]');

differenceInDays(monday, saturday); // 2
differenceInHours(monday, saturday); // 47
```

### Get partial days

```ts
import { differenceInDays } from '@gobrand/tiempo';

const uploaded = Temporal.Instant.from('2026-04-10T00:00:00Z');
const reviewed = Temporal.Instant.from('2026-04-11T12:00:00Z');

differenceInDays(reviewed, uploaded); // 1
differenceInDays(reviewed, uploaded, { fractional: true }); // 1.5
```

## Good to know

- When the two datetimes are in different timezones, days are counted in `earlierDate`'s timezone. Instants count as UTC.
- A stay from 14 to 17 July is 3 nights but 4 dates. To list the dates, use [eachDayOfInterval](https://tiempo.gobrand.app/docs/intervals/each-day-of-interval).
- Mixing a PlainDate with an Instant or ZonedDateTime is a TypeScript error and throws a `TypeError`.
