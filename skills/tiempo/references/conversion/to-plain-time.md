# toPlainTime

Extract the wall-clock time from a ZonedDateTime, or convert an input to a timezone and extract the time.

## Signature

```ts
// From ZonedDateTime (timezone optional)
function toPlainTime(input: Temporal.ZonedDateTime): Temporal.PlainTime

// From other inputs (timezone required)
function toPlainTime(
  input: string | Date | Temporal.Instant | Temporal.ZonedDateTime,
  timezone: Timezone
): Temporal.PlainTime

type Timezone = 'UTC' | string;
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `input` | `string \| Date \| Temporal.Instant \| Temporal.ZonedDateTime` | A UTC ISO 8601 string, Date object, Temporal.Instant, or Temporal.ZonedDateTime |
| `timezone` | `Timezone` | IANA timezone identifier. Required unless input is a ZonedDateTime. |

## Returns

A `Temporal.PlainTime` representing the wall-clock time.

## Examples

### From ZonedDateTime (no timezone needed)

```ts
import { toPlainTime, toZonedTime } from '@gobrand/tiempo';

const zdt = toZonedTime("2025-01-20T15:30:00Z", "America/New_York");
const time = toPlainTime(zdt); // 10:30
```

### From UTC string with timezone

```ts
import { toPlainTime } from '@gobrand/tiempo';

const time = toPlainTime("2025-01-20T15:30:00Z", "America/New_York"); // 10:30
```

### From Date with timezone

```ts
import { toPlainTime } from '@gobrand/tiempo';

const date = new Date("2025-01-20T15:30:00.000Z");
const time = toPlainTime(date, "Europe/London"); // 15:30
```

### From Instant with timezone

```ts
import { toPlainTime } from '@gobrand/tiempo';
import { Temporal } from '@js-temporal/polyfill';

const instant = Temporal.Instant.from("2025-01-20T15:30:00Z");
const time = toPlainTime(instant, "Asia/Tokyo"); // 00:30 (next day)
```

## Common Patterns

### Business hours check

```ts
import { toPlainTime, isPlainTimeBefore } from '@gobrand/tiempo';
import { Temporal } from '@js-temporal/polyfill';

const openTime = Temporal.PlainTime.from('09:00');
const closeTime = Temporal.PlainTime.from('17:00');

// Get current time in store's timezone
const currentTime = toPlainTime(new Date(), 'America/New_York');

const isOpen = !isPlainTimeBefore(currentTime, openTime) &&
               isPlainTimeBefore(currentTime, closeTime);
```

### Schedule comparison

```ts
import { toPlainTime, isPlainTimeBefore } from '@gobrand/tiempo';
import { Temporal } from '@js-temporal/polyfill';

const scheduledTime = Temporal.PlainTime.from('14:30');
const userTime = toPlainTime(eventUtcTimestamp, userTimezone);

if (isPlainTimeBefore(userTime, scheduledTime)) {
  console.log('Event has not started yet');
}
```
