import type { Temporal as TemporalNamespace } from '@js-temporal/polyfill';

/**
 * @internal
 * Single source of the Temporal implementation.
 *
 * Prefers the runtime's native `globalThis.Temporal` (Node 26+, Chrome 144+,
 * Firefox 139+, Edge, Deno) and dynamically loads `@js-temporal/polyfill` only
 * when native Temporal is absent (Safari, Node <= 25). On native runtimes the
 * polyfill is never imported or executed.
 *
 * Do not import the polyfill directly anywhere else in src/ — import `Temporal`
 * from this module so the runtime choice stays in one place.
 */
export const Temporal: typeof TemporalNamespace =
  (globalThis as { Temporal?: typeof TemporalNamespace }).Temporal ??
  (await import('@js-temporal/polyfill')).Temporal;

/**
 * @internal
 * Merge the resolved value with the polyfill's `Temporal` type namespace so a
 * single `import { Temporal }` serves both runtime construction
 * (`Temporal.Instant.from(...)`) and type annotations (`Temporal.Instant`),
 * exactly like importing `Temporal` directly from the polyfill used to.
 */
export namespace Temporal {
  export type Instant = TemporalNamespace.Instant;
  export type ZonedDateTime = TemporalNamespace.ZonedDateTime;
  export type PlainDate = TemporalNamespace.PlainDate;
  export type PlainTime = TemporalNamespace.PlainTime;
  export type PlainDateTime = TemporalNamespace.PlainDateTime;
  export type PlainYearMonth = TemporalNamespace.PlainYearMonth;
  export type PlainMonthDay = TemporalNamespace.PlainMonthDay;
  export type Duration = TemporalNamespace.Duration;
  export type PlainTimeLike = TemporalNamespace.PlainTimeLike;
  export type PlainDateLike = TemporalNamespace.PlainDateLike;
}

/**
 * @internal
 * Implementation-agnostic type guards.
 *
 * `instanceof` is identity-based and fails across implementations. The Temporal
 * spec requires every implementation to set `Symbol.toStringTag`, so brand
 * checks work regardless of which implementation produced the object.
 */
function brand(value: unknown): string | undefined {
  return typeof value === 'object' && value !== null
    ? (value as { [Symbol.toStringTag]?: string })[Symbol.toStringTag]
    : undefined;
}

export function isInstant(value: unknown): value is TemporalNamespace.Instant {
  return brand(value) === 'Temporal.Instant';
}

export function isZonedDateTime(
  value: unknown
): value is TemporalNamespace.ZonedDateTime {
  return brand(value) === 'Temporal.ZonedDateTime';
}

export function isPlainDate(
  value: unknown
): value is TemporalNamespace.PlainDate {
  return brand(value) === 'Temporal.PlainDate';
}
