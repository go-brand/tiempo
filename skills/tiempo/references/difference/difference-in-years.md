# differenceInYears

Returns the number of years between two datetimes.

## Signature

```ts
function differenceInYears(
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

The number of years between the two datetimes, truncated toward zero by default. Pass `{ fractional: true }` to get the precise fractional value. Positive if `laterDate` is after `earlierDate`, negative if before.

## Examples

```ts
import { differenceInYears } from '@gobrand/tiempo';

const date2020 = Temporal.Instant.from('2020-06-15T12:00:00Z');
const date2025 = Temporal.Instant.from('2025-06-15T12:00:00Z');

differenceInYears(date2025, date2020); // 5
```

### Fractional results

By default the result is truncated toward zero. Pass `{ fractional: true }` for the precise value.

```ts
const later = Temporal.Instant.from('2026-07-01T00:00:00Z');
const earlier = Temporal.Instant.from('2025-01-01T00:00:00Z');

differenceInYears(later, earlier);                       // 1    (truncated)
differenceInYears(later, earlier, { fractional: true }); // ~1.5 (precise)
```

## Common Patterns

### Calculate age

```ts
import { differenceInYears } from '@gobrand/tiempo';

function calculateAge(birthDate: Temporal.PlainDate): number {
  const now = Temporal.Now.zonedDateTimeISO();
  const birth = birthDate.toZonedDateTime({
    timeZone: now.timeZoneId,
    plainTime: Temporal.PlainTime.from('00:00:00'),
  });
  return differenceInYears(now, birth);
}
```
