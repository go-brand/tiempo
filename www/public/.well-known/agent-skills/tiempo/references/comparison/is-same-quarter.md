# isSameQuarter

Returns `true` when both values fall in the same quarter of the same year: Q1 is January to March, Q2 April to June, and so on. PlainDates need no timezone; timestamps are read like in [isSameDay](https://tiempo.gobrand.app/docs/comparison/is-same-day), each in its own timezone, with Instants in UTC.

## Signature

```ts
function isSameQuarter(
  date1: Temporal.Instant | Temporal.ZonedDateTime,
  date2: Temporal.Instant | Temporal.ZonedDateTime
): boolean;
function isSameQuarter(date1: Temporal.PlainDate, date2: Temporal.PlainDate): boolean;
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `date1` | `Instant \| ZonedDateTime`, or `PlainDate` | The first value |
| `date2` | Same kind as `date1` | The second value |

## Returns

`true` if both values have the same year and quarter, otherwise `false`.

## Examples

### Check whether two invoices fall in the same reporting quarter

```ts
import { isSameQuarter } from '@gobrand/tiempo';

const april = Temporal.PlainDate.from('2026-04-05');
const june = Temporal.PlainDate.from('2026-06-28');
const july = Temporal.PlainDate.from('2026-07-01');

isSameQuarter(april, june); // true (both Q2)
isSameQuarter(june, july); // false (Q2 and Q3)
```

## Good to know

- Mixing a PlainDate with a timestamp is a TypeScript error.
- To get the quarter number, use [getQuarter](https://tiempo.gobrand.app/docs/utilities/get-quarter).
