# Temporal input boundary audit and polyfill removal path

8 October 2026. Unreleased follow-up to calendar-difference interoperability. Roadmap item 23 is complete for the supported input domains and known object-consuming boundaries; runtime migration in item 24 remains open.

## Fixes

- `toPlainDate(plainDate)` now passes a canonical Temporal string into the selected constructor. Foreign objects expose `calendarId`, whereas property bags use `calendar`; treating a foreign date as a bag discarded calendar information. Hebrew leap months threw, Japanese calendar annotations vanished, and an Islamic-calendar date in 2024 became ISO year 1445. Property bags still pass through unchanged. Conversion still returns a new object.
- PlainDate quarter intervals use the existing cross-implementation date comparison for their reversed-endpoint check.
- Month, quarter and year intervals now carry the start calendar into constructed dates/year-months, and interpret the end in the start calendar and timezone. Previously a Hebrew date in 2024 produced ISO-year-5784 results, even without mixed implementations.
- Quarter iteration realigns at calendar year boundaries. A thirteen-month year includes month 13 as its final start, followed by month 1 of the next year, instead of advancing into the wrong quarter alignment.

## Boundaries inspected

| Boundary | Result |
| --- | --- |
| Instant/ZonedDateTime conversions | Methods execute on the caller's object; exact epoch values survive. Existing ISO-calendar projection through Instant remains unchanged. |
| PlainDate construction/comparison | Canonical strings retain ISO date and calendar when implementations differ. Conversion fixed here; specialized comparisons fixed earlier. |
| PlainTime construction/comparison | All clock fields are exposed as ordinary compatible properties, including nanoseconds; tests pass without a bridge. |
| `until` / duration `relativeTo` | Previous calendar-difference fix serializes the other date. The returned duration and relativeTo object belong to the same implementation. |
| PlainDate-to-zone boundaries | Foreign PlainTime midnight values expose all fields required by the consuming implementation; boundary tests pass. |
| Interval endpoints and internal year-months | Timeline loops compare epoch values. PlainDate ordering is bridged. Constructed year-months share tiempo's implementation and now preserve calendars. |
| Arithmetic, rounding, same-period checks | Delegate to input methods with primitive options/durations or compare primitive fields. Existing arithmetic/timeline regressions cover foreign callers. |
| Formatting/serialization | Delegate to the input or pass primitive timestamps to Intl. Tested formatting and relative-formatting consumers across implementations. |

This is an interoperability audit, not a claim of exhaustive support for every calendar's business conventions. For example, the separate quarter API audit still needs to resolve `getQuarter`'s declared 1–4 return type for calendars with a thirteenth month. This update documents the interval behavior without changing that public return type.

## Output identity

The public contract is the Temporal result type and documented value/context. Outputs do not uniformly belong to one constructor:

- `toInstant(instant)` returns the original object.
- `toPlainDate(plainDate)` and `toPlainTime(plainTime)` create a new value with tiempo's selected constructor.
- Direct methods on caller objects usually produce values from the caller's implementation.
- Parsing strings/property bags, current-time constructors and month/quarter/year interval construction use tiempo's selected implementation.

Do not require a single constructor's `instanceof` check to accept every result. No new public wrapper, runtime selector, initialization API, or constructor-identity promise is introduced.

## Size evidence

Reproduce from the repository root with `node scripts/measure-temporal-bundle.mjs`. Node 26.5.0, esbuild 0.27.2, browser platform, ES2022 target, minified ESM, gzip using Node's default zlib settings. These are export-retaining consumer bundles, not npm tarball sizes or application performance measurements.

| Imports | Current bytes / gzip bytes | Native-only experiment bytes / gzip bytes |
| --- | ---: | ---: |
| `addDays`, `toInstant` | 162,729 / 47,418 | 653 / 356 |
| `format`, `toInstant` | 169,275 / 48,874 | 7,143 / 1,925 |
| All exports | 186,674 / 52,378 | 24,344 / 5,519 |

The experiment substitutes `globalThis.Temporal` at the shared runtime import during bundling only. Its esbuild metadata contains zero polyfill modules; the current bundle contains the polyfill. It does not modify production files or validate a new declaration package. Shipping sizes remain unchanged by this experiment.

## Native-only release proposal

1. Keep the current 3.x runtime support and bundled polyfill while shipping these correctness fixes.
2. Target a future breaking release with global Temporal available before tiempo is imported. Use official Node 26+ builds as the proposed Node baseline, verify the actual global in tests, and explicitly test the browser versions advertised at release time. Node 26 enables Temporal by default ([Node release notes](https://nodejs.org/ja/blog/release/v26.0.0)); native Temporal is still not a universal browser baseline ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal)). These are proposal constraints, not changes to the current support promise.
3. Replace emitted declaration imports from `@js-temporal/polyfill` with a supported standard Temporal type source and test the documented minimum TypeScript version. Removing only the runtime import would leave consumers dependent on the old package through `.d.ts` files.
4. Provide a tested migration for applications that support older environments: explicitly install their chosen polyfill on the global before importing tiempo. Handle module evaluation order at the application entry point; keep tiempo's utility functions synchronous.
5. Verify a packed native-only artifact with no runtime or declaration dependency on the polyfill. Test native Node and real browsers, plus an application-supplied-polyfill environment with no native global. Retain mixed-caller coverage because applications can still import polyfill objects independently.
6. Publish runtime requirements, migration examples and measured bundle changes together. A native-first conditional that still statically imports the polyfill does not accomplish removal.

## Verification

- First conversion/order regression run after correcting invalid test calls: 8 failures / 96 passes; failures were lost non-ISO calendar data and foreign PlainDate ordering.
- Separate interval calendar-loss regression run: 16 failures / 104 passes before those fixes.
- Final new suite: 120 passing runs across both runtime selections. Includes ISO, Hebrew, Japanese and Islamic-civil calendars, mixed endpoint directions, PlainTime nanoseconds, conversion identity, boundaries, intervals and formatting.
- Full suite: 3,890 passing test runs across 212 project/file runs on Node 26.
- Node 22: 30 applicable new cases pass; 30 native-dependent cases explicitly skip.
- Typecheck, library build, built-package smoke and generated docs complete successfully.
- Chrome 154.0.8037.98: minified browser bundles import without `process`. Both the current bundle and native-only experiment pass conversion, non-ISO interval, reversed interval and mixed DST-difference smoke checks. This is local browser evidence; no browser CI job was added.

Installed-tarball ESM, NodeNext/Bundler declarations and minified browser consumer checks pass. Website typecheck and production build pass. `git diff --check` passes. Existing Node loader deprecation and website chunk-size warnings remain nonblocking. Nothing has been published or deployed; package version and runtime dependency remain unchanged.
