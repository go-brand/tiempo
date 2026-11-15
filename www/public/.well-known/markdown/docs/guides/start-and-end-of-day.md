# Start and end of day in a timezone

"Today's orders" means today where the business is, not today in UTC. Midnight in Los Angeles is 07:00 or 08:00 UTC, depending on the time of year.

## Midnight in a timezone

`startOfDay` keeps the timezone of the value you give it. Convert first, then take the boundary:

```ts
import { toZonedTime, startOfDay, toIso } from '@gobrand/tiempo';

const now = toZonedTime('2026-07-03T02:30:00Z', 'America/Los_Angeles'); // July 2, 19:30 local

startOfDay(now); // 2026-07-02T00:00:00-07:00[America/Los_Angeles]
toIso(startOfDay(now)); // "2026-07-02T07:00:00Z"
```

In UTC that moment is already July 3, which is why reading timestamps in UTC puts evening orders on the wrong day.

## Query one day of records stored in UTC

Use a half-open range: from the start of the day, up to but not including the start of the next day. It has no gap at 23:59:59.999 and works whatever the length of the day.

```ts
import { startOfDay, addDays, toIso } from '@gobrand/tiempo';

const day = Temporal.PlainDate.from('2026-07-02');
const from = startOfDay(day, 'America/Los_Angeles');
const to = startOfDay(addDays(day, 1), 'America/Los_Angeles');

toIso(from); // "2026-07-02T07:00:00Z"
toIso(to); // "2026-07-03T07:00:00Z"
// WHERE created_at >= $from AND created_at < $to
```

With a `PlainDate`, `startOfDay` needs the timezone as its second argument, because a date alone does not say when it starts.

## Days that are not 24 hours long

On the day clocks change, the range is 23 or 25 hours. Computing it from midnights handles that; adding 24 hours to the start does not:

```ts
import { startOfDay, addDays, differenceInHours } from '@gobrand/tiempo';

const springForward = Temporal.PlainDate.from('2026-03-08');
const from = startOfDay(springForward, 'America/Los_Angeles');
const to = startOfDay(addDays(springForward, 1), 'America/Los_Angeles');

differenceInHours(to, from); // 23
```

## The last moment of the day

`endOfDay` returns the last nanosecond of the day, for display or for APIs that need an inclusive end:

```ts
import { endOfDay } from '@gobrand/tiempo';

endOfDay(Temporal.PlainDate.from('2026-07-02'), 'Europe/Madrid').toString(); // 2026-07-02T23:59:59.999999999+02:00[Europe/Madrid]
```

For database queries, prefer the half-open range above. Databases store microseconds or milliseconds, and an inclusive end written with fewer digits can miss the last fraction of a second.

## Today

`today(timezone)` returns the current date in a timezone. Pass the timezone explicitly; there is no hidden "local" timezone on a server.

```ts
import { today, startOfDay } from '@gobrand/tiempo';

const from = startOfDay(today('America/Los_Angeles'), 'America/Los_Angeles');
```

## Related

- [startOfDay](https://tiempo.gobrand.app/docs/boundaries/start-of-day), [endOfDay](https://tiempo.gobrand.app/docs/boundaries/end-of-day), [today](https://tiempo.gobrand.app/docs/current-time/today)
- [startOfWeek](https://tiempo.gobrand.app/docs/boundaries/start-of-week) and [startOfMonth](https://tiempo.gobrand.app/docs/boundaries/start-of-month) work the same way
- [Add days across daylight saving time](https://tiempo.gobrand.app/docs/guides/dst-safe-date-math)
