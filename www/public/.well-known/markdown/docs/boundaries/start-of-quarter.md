# startOfQuarter

Returns the first day of the calendar quarter: 1 January, 1 April, 1 July, or 1 October. A `PlainDate` returns a `PlainDate`; pass a timezone to get the moment the quarter begins.

## Signature

```ts
function startOfQuarter(
  input: Temporal.Instant | Temporal.ZonedDateTime
): Temporal.ZonedDateTime

function startOfQuarter(input: Temporal.PlainDate): Temporal.PlainDate

function startOfQuarter(
  input: Temporal.PlainDate,
  timezone: Timezone
): Temporal.ZonedDateTime
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `input` | `Temporal.Instant \| Temporal.ZonedDateTime \| Temporal.PlainDate` | Any date or moment in the quarter |
| `timezone` | `Timezone` | Optional, `PlainDate` only: return the first day at 00:00 in this timezone instead of a date |

## Returns

- `PlainDate` input: the first day of the quarter as a `Temporal.PlainDate`.
- Otherwise: a `Temporal.ZonedDateTime` at the start of that day. `Instant` inputs are read in UTC.

## Examples

### Label a quarterly report by its first day

```ts
import { startOfQuarter } from '@gobrand/tiempo';

startOfQuarter(Temporal.PlainDate.from('2026-02-14')); // 2026-01-01
startOfQuarter(Temporal.PlainDate.from('2026-05-31')); // 2026-04-01
startOfQuarter(Temporal.PlainDate.from('2026-12-24')); // 2026-10-01
```

### Query quarter-to-date sales in America/New_York

```ts
import { startOfQuarter } from '@gobrand/tiempo';

const asOf = Temporal.ZonedDateTime.from('2026-08-19T17:30:00[America/New_York]');

startOfQuarter(asOf); // 2026-07-01T00:00:00-04:00[America/New_York]
```

## Good to know

- An `Instant` uses the UTC quarter. Convert with [toZonedTime](https://tiempo.gobrand.app/docs/conversion/to-zoned-time) to use a user's quarter.
- To get the quarter number, use [getQuarter](https://tiempo.gobrand.app/docs/utilities/get-quarter).
