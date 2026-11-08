# subMilliseconds

The reverse of [addMilliseconds](https://tiempo.gobrand.app/docs/arithmetic/add-milliseconds): goes back exact milliseconds of elapsed time.

## Signature

```ts
function subMilliseconds(
  input: Temporal.Instant | Temporal.ZonedDateTime,
  milliseconds: number
): Temporal.ZonedDateTime;
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `input` | `Temporal.Instant \| Temporal.ZonedDateTime` | The starting datetime |
| `milliseconds` | `number` | Whole number of milliseconds to subtract; negative goes forward. Fractions throw a `RangeError`. |

## Returns

A `ZonedDateTime` in the input's timezone, or in UTC for an `Instant`.

## Examples

### Find when a 1,500 ms request started

```ts
import { subMilliseconds } from '@gobrand/tiempo';

const respondedAt = Temporal.Instant.from('2026-04-01T10:00:01.750Z');

subMilliseconds(respondedAt, 1500); // 2026-04-01T10:00:00.25+00:00[UTC]
```
