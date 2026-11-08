# subMonths

Subtracts the specified number of months from a datetime or calendar date.

PlainDate inputs return a PlainDate and preserve its calendar, without choosing a timezone. Instant inputs continue to return a ZonedDateTime in UTC; ZonedDateTime inputs preserve their timezone. Counts may be negative; fractional calendar counts are rejected by Temporal. Month/year arithmetic uses Temporal’s default month-end constraining.

## Signature

```ts
function subMonths(
  input: Temporal.Instant | Temporal.ZonedDateTime,
  months: number
): Temporal.ZonedDateTime;
function subMonths(input: Temporal.PlainDate, months: number): Temporal.PlainDate;
```

## Example

```ts
import { subMonths } from '@gobrand/tiempo';

const now = Temporal.Now.zonedDateTimeISO();

// Get last month
const lastMonth = subMonths(now, 1);

// Get 6 months ago
const sixMonthsAgo = subMonths(now, 6);
```

## Date-only arithmetic

```ts
import { subMonths, toPlainDate } from '@gobrand/tiempo';

const date = toPlainDate('2024-01-31');
const result = subMonths(date, 1); // Temporal.PlainDate
result.toString(); // "2023-12-31"
```
