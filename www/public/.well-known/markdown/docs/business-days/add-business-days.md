# addBusinessDays

Adds business days (Monday–Friday), skipping Saturdays and Sundays. Use it for due dates like "reply within 3 business days". Pass a list of holidays to skip those too.

## Signature

```ts
function addBusinessDays(
  input: Temporal.PlainDate,
  days: number,
  holidays?: readonly Temporal.PlainDate[]
): Temporal.PlainDate;
function addBusinessDays(
  input: Temporal.Instant | Temporal.ZonedDateTime,
  days: number,
  holidays?: readonly Temporal.PlainDate[]
): Temporal.ZonedDateTime
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `input` | `PlainDate`, `Instant`, or `ZonedDateTime` | The starting value |
| `days` | `number` | Whole business days to add; negative subtracts |
| `holidays` | `readonly PlainDate[]` | Optional dates that are not business days. Instant and ZonedDateTime inputs match them against their own date (UTC for an Instant) |

## Returns

A `PlainDate` for a PlainDate input, otherwise a `ZonedDateTime`. Throws a `RangeError` if `days` is not an integer.

## Examples

### Set a due date a few business days out

```ts
import { addBusinessDays } from '@gobrand/tiempo';

const friday = Temporal.PlainDate.from('2026-01-23');

addBusinessDays(friday, 1); // 2026-01-26
addBusinessDays(friday, 5); // 2026-01-30
addBusinessDays(friday, -1); // 2026-01-22
```

### Keep the local time across a DST change

```ts
import { addBusinessDays } from '@gobrand/tiempo';

const received = Temporal.ZonedDateTime.from('2026-03-06T09:00:00-05:00[America/New_York]');

addBusinessDays(received, 1); // 2026-03-09T09:00:00-04:00[America/New_York] (still 09:00 after DST starts)
```

### Skip holidays

```ts
import { addBusinessDays } from '@gobrand/tiempo';

const holidays = [Temporal.PlainDate.from('2026-12-25'), Temporal.PlainDate.from('2026-12-28')];
const christmasEve = Temporal.PlainDate.from('2026-12-24'); // Thursday

addBusinessDays(christmasEve, 1, holidays); // 2026-12-29 (skips Friday 25th, the weekend, and Monday 28th)
addBusinessDays(christmasEve, 1); // 2026-12-25
```

## Good to know

- Starting on a weekend, the first business day counted is the next Monday (or the previous Friday for negative values). Adding 0 returns the same date, even on a weekend or a holiday.
- Holidays that fall on a weekend, and repeated holidays, change nothing. tiempo has no holiday calendar of its own; pass the dates that apply to you.
