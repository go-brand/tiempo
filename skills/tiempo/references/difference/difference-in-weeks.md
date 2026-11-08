# differenceInWeeks

Returns the number of weeks between two dates or datetimes.

## Temporal compatibility

Accepts native Temporal and `@js-temporal/polyfill` values, including mixed pairs. Instant inputs use UTC. For ZonedDateTime inputs, calendar totals use the timezone and calendar of `earlierDate`; the inputs must have matching calendar identifiers. Nanosecond precision is preserved when passing values between implementations; the returned JavaScript number still has floating-point precision limits.

Two PlainDates are also accepted. They use calendar arithmetic without a timezone and must have matching calendar identifiers. Results are truncated toward zero unless `{ fractional: true }` is supplied. PlainDate/timeline pairs are rejected; explicitly convert a timestamp to a date when that matches your task.

## Signature

```ts
function differenceInWeeks(
  laterDate: Temporal.PlainDate,
  earlierDate: Temporal.PlainDate,
  options?: DifferenceOptions
): number

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
| `laterDate` | `Temporal.PlainDate \| Temporal.Instant \| Temporal.ZonedDateTime` | The later value; pair PlainDate only with PlainDate |
| `earlierDate` | `Temporal.PlainDate \| Temporal.Instant \| Temporal.ZonedDateTime` | The earlier value in the same domain |
| `options.fractional` | `boolean` | Return the precise fractional value instead of truncating toward zero (default: false) |

## Returns

The number of weeks between the two datetimes, truncated toward zero by default. Pass `{ fractional: true }` to get the precise fractional value.

## Examples

### Date-only weeks

```ts
import { toPlainDate, differenceInWeeks } from '@gobrand/tiempo';

const earlier = toPlainDate('2026-01-01');
const later = toPlainDate('2026-01-11');

differenceInWeeks(later, earlier); // 1
```

The argument order is the first value minus the second. Fractional calendar totals are relative to the second argument. Months and years vary in length, so reversing arbitrary inputs need not produce exactly opposite fractional results.

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
