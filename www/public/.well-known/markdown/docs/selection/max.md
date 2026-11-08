# max

Returns the latest value in a non-empty array.

The value is returned as given, keeping its type, timezone, and calendar. Ties return the first. Timeline values compare by exact instant, PlainDates by date, and PlainTimes by wall-clock time. Mixed domains throw a TypeError.

## Signature

```ts
function max<T extends Temporal.Instant | Temporal.ZonedDateTime>(values: readonly T[]): T;
function max(values: readonly Temporal.PlainDate[]): Temporal.PlainDate;
function max(values: readonly Temporal.PlainTime[]): Temporal.PlainTime
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `values` | Array of one domain | At least one value |

## Returns

The latest value. Throws a `RangeError` for an empty array; check `values.length` first if the array can be empty.

## Examples

```ts
import { max } from '@gobrand/tiempo';

const logins = [
  Temporal.Instant.from('2025-01-20T15:00:00Z'),
  Temporal.Instant.from('2025-01-22T08:30:00Z'),
  Temporal.Instant.from('2025-01-21T12:00:00Z'),
];

max(logins); // 2025-01-22T08:30:00Z
```

```ts
import { max } from '@gobrand/tiempo';

const closings = ['17:00', '21:30', '18:00'].map((t) => Temporal.PlainTime.from(t));

max(closings); // 21:30:00
```
