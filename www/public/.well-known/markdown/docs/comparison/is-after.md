# isAfter

Returns `true` when the first value comes strictly after the second. Timestamps compare by exact instant, so the timezone a value is written in does not change the answer.

## Signature

```ts
function isAfter(date1: Temporal.PlainDate, date2: Temporal.PlainDate): boolean;
function isAfter(date1: Temporal.PlainTime, date2: Temporal.PlainTime): boolean;
function isAfter(
  date1: Temporal.Instant | Temporal.ZonedDateTime,
  date2: Temporal.Instant | Temporal.ZonedDateTime
): boolean;
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `date1` | `PlainDate`, `PlainTime`, `Instant`, or `ZonedDateTime` | The value being checked |
| `date2` | Same kind as `date1`; `Instant` and `ZonedDateTime` can be mixed | The value to compare against |

## Returns

`true` if `date1` is after `date2`, otherwise `false`. Equal values return `false`.

## Examples

### Detect a missed support SLA

```ts
import { addHours, isAfter } from '@gobrand/tiempo';

const openedAt = Temporal.Instant.from('2026-02-03T09:12:00Z');
const firstReplyAt = Temporal.Instant.from('2026-02-03T13:40:00Z');

isAfter(firstReplyAt, addHours(openedAt, 4)); // true (the 4-hour SLA was missed by 28 minutes)
```

### Check whether a subscription renewal date has passed

```ts
import { isAfter } from '@gobrand/tiempo';

const renewsOn = Temporal.PlainDate.from('2026-07-01');

isAfter(Temporal.PlainDate.from('2026-07-02'), renewsOn); // true
isAfter(Temporal.PlainDate.from('2026-07-01'), renewsOn); // false (same day is not after)
```

### Ship orders placed after the 14:00 cutoff the next day

```ts
import { isAfter } from '@gobrand/tiempo';

isAfter(Temporal.PlainTime.from('14:05'), Temporal.PlainTime.from('14:00')); // true
```

## Good to know

- Comparing a PlainDate, a PlainTime, and a timestamp with each other is a TypeScript error and throws a `TypeError`. Convert first with [toPlainDate](https://tiempo.gobrand.app/docs/conversion/to-plain-date) or [toZonedTime](https://tiempo.gobrand.app/docs/conversion/to-zoned-time).
- PlainTimes do not wrap at midnight: `00:15` is not after `23:30`.
