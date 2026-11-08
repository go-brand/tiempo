# differenceInNanoseconds

Returns the exact nanoseconds elapsed from `earlierDate` to `laterDate` as a `bigint`.

## Signature

```ts
function differenceInNanoseconds(
  laterDate: Temporal.Instant | Temporal.ZonedDateTime,
  earlierDate: Temporal.Instant | Temporal.ZonedDateTime
): bigint
```

## Examples

### Measure a span from a trace

```ts
import { differenceInNanoseconds } from '@gobrand/tiempo';

const spanStart = Temporal.Instant.fromEpochNanoseconds(1_777_887_000_000_000_000n);
const spanEnd = Temporal.Instant.fromEpochNanoseconds(1_777_887_000_000_000_750n);

differenceInNanoseconds(spanEnd, spanStart); // 750 (750n)
```

## Good to know

- The result is a `bigint`, so do arithmetic with other bigints: `/ 1_000n`, not `/ 1000`.
