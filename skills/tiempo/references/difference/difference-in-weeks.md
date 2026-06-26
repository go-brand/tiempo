# differenceInWeeks

Returns the number of weeks between two datetimes.

## Signature

```ts
function differenceInWeeks(
  laterDate: Temporal.Instant | Temporal.ZonedDateTime,
  earlierDate: Temporal.Instant | Temporal.ZonedDateTime,
  options?: DifferenceOptions
): number

interface DifferenceOptions {
  fractional?: boolean; // default false — truncates toward zero
}
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `laterDate` | `Temporal.Instant \| Temporal.ZonedDateTime` | The later datetime |
| `earlierDate` | `Temporal.Instant \| Temporal.ZonedDateTime` | The earlier datetime |
| `options.fractional` | `boolean` | Return the precise fractional value instead of truncating toward zero (default: false) |

## Returns

The number of weeks between the two datetimes, truncated toward zero by default. Pass `{ fractional: true }` to get the precise fractional value.

## Examples

```ts
import { differenceInWeeks } from '@gobrand/tiempo';

const later = Temporal.Instant.from('2025-02-03T12:00:00Z');
const earlier = Temporal.Instant.from('2025-01-20T12:00:00Z');

differenceInWeeks(later, earlier); // 2
```

### Fractional results

By default the result is truncated toward zero. Pass `{ fractional: true }` for the precise value.

```ts
const later = Temporal.Instant.from('2025-01-30T12:00:00Z');
const earlier = Temporal.Instant.from('2025-01-20T00:00:00Z');

differenceInWeeks(later, earlier);                       // 1   (truncated)
differenceInWeeks(later, earlier, { fractional: true }); // 1.5 (precise)
```
