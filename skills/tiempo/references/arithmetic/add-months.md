# addMonths

Add months to a datetime or calendar date. Handles month-end dates correctly.

PlainDate inputs return a PlainDate and preserve its calendar, without choosing a timezone. Instant inputs continue to return a ZonedDateTime in UTC; ZonedDateTime inputs preserve their timezone. Counts may be negative; fractional calendar counts are rejected by Temporal. Month/year arithmetic uses Temporal’s default month-end constraining.

## Signature

```ts
function addMonths(
  input: Temporal.Instant | Temporal.ZonedDateTime,
  months: number
): Temporal.ZonedDateTime;
function addMonths(input: Temporal.PlainDate, months: number): Temporal.PlainDate;
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `input` | `Temporal.Instant \| Temporal.ZonedDateTime \| Temporal.PlainDate` | The datetime to add months to |
| `months` | `number` | Number of months to add (can be negative) |

## Returns

A `Temporal.PlainDate` for a date-only input, or a `Temporal.ZonedDateTime` for an Instant/ZonedDateTime input, with the months added.

## Examples

### Basic usage

```ts
import { addMonths } from '@gobrand/tiempo';

const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
addMonths(instant, 3);
// 2025-04-20T12:00:00Z[UTC]
```

### Month-end handling

```ts
const endOfJan = Temporal.Instant.from('2025-01-31T12:00:00Z');
addMonths(endOfJan, 1);
// 2025-02-28T12:00:00Z[UTC] (Jan 31 → Feb 28)
```

## Date-only arithmetic

```ts
import { addMonths, toPlainDate } from '@gobrand/tiempo';

const date = toPlainDate('2024-01-31');
const result = addMonths(date, 1); // Temporal.PlainDate
result.toString(); // "2024-02-29"
```
