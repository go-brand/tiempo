import { Temporal as PolyfillTemporal } from "@js-temporal/polyfill";

/**
 * @internal
 * Single source of the Temporal implementation.
 *
 * Shipping behavior is unchanged: production code always resolves to
 * `@js-temporal/polyfill`. Native-first was reverted because tiempo passes
 * caller-provided Temporal objects into methods that may require matching
 * implementations. Timeline comparisons use epoch nanoseconds; calendar differences bridge
 * implementations with canonical strings. Conversion and interval input boundaries are
 * audited as well. Runtime support and declaration migration still gate removal
 * of the bundled polyfill; constructor identity is not uniform across outputs.
 *
 * For tests only, `TIEMPO_TEMPORAL` selects the implementation so the same
 * suite runs against both the polyfill and the runtime's native `Temporal`:
 *   - `TIEMPO_TEMPORAL=polyfill` forces the polyfill (any Node version).
 *   - `TIEMPO_TEMPORAL=native` uses `globalThis.Temporal` (Node >= 26).
 *   - unset defaults to the polyfill, matching shipped behavior.
 * Tests import `Temporal` from here so both lib and test objects come from the
 * same implementation. timelineInterop.test.ts separately covers native,
 * polyfill and mixed timeline inputs against both selections.
 *
 * Import `Temporal` from here so the implementation choice stays in one place.
 */
const useNative =
  typeof process !== "undefined" &&
  process.env?.TIEMPO_TEMPORAL === "native" &&
  "Temporal" in globalThis;

export const Temporal = useNative
  ? (globalThis as unknown as { Temporal: typeof PolyfillTemporal }).Temporal
  : PolyfillTemporal;

/**
 * @internal
 * Type-side of `Temporal`, merged with the runtime value above so a single
 * `import { Temporal } from './shared/temporal'` serves both `Temporal.from(...)`
 * (value) and `: Temporal.ZonedDateTime` (type). Types are identical across
 * implementations and erased at build, so they always come from the polyfill.
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Temporal {
  // Add new Temporal.* member types here the first time they are referenced
  // from this module. Omissions fail loudly at typecheck, never silently.
  export type Instant = PolyfillTemporal.Instant;
  export type ZonedDateTime = PolyfillTemporal.ZonedDateTime;
  export type PlainDate = PolyfillTemporal.PlainDate;
  export type PlainDateLike = PolyfillTemporal.PlainDateLike;
  export type PlainDateTime = PolyfillTemporal.PlainDateTime;
  export type PlainTime = PolyfillTemporal.PlainTime;
  export type PlainTimeLike = PolyfillTemporal.PlainTimeLike;
  export type PlainYearMonth = PolyfillTemporal.PlainYearMonth;
}

/**
 * @internal
 * Implementation-agnostic type guards. The Temporal spec requires every
 * implementation to set `Symbol.toStringTag`, so these work regardless of which
 * implementation produced the object.
 */
function brand(value: unknown): string | undefined {
  return typeof value === "object" && value !== null
    ? (value as { [Symbol.toStringTag]?: string })[Symbol.toStringTag]
    : undefined;
}

export function isInstant(value: unknown): value is Temporal.Instant {
  return brand(value) === "Temporal.Instant";
}

export function isZonedDateTime(value: unknown): value is Temporal.ZonedDateTime {
  return brand(value) === "Temporal.ZonedDateTime";
}

export function isPlainDate(value: unknown): value is Temporal.PlainDate {
  return brand(value) === "Temporal.PlainDate";
}

export function isPlainTime(value: unknown): value is Temporal.PlainTime {
  return brand(value) === "Temporal.PlainTime";
}
