import { Temporal, isPlainDate, isPlainTime } from './temporal';

export type Timeline = Temporal.Instant | Temporal.ZonedDateTime;
export type Comparable = Timeline | Temporal.PlainDate | Temporal.PlainTime;

/**
 * @internal
 * Throws unless both values share a domain: two PlainDates, two PlainTimes,
 * or two timeline values (Instant/ZonedDateTime in any combination).
 */
export function assertSameDomain(a: Comparable, b: Comparable): void {
  if ((isPlainDate(a) || isPlainDate(b)) && !(isPlainDate(a) && isPlainDate(b))) {
    throw new TypeError('PlainDate comparisons require two PlainDate values');
  }
  if ((isPlainTime(a) || isPlainTime(b)) && !(isPlainTime(a) && isPlainTime(b))) {
    throw new TypeError('PlainTime comparisons require two PlainTime values');
  }
}

/**
 * @internal
 * Orders two values from one domain: timeline values by exact instant,
 * PlainDates by ISO date, PlainTimes by clock time. Mixed domains throw.
 */
export function compare(a: Comparable, b: Comparable): -1 | 0 | 1 {
  assertSameDomain(a, b);
  if (isPlainDate(a)) {
    return Temporal.PlainDate.compare(ownDate(a), ownDate(b as Temporal.PlainDate));
  }
  if (isPlainTime(a)) {
    return Temporal.PlainTime.compare(a, b as Temporal.PlainTime);
  }
  const difference = a.epochNanoseconds - (b as Timeline).epochNanoseconds;
  return difference < 0n ? -1 : difference > 0n ? 1 : 0;
}

/**
 * @internal
 * Places a value on a nanosecond axis within its domain so distances between
 * values of the same domain can be measured. Callers check domains first.
 */
export function position(value: Comparable): bigint {
  if (isPlainDate(value)) {
    return Temporal.PlainDate.from(ownDate(value)).toZonedDateTime('UTC').epochNanoseconds;
  }
  if (isPlainTime(value)) {
    const seconds = (value.hour * 60 + value.minute) * 60 + value.second;
    const subsecond = value.millisecond * 1_000_000 + value.microsecond * 1_000 + value.nanosecond;
    return BigInt(seconds) * 1_000_000_000n + BigInt(subsecond);
  }
  return value.epochNanoseconds;
}

// Dates from another Temporal implementation cross over as canonical strings,
// which keep their calendar annotation.
function ownDate(date: Temporal.PlainDate): Temporal.PlainDate | string {
  return Temporal.PlainDate.prototype.isPrototypeOf(date) ? date : date.toString();
}
