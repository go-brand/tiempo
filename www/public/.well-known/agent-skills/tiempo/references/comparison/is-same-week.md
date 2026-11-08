# isSameWeek

Returns `true` when both timestamps fall in the same ISO week, which runs Monday to Sunday. Like [isSameDay](https://tiempo.gobrand.app/docs/comparison/is-same-day), each value is read in its own timezone, with Instants in UTC.

## Signature

```ts
function isSameWeek(
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

`true` if both values have the same ISO week and week-year in their own timezones, otherwise `false`.

## Examples

### Put timesheet entries on the right week

```ts
import { isSameWeek } from '@gobrand/tiempo';

const sundayNight = Temporal.ZonedDateTime.from('2026-03-15T23:30:00-07:00[America/Los_Angeles]');
const mondayMorning = Temporal.ZonedDateTime.from('2026-03-16T09:00:00-07:00[America/Los_Angeles]');

isSameWeek(sundayNight, mondayMorning); // false (a new week starts on Monday)
```

### Weeks can cross the new year

```ts
import { isSameWeek } from '@gobrand/tiempo';

const newYearsEve = Temporal.ZonedDateTime.from('2026-12-31T18:00:00+01:00[Europe/Berlin]');
const newYearsDay = Temporal.ZonedDateTime.from('2027-01-01T12:00:00+01:00[Europe/Berlin]');

isSameWeek(newYearsEve, newYearsDay); // true (both in ISO week 53 of 2026)
```

## Good to know

- Weeks always start on Monday; there is no Sunday-start option. [startOfWeek](https://tiempo.gobrand.app/docs/boundaries/start-of-week) uses the same rule.
