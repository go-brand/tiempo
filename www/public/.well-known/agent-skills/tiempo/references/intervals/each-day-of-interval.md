# eachDayOfInterval

Returns every calendar day in an interval, **including both endpoints**.

- Two PlainDate endpoints return `PlainDate[]`, preserving the start calendar. No timezone or clock time is introduced.
- Instant/ZonedDateTime endpoints return `ZonedDateTime[]`, at the first valid moment of each day in the start timezone.

Reversed endpoints return `[]`; equal PlainDate endpoints return one date. Date-only intervals include every date. Timezone-aware intervals skip nonexistent local dates without duplicates. Native and polyfill values may be mixed.

Both endpoints must be PlainDates, or both must be timeline values (Instant/ZonedDateTime). Mixing these domains is rejected in TypeScript and at runtime. If PlainDate endpoints use different calendars, the end is interpreted in the start calendar.

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
| `interval` | `{ start, end }` | Two PlainDate endpoints, or two Instant/ZonedDateTime endpoints |

## Returns

Array of `Temporal.PlainDate` for PlainDate endpoints, or `Temporal.ZonedDateTime` at the start of each day for timeline endpoints.

For `Instant` inputs, UTC is used as the timezone. For `ZonedDateTime` inputs, the timezone of the start date is preserved.

## Examples

### List calendar dates

```ts
import { toPlainDate, eachDayOfInterval } from '@gobrand/tiempo';

const start = toPlainDate('2026-10-10');
const end = toPlainDate('2026-10-12');
const dates = eachDayOfInterval({ start, end }); // Temporal.PlainDate[]

dates.map(date => date.toString()); // ['2026-10-10', '2026-10-11', '2026-10-12']
eachDayOfInterval({ start: end, end: start }); // []
```

The interval includes three dates; `differenceInDays(end, start)` returns the two days between its endpoints.

### Basic usage

```ts
import { eachDayOfInterval } from '@gobrand/tiempo';

const start = Temporal.ZonedDateTime.from('2025-01-06T10:00:00Z[UTC]');
const end = Temporal.ZonedDateTime.from('2025-01-10T14:00:00Z[UTC]');

const days = eachDayOfInterval({ start, end });
// [
//   2025-01-06T00:00:00Z[UTC],
//   2025-01-07T00:00:00Z[UTC],
//   2025-01-08T00:00:00Z[UTC],
//   2025-01-09T00:00:00Z[UTC],
//   2025-01-10T00:00:00Z[UTC]
// ]
```

### With timezone

```ts
const start = Temporal.ZonedDateTime.from('2025-01-06T10:00:00-05:00[America/New_York]');
const end = Temporal.ZonedDateTime.from('2025-01-08T14:00:00-05:00[America/New_York]');

const days = eachDayOfInterval({ start, end });
// [
//   2025-01-06T00:00:00-05:00[America/New_York],
//   2025-01-07T00:00:00-05:00[America/New_York],
//   2025-01-08T00:00:00-05:00[America/New_York]
// ]
```

### With Instant (uses UTC)

```ts
const start = Temporal.Instant.from('2025-01-06T00:00:00Z');
const end = Temporal.Instant.from('2025-01-08T00:00:00Z');

const days = eachDayOfInterval({ start, end });
// [
//   2025-01-06T00:00:00Z[UTC],
//   2025-01-07T00:00:00Z[UTC],
//   2025-01-08T00:00:00Z[UTC]
// ]
```

### Single day interval

```ts
const date = Temporal.ZonedDateTime.from('2025-01-15T12:00:00Z[UTC]');

eachDayOfInterval({ start: date, end: date });
// [2025-01-15T00:00:00Z[UTC]]
```

## Common Patterns

### Build a calendar grid

```ts
import { eachDayOfInterval, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from '@gobrand/tiempo';

function getCalendarDays(month: Temporal.ZonedDateTime) {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);

  // Extend to full weeks for calendar grid
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
}
```

### Generate date range for availability

```ts
import { eachDayOfInterval, isSameDay } from '@gobrand/tiempo';

function getAvailableDays(
  rangeStart: Temporal.ZonedDateTime,
  rangeEnd: Temporal.ZonedDateTime,
  bookedDates: Temporal.ZonedDateTime[]
) {
  return eachDayOfInterval({ start: rangeStart, end: rangeEnd })
    .filter(day => !bookedDates.some(booked => isSameDay(day, booked)));
}
```
