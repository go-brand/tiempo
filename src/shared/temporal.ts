import { Temporal } from '@js-temporal/polyfill';

/**
 * @internal
 * Single source of the Temporal implementation.
 *
 * Currently always uses `@js-temporal/polyfill`. A previous attempt to prefer
 * the runtime's native `globalThis.Temporal` was reverted: tiempo passes
 * caller-provided Temporal objects into static methods
 * (`Temporal.ZonedDateTime.compare`, etc.), and a native static method throws
 * ("Must specify time zone.") when handed an object created by a different
 * implementation than the one tiempo resolved. Native-first can return once
 * inputs are normalized into the resolved implementation at the boundary, with
 * a native-Temporal CI runner guarding it.
 *
 * Import `Temporal` from here so the implementation choice stays in one place.
 */
export { Temporal };

/**
 * @internal
 * Implementation-agnostic type guards. The Temporal spec requires every
 * implementation to set `Symbol.toStringTag`, so these work regardless of which
 * implementation produced the object.
 */
function brand(value: unknown): string | undefined {
  return typeof value === 'object' && value !== null
    ? (value as { [Symbol.toStringTag]?: string })[Symbol.toStringTag]
    : undefined;
}

export function isInstant(value: unknown): value is Temporal.Instant {
  return brand(value) === 'Temporal.Instant';
}

export function isZonedDateTime(
  value: unknown
): value is Temporal.ZonedDateTime {
  return brand(value) === 'Temporal.ZonedDateTime';
}

export function isPlainDate(value: unknown): value is Temporal.PlainDate {
  return brand(value) === 'Temporal.PlainDate';
}
