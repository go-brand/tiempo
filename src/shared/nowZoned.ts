import { Temporal } from '@js-temporal/polyfill';
import { normalizeTemporalInput } from './normalizeTemporalInput';

export function nowZoned(): Temporal.ZonedDateTime {
  return normalizeTemporalInput(Temporal.Now.instant());
}
