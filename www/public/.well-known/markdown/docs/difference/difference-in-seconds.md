# differenceInSeconds

Returns the seconds elapsed from `earlierDate` to `laterDate`.

## Signature

```ts
function differenceInSeconds(
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
| `laterDate` | `Instant \| ZonedDateTime` | The value to subtract from |
| `earlierDate` | `Instant \| ZonedDateTime` | The value to subtract |
| `options.fractional` | `boolean` | Return the exact value instead of truncating toward zero (default `false`) |

## Returns

A signed number of seconds, truncated toward zero unless `fractional` is set.

## Examples

### Seconds left before a sign-in code expires

```ts
import { differenceInSeconds } from '@gobrand/tiempo';

const expiresAt = Temporal.Instant.from('2026-05-04T09:35:00Z');
const checkedAt = Temporal.Instant.from('2026-05-04T09:33:20Z');

differenceInSeconds(expiresAt, checkedAt); // 100
```

### Watch time of a video

```ts
import { differenceInSeconds } from '@gobrand/tiempo';

const play = Temporal.Instant.from('2026-05-04T09:30:00Z');
const pause = Temporal.Instant.from('2026-05-04T09:31:12.750Z');

differenceInSeconds(pause, play); // 72
differenceInSeconds(pause, play, { fractional: true }); // 72.75
```
