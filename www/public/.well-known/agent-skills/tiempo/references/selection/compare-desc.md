# compareDesc

Compares two values for descending order. Pass it to `Array#sort` to sort newest first.

## Signature

```ts
function compareDesc(date1: Temporal.PlainDate, date2: Temporal.PlainDate): -1 | 0 | 1;
function compareDesc(date1: Temporal.PlainTime, date2: Temporal.PlainTime): -1 | 0 | 1;
function compareDesc(
  date1: Temporal.Instant | Temporal.ZonedDateTime,
  date2: Temporal.Instant | Temporal.ZonedDateTime
): -1 | 0 | 1
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `date1` | `PlainDate`, `PlainTime`, or `Instant \| ZonedDateTime` | The first value |
| `date2` | Same kind as `date1` | The second value |

## Returns

`-1` if `date1` is later (sorts first), `1` if `date2` is later, `0` if they are equal.

## Examples

### Show the newest orders first

```ts
import { compareDesc } from '@gobrand/tiempo';

const orders = [
  Temporal.Instant.from('2026-01-20T09:15:00Z'),
  Temporal.Instant.from('2026-01-22T18:40:00Z'),
  Temporal.Instant.from('2026-01-21T12:00:00Z'),
];

orders.sort(compareDesc).map(String); // ['2026-01-22T18:40:00Z', '2026-01-21T12:00:00Z', '2026-01-20T09:15:00Z']
```

### Compare events logged in different timezones

```ts
import { compareDesc } from '@gobrand/tiempo';

const serverLog = Temporal.Instant.from('2026-01-20T15:00:00Z');
const tokyoLog = Temporal.ZonedDateTime.from('2026-01-21T00:30:00+09:00[Asia/Tokyo]'); // 15:30 UTC

compareDesc(serverLog, tokyoLog); // 1
```

## Good to know

- Mixing a PlainDate or PlainTime with another kind is a TypeScript error and throws a `TypeError`.
