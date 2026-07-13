# subQuarters

Subtracts the specified number of quarters (3-month blocks) from a datetime.

## Signature

```ts
function subQuarters(
  input: Temporal.Instant | Temporal.ZonedDateTime,
  quarters: number
): Temporal.ZonedDateTime
function subQuarters(
  input: Temporal.PlainDate,
  quarters: number
): Temporal.PlainDate
```

Input type determines output type: a `PlainDate` stays in calendar space and returns a `PlainDate` (no timezone needed).

## Example

```ts
import { subQuarters } from '@gobrand/tiempo';

const now = Temporal.Now.zonedDateTimeISO();

// Get last quarter
const lastQuarter = subQuarters(now, 1);

// Get a year ago (4 quarters)
const yearAgo = subQuarters(now, 4);

// From a PlainDate (returns a PlainDate)
subQuarters(Temporal.PlainDate.from('2025-07-20'), 1);
// 2025-04-20
```
