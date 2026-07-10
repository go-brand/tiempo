# isSameQuarter

Returns true if both datetimes are in the same calendar quarter and year. Quarters: Q1 = Jan–Mar, Q2 = Apr–Jun, Q3 = Jul–Sep, Q4 = Oct–Dec.

## Signature

```ts
function isSameQuarter(
  date1: Temporal.Instant | Temporal.ZonedDateTime,
  date2: Temporal.Instant | Temporal.ZonedDateTime
): boolean
function isSameQuarter(
  date1: Temporal.PlainDate,
  date2: Temporal.PlainDate
): boolean
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `date1` | `Temporal.Instant \| Temporal.ZonedDateTime` | The first datetime |
| `date2` | `Temporal.Instant \| Temporal.ZonedDateTime` | The second datetime |

## Returns

`true` if both datetimes are in the same calendar quarter (and year), `false` otherwise.

## Examples

```ts
import { isSameQuarter } from '@gobrand/tiempo';

const jan = Temporal.ZonedDateTime.from('2025-01-15T00:00:00Z[UTC]');
const mar = Temporal.ZonedDateTime.from('2025-03-31T23:59:59Z[UTC]');
const apr = Temporal.ZonedDateTime.from('2025-04-01T00:00:00Z[UTC]');

isSameQuarter(jan, mar); // true  (both Q1)
isSameQuarter(mar, apr); // false (Q1 vs Q2)
```

### From PlainDate (no timezone)

A quarter is intrinsic to the calendar date, so `PlainDate` comparison needs no timezone.

```ts
const a = Temporal.PlainDate.from('2025-04-05');
const b = Temporal.PlainDate.from('2025-06-28');

isSameQuarter(a, b); // true (both Q2)
```
