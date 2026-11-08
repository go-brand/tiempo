# differenceInDays

Returns the signed number of days between two dates or datetimes: `laterDate` minus `earlierDate`.

Two `PlainDate` values produce whole calendar days without a timezone. Instant/ZonedDateTime inputs use the existing calendar-aware calculation, including DST transitions where days can be 23, 24, or 25 hours long.

## Temporal compatibility

Accepts native Temporal and `@js-temporal/polyfill` values, including mixed pairs. Instant inputs use UTC. For ZonedDateTime inputs, calendar totals use the timezone and calendar of `earlierDate`; the inputs must have matching calendar identifiers. Nanosecond precision is preserved when passing values between implementations; the returned JavaScript number still has floating-point precision limits.

PlainDate inputs must be paired with another PlainDate and use matching calendar identifiers. Mixing a PlainDate with an Instant or ZonedDateTime is rejected in TypeScript and at runtime. Convert timestamps explicitly with `toPlainDate` when you want to compare dates.

## Signature

```ts
function differenceInDays(
  laterDate: Temporal.PlainDate,
  earlierDate: Temporal.PlainDate,
  options?: DifferenceOptions
): number

function differenceInDays(
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
| `laterDate` | `Temporal.PlainDate \| Temporal.Instant \| Temporal.ZonedDateTime` | The later date or datetime; pair PlainDate only with PlainDate |
| `earlierDate` | `Temporal.PlainDate \| Temporal.Instant \| Temporal.ZonedDateTime` | The earlier value in the same domain |
| `options.fractional` | `boolean` | Return the precise fractional value instead of truncating toward zero (default: false) |

## Returns

For PlainDate pairs, a signed integer: positive, negative, or zero. `{ fractional: true }` still returns that integer because date-only inputs have no partial days.

For timeline pairs, the number of days is truncated toward zero by default. Pass `{ fractional: true }` to get the fractional value.

## Examples

### Date-only deadlines and stays

```ts
import { toPlainDate, differenceInDays } from '@gobrand/tiempo';

const checkIn = toPlainDate('2026-10-10');
const checkOut = toPlainDate('2026-10-12');

differenceInDays(checkOut, checkIn); // 2
differenceInDays(checkIn, checkOut); // -2
```

This counts days between the dates. To list every date including both endpoints, use `eachDayOfInterval`—the same range contains three dates.

### Basic usage

```ts
import { differenceInDays } from '@gobrand/tiempo';

const later = Temporal.Instant.from('2025-01-25T12:00:00Z');
const earlier = Temporal.Instant.from('2025-01-20T12:00:00Z');

differenceInDays(later, earlier); // 5
```

### With ZonedDateTime

```ts
const laterZoned = Temporal.ZonedDateTime.from('2025-01-25T15:00:00-05:00[America/New_York]');
const earlierZoned = Temporal.ZonedDateTime.from('2025-01-20T15:00:00-05:00[America/New_York]');
differenceInDays(laterZoned, earlierZoned); // 5
```

### Handles DST transitions correctly

```ts
const afterDst = Temporal.ZonedDateTime.from('2025-03-10T12:00:00-04:00[America/New_York]');
const beforeDst = Temporal.ZonedDateTime.from('2025-03-08T12:00:00-05:00[America/New_York]');
differenceInDays(afterDst, beforeDst); // 2 (calendar days, not 48 hours)
```

### Fractional results

By default the result is truncated toward zero. Pass `{ fractional: true }` for the precise value.

```ts
const later = Temporal.Instant.from('2025-01-21T12:00:00Z');
const earlier = Temporal.Instant.from('2025-01-20T00:00:00Z');

differenceInDays(later, earlier);                       // 1   (truncated)
differenceInDays(later, earlier, { fractional: true }); // 1.5 (precise)
```

## Common Patterns

### Time until event

```ts
import { differenceInDays, differenceInHours, differenceInMinutes } from '@gobrand/tiempo';

function timeUntil(eventDate: Temporal.ZonedDateTime): string {
  const now = Temporal.Now.zonedDateTimeISO();

  const days = differenceInDays(eventDate, now);
  if (days > 1) return `${days} days`;

  const hours = differenceInHours(eventDate, now);
  if (hours > 1) return `${hours} hours`;

  const minutes = differenceInMinutes(eventDate, now);
  return `${minutes} minutes`;
}
```
