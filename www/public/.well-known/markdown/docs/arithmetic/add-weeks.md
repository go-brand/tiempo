# addWeeks

Add weeks to a datetime or calendar date.

PlainDate inputs return a PlainDate and preserve its calendar, without choosing a timezone. Instant inputs continue to return a ZonedDateTime in UTC; ZonedDateTime inputs preserve their timezone. Counts may be negative; fractional calendar counts are rejected by Temporal. Month/year arithmetic uses Temporal’s default month-end constraining.

## Signature

```ts
function addWeeks(
  input: Temporal.Instant | Temporal.ZonedDateTime,
  weeks: number
): Temporal.ZonedDateTime;
function addWeeks(input: Temporal.PlainDate, weeks: number): Temporal.PlainDate;
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `input` | `Temporal.Instant \| Temporal.ZonedDateTime \| Temporal.PlainDate` | The datetime to add weeks to |
| `weeks` | `number` | Number of weeks to add (can be negative) |

## Returns

A `Temporal.PlainDate` for a date-only input, or a `Temporal.ZonedDateTime` for an Instant/ZonedDateTime input, with the weeks added.

## Examples

```ts
import { addWeeks } from '@gobrand/tiempo';

const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
addWeeks(instant, 2);
// 2025-02-03T12:00:00Z[UTC]
```

## Date-only arithmetic

```ts
import { addWeeks, toPlainDate } from '@gobrand/tiempo';

const date = toPlainDate('2024-01-31');
const result = addWeeks(date, 1); // Temporal.PlainDate
result.toString(); // "2024-02-07"
```
