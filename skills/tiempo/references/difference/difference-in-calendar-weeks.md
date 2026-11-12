# differenceInCalendarWeeks

Returns the number of week boundaries from `earlierDate` to `laterDate`, ignoring the day within the week. Weeks start on Monday unless you pass `weekStartsOn`, so Sunday to the next Monday is one calendar week.

## Signature

```ts
function differenceInCalendarWeeks(
  laterDate: Temporal.PlainDate,
  earlierDate: Temporal.PlainDate,
  options?: { weekStartsOn?: DayOfWeek }
): number

function differenceInCalendarWeeks(
  laterDate: Temporal.Instant | Temporal.ZonedDateTime,
  earlierDate: Temporal.Instant | Temporal.ZonedDateTime,
  options?: { weekStartsOn?: DayOfWeek }
): number
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `laterDate` | `PlainDate` or `Instant \| ZonedDateTime` | The later value |
| `earlierDate` | Same kind as `laterDate` | The earlier value |
| `options.weekStartsOn` | `1 \| 2 \| 3 \| 4 \| 5 \| 6 \| 7` | First day of the week: 1 = Monday (default) … 7 = Sunday |

## Returns

A signed whole number of calendar weeks; negative if `laterDate` is before `earlierDate`.

## Examples

### Say "next week" in a US calendar

```ts
import { differenceInCalendarWeeks } from '@gobrand/tiempo';

const saturday = Temporal.PlainDate.from('2026-11-14');
const sunday = Temporal.PlainDate.from('2026-11-15');

differenceInCalendarWeeks(sunday, saturday); // 0 (same Monday-start week)
differenceInCalendarWeeks(sunday, saturday, { weekStartsOn: 7 }); // 1 (Sunday starts a new week)
```

## Good to know

- [differenceInWeeks](https://tiempo.gobrand.app/docs/difference/difference-in-weeks) counts complete 7-day spans. `differenceInCalendarWeeks` counts how many times a new week begins.
- PlainDates compare as given. An Instant uses its UTC date and a ZonedDateTime uses the date in its own timezone; convert both to one timezone first to count from one point of view.
- `weekStartsOn` uses Temporal's numbering, so Sunday is 7. date-fns numbers Sunday 0 and defaults to it; tiempo defaults to Monday.
- Mixing a PlainDate with an Instant or ZonedDateTime is a TypeScript error and throws a `TypeError`.
