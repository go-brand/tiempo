# intlFormatDistance

Describes `laterDate` relative to `earlierDate`, such as `in 3 weeks` or `2 hours ago`, in any locale. The unit is picked for you.

## Signature

```ts
function intlFormatDistance(
  laterDate: Temporal.Instant | Temporal.ZonedDateTime,
  earlierDate: Temporal.Instant | Temporal.ZonedDateTime,
  options?: {
    unit?: Intl.RelativeTimeFormatUnit;
    locale?: string | string[];
    localeMatcher?: 'best fit' | 'lookup';
    numeric?: 'always' | 'auto';
    style?: 'long' | 'short' | 'narrow';
  }
): string
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `laterDate` | `Temporal.Instant \| Temporal.ZonedDateTime` | The moment to describe. If it is before `earlierDate`, the text is in the past. |
| `earlierDate` | `Temporal.Instant \| Temporal.ZonedDateTime` | The moment to describe it from, usually now. |
| `options.unit` | `Intl.RelativeTimeFormatUnit` | Force a unit, such as `'day'`. |
| `options.locale` | `string \| string[]` | Default: the runtime's locale. |
| `options.localeMatcher` | `'best fit' \| 'lookup'` | Passed to `Intl.RelativeTimeFormat`. |
| `options.numeric` | `'always' \| 'auto'` | `'auto'` (default) allows `tomorrow` and `yesterday`; `'always'` gives `in 1 day`. |
| `options.style` | `'long' \| 'short' \| 'narrow'` | `in 3 months` (default) or shorter forms such as `in 3 mo.`. |

## Returns

The localized text.

## Examples

### Show when a comment was posted

```ts
import { intlFormatDistance } from '@gobrand/tiempo';

const postedAt = Temporal.Instant.from('2026-03-10T09:15:00Z');
const current = Temporal.Instant.from('2026-03-10T11:40:00Z'); // now('UTC') in an app

intlFormatDistance(postedAt, current, { locale: 'en' }); // "2 hours ago"
intlFormatDistance(postedAt, current, { locale: 'es' }); // "hace 2 horas"
```

### Count down to a subscription renewal

```ts
import { intlFormatDistance } from '@gobrand/tiempo';

const renewsAt = Temporal.Instant.from('2026-04-01T00:00:00Z');
const current = Temporal.Instant.from('2026-03-10T00:00:00Z');

intlFormatDistance(renewsAt, current, { locale: 'en' }); // "in 3 weeks"
intlFormatDistance(renewsAt, current, { locale: 'en', unit: 'day' }); // "in 22 days"
```

### Say "tomorrow" or "in 1 day"

```ts
import { intlFormatDistance } from '@gobrand/tiempo';

const delivery = Temporal.Instant.from('2026-03-11T10:00:00Z');
const current = Temporal.Instant.from('2026-03-10T10:00:00Z');

intlFormatDistance(delivery, current, { locale: 'en' }); // tomorrow
intlFormatDistance(delivery, current, { locale: 'en', numeric: 'always' }); // "in 1 day"
```

## Good to know

- Without `unit`, it uses seconds under 1 minute, minutes under 1 hour, hours under 1 day, days under 7 days, weeks under 4 weeks, months under 12 months, and years after that.
- Hours, minutes, and seconds count whole units (1 h 59 min is `in 1 hour`). Larger units are rounded, after the unit is picked, so 6.9 days is `in 7 days`, not `in 1 week`.
