# formatPlainDate

Formats a `PlainDate` with date tokens. Same as [format](https://tiempo.gobrand.app/docs/formatting/format) with a `PlainDate`.

## Signature

```ts
function formatPlainDate(
  date: Temporal.PlainDate,
  formatStr: string,
  options?: { locale?: string }
): string
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `date` | `Temporal.PlainDate` | The date to format. |
| `formatStr` | `string` | The pattern. Era, year, quarter, month, day, and weekday [tokens](https://tiempo.gobrand.app/docs/formatting/format#tokens) are supported. Text in single quotes is printed as is. |
| `options.locale` | `string` | Locale for month and weekday names. Default `'en-US'`. |

## Returns

The formatted string.

## Examples

### Show an invoice due date

```ts
import { formatPlainDate, toPlainDate } from '@gobrand/tiempo';

const due = toPlainDate('2026-04-15');

formatPlainDate(due, 'EEEE, MMMM do'); // "Wednesday, April 15th"
formatPlainDate(due, 'dd/MM/yyyy'); // 15/04/2026
```

### Show a hotel check-in date in French

```ts
import { formatPlainDate, toPlainDate } from '@gobrand/tiempo';

formatPlainDate(toPlainDate('2026-08-14'), 'EEEE d MMMM yyyy', { locale: 'fr-FR' }); // "vendredi 14 août 2026"
```

## Good to know

- Time tokens are printed as is: `'HH:mm'` gives `"HH:mm"`.
