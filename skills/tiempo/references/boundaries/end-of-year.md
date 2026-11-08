# endOfYear

Returns 31 December of the year, the counterpart of [startOfYear](https://tiempo.gobrand.app/docs/boundaries/start-of-year). A `PlainDate` returns a `PlainDate`; pass a timezone to get the last moment of the year.

## Signature

```ts
function endOfYear(
  input: Temporal.Instant | Temporal.ZonedDateTime
): Temporal.ZonedDateTime

function endOfYear(input: Temporal.PlainDate): Temporal.PlainDate

function endOfYear(
  input: Temporal.PlainDate,
  timezone: Timezone
): Temporal.ZonedDateTime
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `input` | `Temporal.Instant \| Temporal.ZonedDateTime \| Temporal.PlainDate` | Any date or moment in the year |
| `timezone` | `Timezone` | Optional, `PlainDate` only: return 31 December at 23:59:59.999999999 in this timezone instead of a date |

## Returns

- `PlainDate` input: 31 December as a `Temporal.PlainDate`.
- Otherwise: a `Temporal.ZonedDateTime` one nanosecond before the next year begins. `Instant` inputs are read in UTC.

## Examples

### Expire an annual plan at year end in Australia/Sydney

```ts
import { endOfYear } from '@gobrand/tiempo';

const purchasedOn = Temporal.PlainDate.from('2026-05-04');

endOfYear(purchasedOn); // 2026-12-31
endOfYear(purchasedOn, 'Australia/Sydney'); // 2026-12-31T23:59:59.999999999+11:00[Australia/Sydney]
```
