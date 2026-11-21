import type { Temporal as PolyfillTemporal } from '@js-temporal/polyfill';

/**
 * @internal
 * Stand-in for `@js-temporal/polyfill` in the `@gobrand/tiempo/native` build.
 *
 * The native build aliases the polyfill import in `shared/temporal.ts` to this
 * module (see `tsup.config.ts`), so the runtime's built-in `Temporal` is used and
 * no polyfill code is bundled. Types still come from the polyfill: they describe
 * the same API and are erased at build time.
 */
const runtime = (globalThis as { Temporal?: typeof PolyfillTemporal }).Temporal;

if (!runtime) {
  throw new TypeError(
    "@gobrand/tiempo/native needs a runtime with built-in Temporal (Node.js 26+, recent browsers). Import '@gobrand/tiempo' instead, or load a Temporal polyfill before this module."
  );
}

export const Temporal: typeof PolyfillTemporal = runtime;
