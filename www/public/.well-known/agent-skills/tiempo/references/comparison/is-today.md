# isToday

Returns `true` when the value falls on today's date in the given timezone. Instants and ZonedDateTimes are converted to that timezone first; PlainDates are compared as they are.

## Signature

```ts
function isToday(
  date: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate,
  timezone: Timezone
): boolean;
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `date` | `Instant \| ZonedDateTime \| PlainDate` | The value to check |
| `timezone` | `Timezone` | The timezone that defines "today" |

## Returns

`true` if `date` is on today's date in `timezone`, otherwise `false`.

## Examples

### Check whether an event is today for the viewer

```ts
import { isToday, today } from '@gobrand/tiempo';

isToday(today('Asia/Tokyo'), 'Asia/Tokyo'); // true
isToday(Temporal.Instant.from('2020-03-01T09:00:00Z'), 'America/New_York'); // false
```

## Good to know

- "Today" depends on the timezone: the same instant can be today in New York and tomorrow in Tokyo. Pass the viewer's timezone, not the server's.
- See also [isTomorrow](https://tiempo.gobrand.app/docs/comparison/is-tomorrow), [isYesterday](https://tiempo.gobrand.app/docs/comparison/is-yesterday), and [today](https://tiempo.gobrand.app/docs/current-time/today).
