# subSeconds

The reverse of [addSeconds](https://tiempo.gobrand.app/docs/arithmetic/add-seconds): goes back exact seconds of elapsed time.

## Signature

```ts
function subSeconds(
  input: Temporal.Instant | Temporal.ZonedDateTime,
  seconds: number
): Temporal.ZonedDateTime;
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `input` | `Temporal.Instant \| Temporal.ZonedDateTime` | The starting datetime |
| `seconds` | `number` | Whole number of seconds to subtract; negative goes forward. Fractions throw a `RangeError`. |

## Returns

A `ZonedDateTime` in the input's timezone, or in UTC for an `Instant`.

## Examples

### Find the start of a 60-second rate-limit window

```ts
import { subSeconds } from '@gobrand/tiempo';

const requestAt = Temporal.Instant.from('2026-04-01T10:00:30Z');

subSeconds(requestAt, 60); // 2026-04-01T09:59:30+00:00[UTC]
```
