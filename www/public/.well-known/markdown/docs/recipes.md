# Recipes

Complete solutions to tasks most apps need. Where an example needs the current time it uses a fixed value; in your app, use `now(timezone)`.

## Show a stored timestamp in the user's timezone

```ts
import { toZonedTime, format } from '@gobrand/tiempo';

const createdAt = '2026-03-14T18:30:00Z'; // from your database

format(toZonedTime(createdAt, 'America/Los_Angeles'), 'MMM d, h:mm a'); // "Mar 14, 11:30 AM"
format(toZonedTime(createdAt, 'Asia/Tokyo'), 'MMM d, HH:mm'); // "Mar 15, 03:30"
```

## Save a date and time from a form

Combine the two inputs in the user's timezone, then store UTC.

```ts
import { toIso } from '@gobrand/tiempo';

const date = '2026-07-03'; // <input type="date">
const time = '14:30'; // <input type="time">

const appointment = Temporal.PlainDate.from(date)
  .toPlainDateTime(time)
  .toZonedDateTime('Europe/London');

toIso(appointment); // "2026-07-03T13:30:00Z"
```

## Schedule a daily standup across a DST change

The meeting stays at 09:30 local time; its UTC time moves.

```ts
import { addDays, toIso } from '@gobrand/tiempo';

const standup = Temporal.PlainDate.from('2026-03-06')
  .toPlainDateTime('09:30')
  .toZonedDateTime('America/Los_Angeles');

toIso(standup); // "2026-03-06T17:30:00Z"
toIso(addDays(standup, 3)); // "2026-03-09T16:30:00Z" (still 09:30 local, after DST starts)
```

## Find the next 09:00

```ts
import { addDays, isAfter } from '@gobrand/tiempo';

const timezone = 'Europe/Madrid';
const current = Temporal.ZonedDateTime.from('2026-05-20T11:15:00+02:00[Europe/Madrid]'); // now(timezone) in your app

const todayAtNine = current.toPlainDate().toPlainDateTime('09:00').toZonedDateTime(timezone);
const next = isAfter(current, todayAtNine) ? addDays(todayAtNine, 1) : todayAtNine;

next.toString(); // 2026-05-21T09:00:00+02:00[Europe/Madrid]
```

## Check opening hours

```ts
import { isPlainTimeBefore } from '@gobrand/tiempo';

const opens = Temporal.PlainTime.from('09:00');
const closes = Temporal.PlainTime.from('17:30');

function isOpen(current: Temporal.ZonedDateTime): boolean {
  const time = current.withTimeZone('America/New_York').toPlainTime();
  return !isPlainTimeBefore(time, opens) && isPlainTimeBefore(time, closes);
}

isOpen(Temporal.ZonedDateTime.from('2026-05-20T15:00:00+00:00[UTC]')); // true (11:00 in New York)
isOpen(Temporal.ZonedDateTime.from('2026-05-20T22:00:00+00:00[UTC]')); // false (18:00 in New York)
```

## Group events by the user's calendar day

```ts
import { toPlainDate } from '@gobrand/tiempo';

const orders = ['2026-03-14T21:00:00Z', '2026-03-14T23:30:00Z', '2026-03-15T08:00:00Z'];

function groupByDay(isoTimestamps: string[], timezone: string) {
  const groups = new Map<string, string[]>();
  for (const iso of isoTimestamps) {
    const day = toPlainDate(iso, timezone).toString();
    groups.set(day, [...(groups.get(day) ?? []), iso]);
  }
  return groups;
}

[...groupByDay(orders, 'Asia/Tokyo').keys()]; // ["2026-03-15"]
[...groupByDay(orders, 'America/New_York').keys()]; // ["2026-03-14", "2026-03-15"]
```
