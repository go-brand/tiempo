# subYears

Subtracts the specified number of years from a datetime or calendar date.

PlainDate inputs return a PlainDate and preserve its calendar, without choosing a timezone. Instant inputs continue to return a ZonedDateTime in UTC; ZonedDateTime inputs preserve their timezone. Counts may be negative; fractional calendar counts are rejected by Temporal. Month/year arithmetic uses Temporal’s default month-end constraining.

## Signature

```ts
function subYears(
  input: Temporal.Instant | Temporal.ZonedDateTime,
  years: number
): Temporal.ZonedDateTime;
function subYears(input: Temporal.PlainDate, years: number): Temporal.PlainDate;
```

## Example

```ts
import { subYears } from '@gobrand/tiempo';

const now = Temporal.Now.zonedDateTimeISO();

// Get 5 years ago
const fiveYearsAgo = subYears(now, 5);

// Get 1 year ago
const lastYear = subYears(now, 1);
```

## Date-only arithmetic

```ts
import { subYears, toPlainDate } from '@gobrand/tiempo';

const date = toPlainDate('2024-01-31');
const result = subYears(date, 1); // Temporal.PlainDate
result.toString(); // "2023-01-31"
```
