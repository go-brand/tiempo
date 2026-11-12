# isSameWeek

Returns `true` when both timestamps fall in the same week. Weeks run Monday to Sunday, as in ISO 8601, unless you pass `weekStartsOn`. Like [isSameDay](https://tiempo.gobrand.app/docs/comparison/is-same-day), each value is read in its own timezone, with Instants in UTC.

## Signature

```ts
function isSameWeek(
  date1: Temporal.Instant | Temporal.ZonedDateTime,
  date2: Temporal.Instant | Temporal.ZonedDateTime,
  options?: { weekStartsOn?: DayOfWeek }
): boolean;
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `date1` | `Instant \| ZonedDateTime` | The first timestamp |
| `date2` | `Instant \| ZonedDateTime` | The second timestamp |
| `options.weekStartsOn` | `1 \| 2 \| 3 \| 4 \| 5 \| 6 \| 7` | First day of the week: 1 = Monday (default) … 7 = Sunday |

## Returns

`true` if both values fall in the same week in their own timezones, otherwise `false`.

## Examples

### Put timesheet entries on the right week

```ts
import { isSameWeek } from '@gobrand/tiempo';

const sundayNight = Temporal.ZonedDateTime.from('2026-03-15T23:30:00-07:00[America/Los_Angeles]');
const mondayMorning = Temporal.ZonedDateTime.from('2026-03-16T09:00:00-07:00[America/Los_Angeles]');

isSameWeek(sundayNight, mondayMorning); // false (a new week starts on Monday)
isSameWeek(sundayNight, mondayMorning, { weekStartsOn: 7 }); // true (the week started on Sunday)
```

### Weeks can cross the new year

```ts
import { isSameWeek } from '@gobrand/tiempo';

const newYearsEve = Temporal.ZonedDateTime.from('2026-12-31T18:00:00+01:00[Europe/Berlin]');
const newYearsDay = Temporal.ZonedDateTime.from('2027-01-01T12:00:00+01:00[Europe/Berlin]');

isSameWeek(newYearsEve, newYearsDay); // true (both in ISO week 53 of 2026)
```

## Good to know

- `weekStartsOn` uses Temporal's numbering, so Sunday is 7, not 0 as in date-fns. [startOfWeek](https://tiempo.gobrand.app/docs/boundaries/start-of-week) takes the same option.
