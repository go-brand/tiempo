# addMilliseconds

Adds exact milliseconds of elapsed time, for request timeouts and other durations measured in milliseconds.

## Signature

```ts
function addMilliseconds(
  input: Temporal.Instant | Temporal.ZonedDateTime,
  milliseconds: number
): Temporal.ZonedDateTime;
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `input` | `Temporal.Instant \| Temporal.ZonedDateTime` | The starting datetime |
| `milliseconds` | `number` | Whole number of milliseconds to add; negative goes back. Fractions throw a `RangeError`. |

## Returns

A `ZonedDateTime` in the input's timezone, or in UTC for an `Instant`.

## Examples

### Compute a request timeout deadline

```ts
import { addMilliseconds } from '@gobrand/tiempo';

const sentAt = Temporal.Instant.from('2026-04-01T10:00:00.250Z');

addMilliseconds(sentAt, 1500); // 2026-04-01T10:00:01.75+00:00[UTC]
```
