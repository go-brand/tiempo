# max

Returns the latest value in a non-empty array, exactly as it was given: same type, timezone, and calendar.

## Signature

```ts
function max<T extends Temporal.Instant | Temporal.ZonedDateTime>(values: readonly T[]): T;
function max(values: readonly Temporal.PlainDate[]): Temporal.PlainDate;
function max(values: readonly Temporal.PlainTime[]): Temporal.PlainTime
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `values` | Array of one kind | At least one value |

## Returns

The latest value. Throws a `RangeError` for an empty array; check `values.length` first if the array can be empty.

## Examples

### Find a user's most recent login

```ts
import { max } from '@gobrand/tiempo';

const logins = [
  Temporal.Instant.from('2026-01-20T15:00:00Z'),
  Temporal.Instant.from('2026-01-22T08:30:00Z'),
  Temporal.Instant.from('2026-01-21T12:00:00Z'),
];

max(logins); // 2026-01-22T08:30:00Z
```

### Find the latest closing time

```ts
import { max } from '@gobrand/tiempo';

const closings = ['17:00', '21:30', '18:00'].map((t) => Temporal.PlainTime.from(t));

max(closings); // 21:30:00
```

## Good to know

- Ties return the first of the tied values.
- Mixing a PlainDate or PlainTime with another kind throws a `TypeError`.
