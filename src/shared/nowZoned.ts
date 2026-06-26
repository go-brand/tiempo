import { Temporal } from './temporal';
import { normalizeTemporalInput } from './normalizeTemporalInput';

export function nowZoned(): Temporal.ZonedDateTime {
  return normalizeTemporalInput(Temporal.Now.instant());
}
