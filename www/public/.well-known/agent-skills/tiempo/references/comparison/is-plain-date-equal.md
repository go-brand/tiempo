# isPlainDateEqual

Returns `true` when both dates are the same day. Same answer as [isEqual](https://tiempo.gobrand.app/docs/comparison/is-equal), but accepts only PlainDates.

## Signature

```ts
function isPlainDateEqual(date1: Temporal.PlainDate, date2: Temporal.PlainDate): boolean;
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `date1` | `PlainDate` | The first date |
| `date2` | `PlainDate` | The second date |

## Returns

`true` if both dates are the same day, otherwise `false`.

## Examples

### Check whether a delivery lands on the promised date

```ts
import { isPlainDateEqual } from '@gobrand/tiempo';

const promised = Temporal.PlainDate.from('2026-12-22');

isPlainDateEqual(Temporal.PlainDate.from('2026-12-22'), promised); // true
isPlainDateEqual(Temporal.PlainDate.from('2026-12-23'), promised); // false
```
