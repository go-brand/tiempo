# API conventions

Every function follows the same few rules, so once you know them you can guess the rest.

## Pick the value that matches your data

| Value | What it is | Use it for |
|-------|------------|------------|
| `Instant` | One exact moment, no timezone | A `created_at` timestamp from your database |
| `ZonedDateTime` | An exact moment in a specific timezone | A meeting at 09:30 in America/Los_Angeles |
| `PlainDate` | A calendar date, no time or timezone | A birthday, a due date, a date-picker value |
| `PlainTime` | A clock time, no date or timezone | Opening hours, a daily reminder at 08:00 |

Functions keep the type you gave them:

- **`Instant` inputs are read in UTC** and datetime results come back as UTC `ZonedDateTime`s.
- **`ZonedDateTime` inputs keep their timezone.** `addDays` on a Tokyo time returns a Tokyo time.
- **`PlainDate` inputs stay dates.** No timezone is invented for them.

## Dates and timestamps don't mix

Passing a `PlainDate` together with an `Instant` or `ZonedDateTime` is a TypeScript error. Convert first, choosing the timezone:

```ts
import { toPlainDate } from '@gobrand/tiempo';

// Which calendar date was this order placed on, for a customer in Tokyo?
const orderDate = toPlainDate(Temporal.Instant.from('2026-03-14T18:30:00Z'), 'Asia/Tokyo'); // 2026-03-15
```

## Argument order: two values or an interval

Differences take `(laterDate, earlierDate)`, like subtraction. Ranges take one `{ start, end }` object. Both follow date-fns.

| Task | Call | Result |
|------|------|--------|
| How far apart? | `differenceInDays(later, earlier)` | Signed count; swap the arguments and it turns negative |
| Which comes first? | `isBefore(a, b)` | `true` if `a` is before `b` |
| Move a value | `addDays(date, 3)` | A new value; the input is never changed |
| List a range | `eachDayOfInterval({ start, end })` | Every day from start through end, inclusive |

```ts
import { toPlainDate, differenceInDays, eachDayOfInterval, addDays, isBefore } from '@gobrand/tiempo';

const start = toPlainDate('2026-10-10');
const end = toPlainDate('2026-10-12');

const dayCount = differenceInDays(end, start); // 2
const reversedCount = differenceInDays(start, end); // -2
const calendarDates = eachDayOfInterval({ start, end }).map(date => date.toString());
// ['2026-10-10', '2026-10-11', '2026-10-12']
const nextDay = addDays(start, 1).toString(); // '2026-10-11'
const isEarlier = isBefore(start, end); // true
```

Two days between the dates; three dates in the range.

## Week, month, quarter and year ranges start at the period boundary

`eachWeekOfInterval`, `eachMonthOfInterval`, `eachQuarterOfInterval` and `eachYearOfInterval` return the start of every period the range touches, so the first result can be before your start date. Weeks start on Monday.

```ts
import { toPlainDate, eachMonthOfInterval } from '@gobrand/tiempo';

const monthStarts = eachMonthOfInterval({
  start: toPlainDate('2026-01-15'),
  end: toPlainDate('2026-03-02'),
}).map(date => date.toString());
// ['2026-01-01', '2026-02-01', '2026-03-01']
```

## Whole numbers by default

Differences are truncated toward zero: 1 day and 23 hours is `1`. Pass `{ fractional: true }` for the exact value.

## "Today" always needs a timezone

It can be tomorrow in Tokyo and still today in New York, so these functions take the timezone instead of guessing: `today('Europe/Madrid')`, `isToday(value, 'Asia/Tokyo')`.

## Selection functions return what you gave them

`min`, `max`, `clamp` and `closestTo` return one of the values you passed in, unchanged.

## Native Temporal and the polyfill

Values from your runtime's built-in `Temporal` and from `@js-temporal/polyfill` both work, and can be mixed. Avoid `instanceof` checks on results.

Every input and return type is in the [type matrix](https://tiempo.gobrand.app/docs/type-matrix).
