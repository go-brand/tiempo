# isToday

Returns true if the value falls on today's date in the given timezone.

"Today" depends on where you are, so the timezone is required. Instant and ZonedDateTime inputs are converted to that timezone before taking their date. PlainDate inputs are compared with today's date in that timezone directly.

## Signature

```ts
function isToday(
  date: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate,
  timezone: Timezone
): boolean
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `date` | `Instant \| ZonedDateTime \| PlainDate` | The value to check |
| `timezone` | `Timezone` | The timezone that defines "today" |

## Returns

`true` if `date` is on today's date in `timezone`, `false` otherwise.

## Examples

```ts
import { isToday, today } from '@gobrand/tiempo';

isToday(Temporal.Now.instant(), 'America/New_York'); // true
isToday(today('Asia/Tokyo'), 'Asia/Tokyo'); // true
```

### Label events for a user

```ts
import { isToday, isTomorrow, isYesterday } from '@gobrand/tiempo';

function dayLabel(start: Temporal.Instant, timezone: string): string | undefined {
  if (isToday(start, timezone)) return 'Today';
  if (isTomorrow(start, timezone)) return 'Tomorrow';
  if (isYesterday(start, timezone)) return 'Yesterday';
  return undefined;
}
```

The same instant can be today in one timezone and tomorrow in another. Pass the viewer's timezone, not the server's.

## Related

- [isTomorrow](https://tiempo.gobrand.app/docs/comparison/is-tomorrow), [isYesterday](https://tiempo.gobrand.app/docs/comparison/is-yesterday)
- [today](https://tiempo.gobrand.app/docs/current-time/today) returns today's PlainDate in a timezone
