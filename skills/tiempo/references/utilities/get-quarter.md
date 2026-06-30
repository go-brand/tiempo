# getQuarter

Returns the quarter (1, 2, 3, or 4) that a datetime falls in. Quarters: Q1 = Jan–Mar, Q2 = Apr–Jun, Q3 = Jul–Sep, Q4 = Oct–Dec.

`Temporal` has no native quarter field, so this fills the gap. `Instant` inputs are interpreted in UTC; `ZonedDateTime` inputs use their own timezone.

## Signature

```ts
function getQuarter(
  input: Temporal.Instant | Temporal.ZonedDateTime
): 1 | 2 | 3 | 4
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `input` | `Temporal.Instant \| Temporal.ZonedDateTime` | The datetime to get the quarter for |

## Returns

The quarter number, typed as the literal union `1 | 2 | 3 | 4` for exhaustiveness checking and safe lookup-table indexing.

## Examples

```ts
import { getQuarter } from '@gobrand/tiempo';

getQuarter(Temporal.Instant.from('2025-02-15T12:00:00Z')); // 1
getQuarter(Temporal.Instant.from('2025-05-15T12:00:00Z')); // 2
getQuarter(Temporal.Instant.from('2025-08-15T12:00:00Z')); // 3
getQuarter(Temporal.Instant.from('2025-11-15T12:00:00Z')); // 4
```

### Timezone awareness

```ts
// Same instant, different quarter depending on perspective
const zoned = Temporal.ZonedDateTime.from('2025-03-31T23:00:00-04:00[America/New_York]');

getQuarter(zoned);                      // 1 (March in New York)
getQuarter(zoned.withTimeZone('UTC'));  // 2 (April in UTC)
```
