# subQuarters

Subtracts the specified number of quarters (3-month blocks) from a datetime.

## Signature

```ts
function subQuarters(
  input: Temporal.Instant | Temporal.ZonedDateTime,
  quarters: number
): Temporal.ZonedDateTime
```

## Example

```ts
import { subQuarters } from '@gobrand/tiempo';

const now = Temporal.Now.zonedDateTimeISO();

// Get last quarter
const lastQuarter = subQuarters(now, 1);

// Get a year ago (4 quarters)
const yearAgo = subQuarters(now, 4);
```
