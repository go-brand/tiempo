# differenceInMonths

Returns the number of months between two datetimes.

## Signature

```ts
function differenceInMonths(
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

The number of months between the two datetimes, truncated toward zero by default. Pass `{ fractional: true }` to get the precise fractional value. Positive if `laterDate` is after `earlierDate`, negative if before.

## Examples

```ts
import { differenceInMonths } from '@gobrand/tiempo';

const jan = Temporal.Instant.from('2025-01-15T12:00:00Z');
const jun = Temporal.Instant.from('2025-06-15T12:00:00Z');

differenceInMonths(jun, jan); // 5
differenceInMonths(jan, jun); // -5
```

### Fractional results

By default the result is truncated toward zero. Pass `{ fractional: true }` for the precise value.

```ts
const later = Temporal.Instant.from('2025-02-15T00:00:00Z');
const earlier = Temporal.Instant.from('2025-01-01T00:00:00Z');

differenceInMonths(later, earlier);                       // 1   (truncated)
differenceInMonths(later, earlier, { fractional: true }); // 1.5 (precise)
```
