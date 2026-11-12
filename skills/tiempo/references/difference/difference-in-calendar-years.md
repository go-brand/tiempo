# differenceInCalendarYears

Returns the number of calendar years from `earlierDate` to `laterDate`, ignoring the month and day. December 31 to January 1 is one calendar year.

## Signature

```ts
function differenceInCalendarYears(
  laterDate: Temporal.PlainDate,
  earlierDate: Temporal.PlainDate
): number

function differenceInCalendarYears(
  laterDate: Temporal.Instant | Temporal.ZonedDateTime,
  earlierDate: Temporal.Instant | Temporal.ZonedDateTime
): number
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `laterDate` | `PlainDate` or `Instant \| ZonedDateTime` | The later value |
| `earlierDate` | Same kind as `laterDate` | The earlier value |

## Returns

A signed whole number of calendar years; negative if `laterDate` is before `earlierDate`.

## Examples

### Group by year, not by age

```ts
import { differenceInCalendarYears, differenceInYears } from '@gobrand/tiempo';

const born = Temporal.PlainDate.from('2000-12-31');
const today = Temporal.PlainDate.from('2026-11-11');

differenceInCalendarYears(today, born); // 26
differenceInYears(today, born); // 25 (the age)
```

## Good to know

- [differenceInYears](https://tiempo.gobrand.app/docs/difference/difference-in-years) counts complete years, such as an age. `differenceInCalendarYears` subtracts the years.
- PlainDates compare as given. An Instant uses its UTC date and a ZonedDateTime uses the date in its own timezone; convert both to one timezone first to count from one point of view.
- Years are counted in the earlier date's calendar.
- Mixing a PlainDate with an Instant or ZonedDateTime is a TypeScript error and throws a `TypeError`.
