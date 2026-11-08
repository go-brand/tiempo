# isAfter

Returns true if the first value is after the second value.

Compare two PlainDates, two PlainTimes, or any Instant/ZonedDateTime pair. Dates use Temporal's date ordering, including values expressed in different calendars. Times use wall-clock ordering with nanosecond precision; midnight does not wrap into the next day. Timeline values compare by their exact instant.

Mixed domains (for example, PlainDate and Instant) are rejected by TypeScript and throw a TypeError at runtime. Resolve calendar or clock values to a timeline explicitly when that is the intended comparison.

## Signature

```ts
function isAfter(date1: Temporal.PlainDate, date2: Temporal.PlainDate): boolean;
function isAfter(date1: Temporal.PlainTime, date2: Temporal.PlainTime): boolean;
function isAfter(
  date1: Temporal.Instant | Temporal.ZonedDateTime,
  date2: Temporal.Instant | Temporal.ZonedDateTime
): boolean
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `date1` | `PlainDate`, `PlainTime`, or `Instant \| ZonedDateTime` | The first datetime |
| `date2` | `PlainDate`, `PlainTime`, or `Instant \| ZonedDateTime` | The second datetime |

## Returns

`true` if `date1` is after `date2`, `false` otherwise.

## Examples

```ts
import { isAfter } from '@gobrand/tiempo';

const earlier = Temporal.ZonedDateTime.from('2025-01-20T10:00:00-05:00[America/New_York]');
const later = Temporal.ZonedDateTime.from('2025-01-20T16:00:00-05:00[America/New_York]');

isAfter(later, earlier);  // true
isAfter(earlier, later);  // false
isAfter(earlier, earlier); // false
```

## Common Patterns

### Check date ranges

```ts
import { isBefore, isAfter } from '@gobrand/tiempo';

function isWithinRange(
  date: Temporal.ZonedDateTime,
  start: Temporal.ZonedDateTime,
  end: Temporal.ZonedDateTime
): boolean {
  return !isBefore(date, start) && !isAfter(date, end);
}
```

## Dates and clock times

```ts
import { isAfter, toPlainDate, toPlainTime } from '@gobrand/tiempo';

isAfter(toPlainDate('2025-01-21'), toPlainDate('2025-01-20')); // true
isAfter(toPlainTime('17:00'), toPlainTime('09:00')); // true
```

The specialized `isPlainDateBefore`/`isPlainDateAfter` and `isPlainTimeBefore`/`isPlainTimeAfter` helpers remain available with the same ordering rules. Equal values return false.
