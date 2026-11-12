# differenceInCalendarQuarters

Returns the number of calendar quarters from `earlierDate` to `laterDate`, ignoring the position within the quarter. March 31 to April 1 is one calendar quarter.

## Signature

```ts
function differenceInCalendarQuarters(
  laterDate: Temporal.PlainDate,
  earlierDate: Temporal.PlainDate
): number

function differenceInCalendarQuarters(
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

A signed whole number of calendar quarters; negative if `laterDate` is before `earlierDate`.

## Examples

### Compare reporting periods

```ts
import { differenceInCalendarQuarters, differenceInQuarters } from '@gobrand/tiempo';

const lastDayOfQ1 = Temporal.PlainDate.from('2026-03-31');
const firstDayOfQ2 = Temporal.PlainDate.from('2026-04-01');

differenceInCalendarQuarters(firstDayOfQ2, lastDayOfQ1); // 1
differenceInQuarters(firstDayOfQ2, lastDayOfQ1); // 0
```

## Good to know

- [differenceInQuarters](https://tiempo.gobrand.app/docs/difference/difference-in-quarters) counts complete quarters. `differenceInCalendarQuarters` counts quarter boundaries.
- PlainDates compare as given. An Instant uses its UTC date and a ZonedDateTime uses the date in its own timezone; convert both to one timezone first to count from one point of view.
- Quarters follow ISO months (Q1 is January–March) whatever the calendar of the input.
- Mixing a PlainDate with an Instant or ZonedDateTime is a TypeScript error and throws a `TypeError`.
