# addBusinessDays

Adds business days (Monday–Friday), skipping Saturdays and Sundays. Holidays are not considered.

Starting on a weekend, the first business day counted is the next Monday (or the previous Friday for negative values). Adding 0 returns the same date, even on a weekend. Large counts run in constant time.

Instant inputs are converted to UTC. ZonedDateTime inputs keep their timezone and time of day, adjusting the offset across DST. PlainDate inputs stay dates.

## Signature

```ts
function addBusinessDays(input: Temporal.PlainDate, days: number): Temporal.PlainDate;
function addBusinessDays(
  input: Temporal.Instant | Temporal.ZonedDateTime,
  days: number
): Temporal.ZonedDateTime
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `input` | `Instant \| ZonedDateTime \| PlainDate` | The starting value |
| `days` | `number` | Whole business days to add; negative subtracts |

## Returns

A `PlainDate` for a PlainDate input, otherwise a `ZonedDateTime`. Throws a `RangeError` if `days` is not an integer.

## Examples

```ts
import { addBusinessDays } from '@gobrand/tiempo';

const friday = Temporal.PlainDate.from('2025-01-24');

addBusinessDays(friday, 1); // 2025-01-27
addBusinessDays(friday, 5); // 2025-01-31
addBusinessDays(friday, -1); // 2025-01-23
```

### Due date that keeps local time

```ts
import { addBusinessDays } from '@gobrand/tiempo';

const received = Temporal.ZonedDateTime.from('2025-03-07T09:00:00-05:00[America/New_York]');

addBusinessDays(received, 1).toString(); // 2025-03-10T09:00:00-04:00[America/New_York]
```

Still 09:00 local time after the switch to daylight saving time.

### Holidays

Holiday calendars vary by country and company, so tiempo leaves them to you. Skip them with a loop:

```ts
import { addBusinessDays } from '@gobrand/tiempo';

const holidays = new Set(['2025-01-27']);

function addWorkingDays(date: Temporal.PlainDate, days: number): Temporal.PlainDate {
  let result = date;
  for (let i = 0; i < days; i++) {
    do result = addBusinessDays(result, 1);
    while (holidays.has(result.toString()));
  }
  return result;
}

addWorkingDays(Temporal.PlainDate.from('2025-01-24'), 1); // 2025-01-28
```
