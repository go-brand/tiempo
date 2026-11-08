# compareAsc

Compares two values for ascending order. Pass it to `Array#sort` to sort oldest first.

Returns -1 if `date1` sorts first, 1 if `date2` sorts first, and 0 if they are equal. Timeline values compare by exact instant, PlainDates by date, and PlainTimes by wall-clock time. Mixed domains are rejected by TypeScript and throw a TypeError at runtime.

## Signature

```ts
function compareAsc(date1: Temporal.PlainDate, date2: Temporal.PlainDate): -1 | 0 | 1;
function compareAsc(date1: Temporal.PlainTime, date2: Temporal.PlainTime): -1 | 0 | 1;
function compareAsc(
  date1: Temporal.Instant | Temporal.ZonedDateTime,
  date2: Temporal.Instant | Temporal.ZonedDateTime
): -1 | 0 | 1
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `date1` | `PlainDate`, `PlainTime`, or `Instant \| ZonedDateTime` | The first value |
| `date2` | Same domain as `date1` | The second value |

## Returns

`-1`, `0`, or `1`.

## Examples

```ts
import { compareAsc } from '@gobrand/tiempo';

const dates = ['2025-03-01', '2024-12-31', '2025-01-15'].map((d) => Temporal.PlainDate.from(d));

dates.sort(compareAsc).map(String); // ['2024-12-31', '2025-01-15', '2025-03-01']
```

### Mixed Instant and ZonedDateTime

Timeline values can be mixed freely; they sort by the moment they represent.

```ts
import { compareAsc } from '@gobrand/tiempo';

const instant = Temporal.Instant.from('2025-01-20T15:00:00Z');
const tokyo = Temporal.ZonedDateTime.from('2025-01-21T00:30:00+09:00[Asia/Tokyo]'); // 15:30Z

compareAsc(instant, tokyo); // -1
```
