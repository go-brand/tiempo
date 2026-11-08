# eachDayOfInterval

Returns every calendar day from `start` to `end`, including both.

## Signature

```ts
function eachDayOfInterval(interval: {
  start: Temporal.PlainDate;
  end: Temporal.PlainDate;
}): Temporal.PlainDate[]

function eachDayOfInterval(interval: {
  start: Temporal.Instant | Temporal.ZonedDateTime;
  end: Temporal.Instant | Temporal.ZonedDateTime;
}): Temporal.ZonedDateTime[]
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `interval.start` | `PlainDate` or `Instant \| ZonedDateTime` | Start of the range |
| `interval.end` | Same kind as `start` | End of the range, included |

## Returns

PlainDate endpoints give a `PlainDate[]`. Instant or ZonedDateTime endpoints give a `ZonedDateTime[]` at the start of each day, in the timezone of `start` (UTC for an Instant). A reversed range gives `[]`.

## Examples

### Build a week view for a calendar

```ts
import { eachDayOfInterval, isWeekend } from '@gobrand/tiempo';

const week = eachDayOfInterval({
  start: Temporal.PlainDate.from('2026-03-02'),
  end: Temporal.PlainDate.from('2026-03-08'),
});

week.map(String); // ['2026-03-02', '2026-03-03', '2026-03-04', '2026-03-05', '2026-03-06', '2026-03-07', '2026-03-08']
week.filter((day) => !isWeekend(day)).length; // 5
```

### Days of a trip in the traveller's timezone

```ts
import { eachDayOfInterval } from '@gobrand/tiempo';

const days = eachDayOfInterval({
  start: Temporal.ZonedDateTime.from('2026-03-07T15:00:00-05:00[America/New_York]'),
  end: Temporal.ZonedDateTime.from('2026-03-09T08:00:00-04:00[America/New_York]'),
});

days.map(String); // ['2026-03-07T00:00:00-05:00[America/New_York]', '2026-03-08T00:00:00-05:00[America/New_York]', '2026-03-09T00:00:00-04:00[America/New_York]']
```

### Reversed ranges return an empty array

```ts
import { eachDayOfInterval } from '@gobrand/tiempo';

const checkIn = Temporal.PlainDate.from('2026-07-14');
const checkOut = Temporal.PlainDate.from('2026-07-17');

eachDayOfInterval({ start: checkIn, end: checkOut }).length; // 4
eachDayOfInterval({ start: checkOut, end: checkIn }); // []
```

## Good to know

- Both ends count: 14 to 17 July is 4 dates, while [differenceInDays](https://tiempo.gobrand.app/docs/difference/difference-in-days) counts 3 nights.
- Mixing a PlainDate with an Instant or ZonedDateTime is a TypeScript error and throws a `TypeError`.
