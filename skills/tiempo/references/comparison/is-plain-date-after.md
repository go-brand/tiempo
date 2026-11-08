# isPlainDateAfter

Returns `true` when the first date comes after the second. Same answer as [isAfter](https://tiempo.gobrand.app/docs/comparison/is-after), but accepts only PlainDates.

## Signature

```ts
function isPlainDateAfter(date1: Temporal.PlainDate, date2: Temporal.PlainDate): boolean;
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `date1` | `PlainDate` | The date being checked |
| `date2` | `PlainDate` | The date to compare against |

## Returns

`true` if `date1` is after `date2`, otherwise `false`. Equal dates return `false`.

## Examples

### Find invoices whose due date has passed

```ts
import { isPlainDateAfter } from '@gobrand/tiempo';

const dueDate = Temporal.PlainDate.from('2026-04-15');

isPlainDateAfter(Temporal.PlainDate.from('2026-04-16'), dueDate); // true (one day overdue)
isPlainDateAfter(Temporal.PlainDate.from('2026-04-15'), dueDate); // false (due today is not overdue)
```
