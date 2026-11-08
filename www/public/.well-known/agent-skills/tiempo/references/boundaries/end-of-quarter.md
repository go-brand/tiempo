# endOfQuarter

Returns the last day of the calendar quarter: 31 March, 30 June, 30 September, or 31 December. It is the counterpart of [startOfQuarter](https://tiempo.gobrand.app/docs/boundaries/start-of-quarter): a `PlainDate` returns a `PlainDate`, and with a timezone you get the last moment of the quarter.

## Signature

```ts
function endOfQuarter(
  input: Temporal.Instant | Temporal.ZonedDateTime
): Temporal.ZonedDateTime

function endOfQuarter(input: Temporal.PlainDate): Temporal.PlainDate

function endOfQuarter(
  input: Temporal.PlainDate,
  timezone: Timezone
): Temporal.ZonedDateTime
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `input` | `Temporal.Instant \| Temporal.ZonedDateTime \| Temporal.PlainDate` | Any date or moment in the quarter |
| `timezone` | `Timezone` | Optional, `PlainDate` only: return the last day at 23:59:59.999999999 in this timezone instead of a date |

## Returns

- `PlainDate` input: the last day of the quarter as a `Temporal.PlainDate`.
- Otherwise: a `Temporal.ZonedDateTime` one nanosecond before the next quarter begins. `Instant` inputs are read in UTC.

## Examples

### Set a quarterly filing deadline

```ts
import { endOfQuarter } from '@gobrand/tiempo';

const invoiceDate = Temporal.PlainDate.from('2026-05-12');

endOfQuarter(invoiceDate); // 2026-06-30
```

### Query Q1 orders in America/New_York

```ts
import { startOfQuarter, endOfQuarter } from '@gobrand/tiempo';

const order = Temporal.ZonedDateTime.from('2026-02-15T15:30:00[America/New_York]');

startOfQuarter(order); // 2026-01-01T00:00:00-05:00[America/New_York]
endOfQuarter(order); // 2026-03-31T23:59:59.999999999-04:00[America/New_York] (summer time by then)
```
