# differenceInWeeks

Returns the weeks of 7 calendar days from `earlierDate` to `laterDate`.

## Signature

```ts
function differenceInWeeks(
  laterDate: Temporal.PlainDate,
  earlierDate: Temporal.PlainDate,
  options?: DifferenceOptions
): number

function differenceInWeeks(
  laterDate: Temporal.Instant | Temporal.ZonedDateTime,
  earlierDate: Temporal.Instant | Temporal.ZonedDateTime,
  options?: DifferenceOptions
): number

interface DifferenceOptions {
  fractional?: boolean;
}
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `laterDate` | `PlainDate` or `Instant \| ZonedDateTime` | The value to subtract from |
| `earlierDate` | Same kind as `laterDate` | The value to subtract |
| `options.fractional` | `boolean` | Return the exact value instead of truncating toward zero (default `false`) |

## Returns

A signed number of weeks, truncated toward zero unless `fractional` is set.

## Examples

### Count full weeks since a project kickoff

```ts
import { differenceInWeeks } from '@gobrand/tiempo';

const kickoff = Temporal.PlainDate.from('2026-01-05');
const review = Temporal.PlainDate.from('2026-03-30');

differenceInWeeks(review, kickoff); // 12
```

### Get partial weeks

```ts
import { differenceInWeeks } from '@gobrand/tiempo';

const trialStart = Temporal.Instant.from('2026-01-05T00:00:00Z');
const cancelled = Temporal.Instant.from('2026-01-15T12:00:00Z');

differenceInWeeks(cancelled, trialStart); // 1
differenceInWeeks(cancelled, trialStart, { fractional: true }); // 1.5
```

## Good to know

- Mixing a PlainDate with an Instant or ZonedDateTime is a TypeScript error and throws a `TypeError`.
