# eachQuarterOfInterval

Returns an array of ZonedDateTime objects for each quarter within the interval. Each element represents the first moment of the quarter (1st day of the quarter's starting month at midnight). The interval is inclusive of both start and end quarters. Quarters: Q1 = Jan–Mar, Q2 = Apr–Jun, Q3 = Jul–Sep, Q4 = Oct–Dec.

## Signature

```ts
function eachQuarterOfInterval(interval: {
  start: Temporal.Instant | Temporal.ZonedDateTime;
  end: Temporal.Instant | Temporal.ZonedDateTime;
}): Temporal.ZonedDateTime[]
function eachQuarterOfInterval(interval: {
  start: Temporal.PlainDate;
  end: Temporal.PlainDate;
}): Temporal.PlainDate[]
```

Input type determines output type: a `PlainDate` interval needs no timezone and returns `PlainDate[]` (the first day of each quarter).

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `interval` | `{ start, end }` | The interval with start and end datetimes |

## Returns

Array of `Temporal.ZonedDateTime` at the start of each quarter in the interval.

For `Instant` inputs, UTC is used as the timezone. For `ZonedDateTime` inputs, the timezone of the start date is preserved.

## Examples

### Basic usage

```ts
import { eachQuarterOfInterval } from '@gobrand/tiempo';

const start = Temporal.ZonedDateTime.from('2025-02-15T10:00:00Z[UTC]');
const end = Temporal.ZonedDateTime.from('2025-11-20T14:00:00Z[UTC]');

const quarters = eachQuarterOfInterval({ start, end });
// [
//   2025-01-01T00:00:00Z[UTC], // Q1
//   2025-04-01T00:00:00Z[UTC], // Q2
//   2025-07-01T00:00:00Z[UTC], // Q3
//   2025-10-01T00:00:00Z[UTC]  // Q4
// ]
```

### Cross-year boundary

```ts
const start = Temporal.ZonedDateTime.from('2024-11-15T00:00:00Z[UTC]');
const end = Temporal.ZonedDateTime.from('2025-05-15T00:00:00Z[UTC]');

const quarters = eachQuarterOfInterval({ start, end });
// [
//   2024-10-01T00:00:00Z[UTC], // Q4 2024
//   2025-01-01T00:00:00Z[UTC], // Q1 2025
//   2025-04-01T00:00:00Z[UTC]  // Q2 2025
// ]
```

### From PlainDate (no timezone)

```ts
const quarters = eachQuarterOfInterval({
  start: Temporal.PlainDate.from('2025-02-15'),
  end: Temporal.PlainDate.from('2025-08-20'),
});
// [2025-01-01, 2025-04-01, 2025-07-01]  (PlainDate[])
```

## Common Patterns

### Build quarterly reporting periods

```ts
import { eachQuarterOfInterval, addQuarters } from '@gobrand/tiempo';

function getQuarterlyPeriods(
  fiscalStart: Temporal.ZonedDateTime,
  fiscalEnd: Temporal.ZonedDateTime
) {
  return eachQuarterOfInterval({ start: fiscalStart, end: fiscalEnd }).map(quarterStart => ({
    periodStart: quarterStart,
    periodEnd: addQuarters(quarterStart, 1).subtract({ nanoseconds: 1 })
  }));
}
```
