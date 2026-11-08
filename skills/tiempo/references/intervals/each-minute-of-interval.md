# eachMinuteOfInterval

Returns the start of every minute from the minute containing `start` to the minute containing `end`.

## Signature

```ts
function eachMinuteOfInterval(interval: {
  start: Temporal.Instant | Temporal.ZonedDateTime;
  end: Temporal.Instant | Temporal.ZonedDateTime;
}): Temporal.ZonedDateTime[]
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `interval.start` | `Instant \| ZonedDateTime` | Start of the range |
| `interval.end` | `Instant \| ZonedDateTime` | End of the range, included |

## Returns

A `ZonedDateTime[]` in the timezone of `start` (UTC for an Instant). A reversed range gives `[]`.

## Examples

### Offer 15-minute booking slots

```ts
import { eachMinuteOfInterval } from '@gobrand/tiempo';

const slots = eachMinuteOfInterval({
  start: Temporal.ZonedDateTime.from('2026-06-15T09:00:00-07:00[America/Los_Angeles]'),
  end: Temporal.ZonedDateTime.from('2026-06-15T10:00:00-07:00[America/Los_Angeles]'),
}).filter((minute) => minute.minute % 15 === 0);

slots.map((slot) => slot.toPlainTime().toString()); // ['09:00:00', '09:15:00', '09:30:00', '09:45:00', '10:00:00']
```

## Good to know

- Both ends count, so a full day is 1,441 entries.
