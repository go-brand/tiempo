# isWeekend

Returns true if the value falls on a Saturday or Sunday.

Instant inputs are read in UTC. ZonedDateTime inputs use their own timezone. PlainDate inputs use their date directly. To check a moment for a specific user, convert it to their timezone first.

## Signature

```ts
function isWeekend(input: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate): boolean
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `input` | `Instant \| ZonedDateTime \| PlainDate` | The value to check |

## Returns

`true` on Saturday or Sunday, `false` otherwise.

## Examples

```ts
import { isWeekend } from '@gobrand/tiempo';

isWeekend(Temporal.PlainDate.from('2025-01-25')); // true
isWeekend(Temporal.PlainDate.from('2025-01-27')); // false
```

### The timezone decides the day

```ts
import { isWeekend, toZonedTime } from '@gobrand/tiempo';

const instant = Temporal.Instant.from('2025-01-25T02:00:00Z'); // Saturday in UTC

isWeekend(instant); // true
isWeekend(toZonedTime(instant, 'America/New_York')); // false
```
