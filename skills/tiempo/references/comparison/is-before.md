# isBefore

Returns true if the first value is before the second value.

Compare two PlainDates, two PlainTimes, or any Instant/ZonedDateTime pair. Dates use Temporal's date ordering, including values expressed in different calendars. Times use wall-clock ordering with nanosecond precision; midnight does not wrap into the next day. Timeline values compare by their exact instant.

Mixed domains (for example, PlainDate and Instant) are rejected by TypeScript and throw a TypeError at runtime. Resolve calendar or clock values to a timeline explicitly when that is the intended comparison.

## Signature

```ts
function isBefore(date1: Temporal.PlainDate, date2: Temporal.PlainDate): boolean;
function isBefore(date1: Temporal.PlainTime, date2: Temporal.PlainTime): boolean;
function isBefore(
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

`true` if `date1` is before `date2`, `false` otherwise.

## Examples

### Basic usage

```ts
import { isBefore } from '@gobrand/tiempo';

const earlier = Temporal.ZonedDateTime.from('2025-01-20T10:00:00-05:00[America/New_York]');
const later = Temporal.ZonedDateTime.from('2025-01-20T16:00:00-05:00[America/New_York]');

isBefore(earlier, later);  // true
isBefore(later, earlier);  // false
isBefore(earlier, earlier); // false
```

### With Instant

```ts
const instant1 = Temporal.Instant.from('2025-01-20T15:00:00Z');
const instant2 = Temporal.Instant.from('2025-01-20T16:00:00Z');
isBefore(instant1, instant2); // true
```

### Different timezones - compares by instant

```ts
const ny = Temporal.ZonedDateTime.from('2025-01-20T10:00:00-05:00[America/New_York]');
const tokyo = Temporal.ZonedDateTime.from('2025-01-21T00:00:00+09:00[Asia/Tokyo]');
isBefore(ny, tokyo); // false: both are 2025-01-20T15:00:00Z
```

## Common Patterns

### Validate event dates

```ts
import { isBefore } from '@gobrand/tiempo';

function validateEventDates(start: Temporal.ZonedDateTime, end: Temporal.ZonedDateTime) {
  if (!isBefore(start, end)) {
    throw new Error('Event end date must be after start date');
  }
}
```

## Dates and clock times

```ts
import { isBefore, toPlainDate, toPlainTime } from '@gobrand/tiempo';

isBefore(toPlainDate('2025-01-20'), toPlainDate('2025-01-21')); // true
isBefore(toPlainTime('09:00'), toPlainTime('17:00')); // true
```

The specialized `isPlainDateBefore`/`isPlainDateAfter` and `isPlainTimeBefore`/`isPlainTimeAfter` helpers remain available with the same ordering rules. Equal values return false.
