# toPlainTime

Returns a clock time with no date, such as an opening hour. A timestamp needs a timezone.

## Signature

```ts
function toPlainTime(input: Temporal.ZonedDateTime): Temporal.PlainTime

function toPlainTime(
  input: string | Date | Temporal.Instant | Temporal.ZonedDateTime,
  timezone: Timezone
): Temporal.PlainTime

function toPlainTime(input: Temporal.PlainTimeLike | string): Temporal.PlainTime
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `input` | `string \| Date \| Temporal.Instant \| Temporal.ZonedDateTime \| Temporal.PlainTimeLike` | An `HH:mm[:ss[.fff]]` string, `{ hour, minute }`, a `PlainTime`, a `ZonedDateTime`, or a timestamp. |
| `timezone` | `Timezone` | Required for timestamps (ISO strings with a date, `Date`, `Instant`). With a `ZonedDateTime`, moves it to this timezone first. |

## Returns

A `Temporal.PlainTime`.

## Examples

### Read opening hours from settings

```ts
import { toPlainTime } from '@gobrand/tiempo';

toPlainTime('09:00'); // 09:00:00
toPlainTime({ hour: 21, minute: 15 }); // 21:15:00
```

### See a standup's local time for each teammate

```ts
import { toPlainTime } from '@gobrand/tiempo';

const standup = '2026-03-10T16:30:00Z';

toPlainTime(standup, 'America/Los_Angeles'); // 09:30:00
toPlainTime(standup, 'Europe/Madrid'); // 17:30:00
```

## Good to know

- Hours need two digits: `'9:30'` throws, `'09:30'` works.
