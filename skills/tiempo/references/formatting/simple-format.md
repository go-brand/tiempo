# simpleFormat

Formats a date, a time, or both in a short readable style, such as `Dec 3, 9am`, without a token pattern.

## Signature

```ts
function simpleFormat(
  input: Temporal.PlainDate | Temporal.ZonedDateTime | Temporal.Instant,
  options: {
    date?: 'compact' | 'auto' | 'full';
    time?: '12h' | '24h' | 'compact';
    locale?: string;
    timeZone?: Timezone;
  } // at least one of `date` and `time`
): string
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `input` | `Temporal.PlainDate \| Temporal.ZonedDateTime \| Temporal.Instant` | The value to format. |
| `options.date` | `'compact' \| 'auto' \| 'full'` | `Dec 3`; `Dec 3` this year and `Dec 3, 2024` otherwise; `Dec 3, 2026`. |
| `options.time` | `'12h' \| '24h' \| 'compact'` | `2:30 PM`; `14:30`; `2:30pm` or `9am`. |
| `options.locale` | `string` | Default `'en-US'`. |
| `options.timeZone` | `Timezone` | Timezone to show the moment in. Default: UTC for an `Instant`, its own timezone for a `ZonedDateTime`. |

## Returns

The formatted string. Date and time are joined with `, `.

## Examples

### Show a booking in a list

```ts
import { simpleFormat } from '@gobrand/tiempo';

const booking = Temporal.ZonedDateTime.from('2026-12-03T09:00:00[America/Chicago]');

simpleFormat(booking, { date: 'compact', time: 'compact' }); // "Dec 3, 9am"
simpleFormat(booking, { date: 'full', time: '12h' }); // "Dec 3, 2026, 9:00 AM"
```

### Show a UTC shipping time to the customer

```ts
import { simpleFormat } from '@gobrand/tiempo';

const shippedAt = Temporal.Instant.from('2026-12-03T20:30:00Z');

simpleFormat(shippedAt, { time: '24h', timeZone: 'Europe/Madrid' }); // 21:30
```

### Date an old post in a feed

```ts
import { simpleFormat, toPlainDate } from '@gobrand/tiempo';

simpleFormat(toPlainDate('2024-12-23'), { date: 'auto' }); // "Dec 23, 2024"
```

## Good to know

- `time: 'compact'` is always English `am`/`pm`, whatever the locale.
- A `PlainDate` with `time` is not rejected; it formats midnight (`12:00 AM`).
