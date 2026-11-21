# formatDuration

Formats a `Temporal.Duration` or plain duration object (such as `{ hours: 2, minutes: 30 }`) as localized text using `Intl.DurationFormat`, with zero locale bundles. Pairs with [`intervalToDuration`](https://tiempo.gobrand.app/docs/intervals/interval-to-duration) for exact elapsed spans.

## Signature

```ts
function formatDuration(
  duration: Temporal.Duration | Temporal.DurationLike,
  options?: {
    locale?: string | string[];
    style?: 'long' | 'short' | 'narrow' | 'digital';
    format?: DurationUnit[];
    zero?: boolean;
  }
): string
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `duration` | `Temporal.Duration \| Temporal.DurationLike` | The duration to format. |
| `options.locale` | `string \| string[]` | Locale for unit names and list separators. Default: `'en-US'`. |
| `options.style` | `'long' \| 'short' \| 'narrow' \| 'digital'` | Output width. Default: `'long'`. |
| `options.format` | `DurationUnit[]` | Subset of units to include (`'years'`, `'months'`, `'weeks'`, `'days'`, `'hours'`, `'minutes'`, `'seconds'`, `'milliseconds'`, `'microseconds'`, `'nanoseconds'`). |
| `options.zero` | `boolean` | Include zero-valued units listed in `format` (or present on a plain object). Default: `false`. |

## Returns

The formatted duration string, or `""` when every included unit is zero and `zero` is `false`.

## Examples

### Format a duration in different styles and locales

```ts
import { formatDuration } from '@gobrand/tiempo';

formatDuration({ hours: 2, minutes: 30 }); // "2 hours, 30 minutes"
formatDuration({ hours: 2, minutes: 30 }, { style: 'short' }); // "2 hr, 30 min"
formatDuration({ hours: 2, minutes: 30 }, { style: 'narrow' }); // "2h 30m"
formatDuration({ hours: 1, minutes: 5, seconds: 9 }, { style: 'digital' }); // "1:05:09"
formatDuration({ hours: 2, minutes: 30 }, { locale: 'es-ES' }); // "2 horas y 30 minutos"
```

### Format an interval breakdown and pick units

```ts
import { formatDuration, intervalToDuration } from '@gobrand/tiempo';

const duration = intervalToDuration({
  start: Temporal.PlainDate.from('2025-01-15'),
  end: Temporal.PlainDate.from('2026-04-20')
});

formatDuration(duration); // "1 year, 3 months, 5 days"
formatDuration(duration, { format: ['years', 'months'] }); // "1 year, 3 months"
```

### Keep zero units visible

```ts
import { formatDuration } from '@gobrand/tiempo';

formatDuration({ hours: 0, minutes: 30 }); // "30 minutes"
formatDuration({ hours: 0, minutes: 30 }, { zero: true }); // "0 hours, 30 minutes"
```

## Good to know

- Built directly on standard `Intl.DurationFormat` (Node.js 22+ and modern browsers) — no locale files to import or bundle.
- For fuzzy relative phrases like `"in 3 days"` or `"2 hours ago"`, use [`intlFormatDistance`](https://tiempo.gobrand.app/docs/formatting/intl-format-distance).
