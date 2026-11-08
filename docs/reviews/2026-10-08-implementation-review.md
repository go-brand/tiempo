# Tiempo implementation review — 8 October 2026

Reviewed commit `6219c0a`, package version `3.0.1`, on Node `26.5.0`. Scope: public library implementations, shared helpers, tests, declarations, build and release configuration. Website design, publishing, dependency upgrades, and implementation fixes were outside this review.

The direct Temporal wrappers are generally clear and appropriately small. The main problems are runtime boundaries and edge cases: browser loading, mixing Temporal implementations, midnight and partial-hour timezone transitions, formatting parts, and precision. These warrant focused fixes rather than an architectural rewrite.

Implementation follow-up: the [correctness fixes report](2026-10-08-correctness-fixes.md) records the subsequent working-tree changes. Findings below describe the reviewed commit, not the current fixed behavior.

## Verification audit

Rechecked every finding against the implementation, public documentation, existing tests, and relevant Git history. All reported runtime symptoms reproduce. The corrected classification is **10 defects or tooling problems and one known compatibility limitation**, with browser loading the sole P1 finding.

- Finding 2 was overstated as a P1 defect. The documented path uses polyfill-created objects, and commit `4a983e7` explicitly defers native-first support because of interoperability problems. Native input failures are real, but they do not establish a regression in the documented polyfill path.
- Finding 10 is independently supported by npm's published deprecation metadata, in addition to the local launcher failure. The pin also requires Node `>=22.13`, which conflicts with the Node 20 CI job. No remote CI failure is claimed without executing it.
- Finding 6 is a confirmed mismatch with the documented local-hour-boundary contract. The exact treatment of a partially missing hour still needs a contract decision; the reproduction only asserts the unambiguous later `03:00` and `04:00` boundaries.
- Formatting probes now derive the expected name/era from Intl parts, so a different ICU spelling such as `GMT-5` cannot create a false positive. Native probes are labeled separately, and positive browser/polyfill controls distinguish an implementation defect from a broken harness.

## Findings

### 1. [P1] Browser imports crash before any function can run

Source: [src/shared/temporal.ts:28](/Users/rubencostamartinez/Desktop/tiempo/src/shared/temporal.ts:28).

The module evaluates `process.env.TIEMPO_TEMPORAL` unconditionally. Browsers do not normally provide `process`. Bundling either the source entry point or freshly built package for the browser and evaluating it without a process shim throws `ReferenceError: process is not defined`. This affects all public imports that reach this helper, including the README conversion example; the website's successful build does not establish that arbitrary consumers can load the package.

Keep the test implementation selector behind a safe environment check, or move test selection into test setup. Add a browser import smoke check without injected Node globals.

### 2. [P2, known compatibility limitation] Native inputs fail with the default polyfill implementation

Sources: [src/shared/normalizeTemporalInput.ts:12](/Users/rubencostamartinez/Desktop/tiempo/src/shared/normalizeTemporalInput.ts:12), [src/shared/isBefore.ts:7](/Users/rubencostamartinez/Desktop/tiempo/src/shared/isBefore.ts:7), [vitest.config.ts:15](/Users/rubencostamartinez/Desktop/tiempo/vitest.config.ts:15).

Production defaults to the polyfill. Brand checks recognize native objects, and normalization returns those objects unchanged. Polyfill static comparison then treats a native ZonedDateTime as a property bag, where the required `timeZone` property is absent; Temporal objects expose `timeZoneId` instead.

On Node 26, `isBefore(nativeZoned, nativeZoned.add({ hours: 1 }))`, `isPast(nativeZoned)`, and `eachHourOfInterval` with native endpoints all throw `required property 'timeZone' missing or undefined`. The same paths succeed with polyfill inputs; mixed native/polyfill comparison arguments also fail. Switching library and test factories together tests each implementation in isolation, not their interoperability.

This limitation is already anticipated by [the implementation comment](/Users/rubencostamartinez/Desktop/tiempo/src/shared/temporal.ts:7), the native-first revert in commit `4a983e7`, and [the installation documentation](/Users/rubencostamartinez/Desktop/tiempo/www/content/docs/installation.mdx:17), which uses polyfill types and defers native-first behavior. The original P1 classification was too strong: these probes exercise interoperability beyond the documented polyfill construction path. They demonstrate that native test results must not be described as proof of native/polyfill interoperability.

Before promising interoperability or restoring native-first selection, compare `epochNanoseconds` directly for absolute comparisons and normalize foreign objects where a static Temporal operation is necessary. Add native-caller and mixed-input tests with the default polyfill selection. Alternatively, explicitly document the current input limitation without changing behavior.

### 3. [P2] endOfDay includes an hour of the following day when midnight is skipped

Source: [src/shared/endOfDay.ts:10](/Users/rubencostamartinez/Desktop/tiempo/src/shared/endOfDay.ts:10).

For `2025-09-07T12:00[America/Santiago]`, the day starts at `01:00`. The helper adds one calendar day while preserving that hour, then subtracts one nanosecond. It returns `2025-09-08T00:59:59.999999999`, whereas the correct result is `2025-09-07T23:59:59.999999999`. `endOfWeek` returns the same incorrect Sunday boundary for this input; other end-of-period functions share this helper.

Derive the next calendar day's actual start before subtracting one nanosecond. The assumption that start-of-day always means midnight conflicts with [Temporal's documented startOfDay behavior](https://tc39.es/proposal-temporal/docs/zoneddatetime.html#zoneddatetimestartofday).

### 4. [P2] Era and timezone tokens return entire formatted dates

Sources: [src/format.ts:373](/Users/rubencostamartinez/Desktop/tiempo/src/format.ts:373), [src/formatPlainDate.ts:229](/Users/rubencostamartinez/Desktop/tiempo/src/formatPlainDate.ts:229).

`formatPart` assumes `toLocaleString` returns only the requested part. Intl adds default date/time fields when only an era or timezone name is requested. With the New York fixture, `format(zoned, 'z')` returns `1/20/2025, 3:00:00 PM EST`, and `format(zoned, 'G')` returns `1/20/2025 AD`. `formatPlainDate(date, 'G')` also returns a full date. A pattern such as `HH:mm z` consequently duplicates date/time content.

Extract the requested part with `Intl.DateTimeFormat.formatToParts`, using an epoch-millisecond number where appropriate to avoid constructing Date objects. Preserve calendar and timezone context. Assert exact token output; the current timezone test only checks that the result contains a timezone-related word.

### 5. [P2] Differences round the endpoints before subtracting

Source: [src/shared/differenceInMilliseconds.ts:7](/Users/rubencostamartinez/Desktop/tiempo/src/shared/differenceInMilliseconds.ts:7).

Between `.000999999Z` and `.001000000Z`, only one nanosecond elapses. The millisecond helper subtracts independently floored epoch values and returns `1` millisecond. `differenceInSeconds(..., { fractional: true })` returns `0.001` instead of `0.000000001`. Hours and minutes use the same helper and also lose submillisecond precision. Starting at `.000999999Z` and advancing `999000001` nanoseconds (0.999000001 seconds) produces a whole-second difference of `1` rather than `0`, so this also violates the explicit truncation contract without using fractional output.

Subtract epoch nanoseconds first. Apply each function's documented unit conversion and truncation afterward; fractional APIs should retain the available precision until conversion to number. Test submillisecond intervals on both sides of a unit boundary, including reversed arguments.

### 6. [P2] Hour intervals drift after a 30-minute DST change

Source: [src/eachHourOfInterval.ts:70](/Users/rubencostamartinez/Desktop/tiempo/src/eachHourOfInterval.ts:70).

The API promises local hour starts and an inclusive end hour. For `2025-10-05T00:15` through `04:15` in `Australia/Lord_Howe`, it returns `00:00, 01:00, 02:30, 03:30` and omits `04:00`. Advancing by one elapsed hour after the transition keeps subsequent values on the half hour.

The [public hour-interval documentation](/Users/rubencostamartinez/Desktop/tiempo/www/content/docs/intervals/each-hour-of-interval.mdx:6) explicitly promises local hour starts and inclusion of the end hour, so this is a contract mismatch rather than an assumption that elapsed hours are always 60 local clock minutes. Enumerate those local boundaries while accounting for repeated and nonexistent times, or explicitly revise the public contract if uniform elapsed-hour spacing is intended. Preserve the existing repeated-hour behavior, and specify the boundary of a partially missing hour before choosing an implementation. Add both forward and backward 30-minute transition cases.

### 7. [P2] Day intervals duplicate a date after an entire date is skipped

Source: [src/eachDayOfInterval.ts:81](/Users/rubencostamartinez/Desktop/tiempo/src/eachDayOfInterval.ts:81).

For 29–31 December 2011 in `Pacific/Apia`, the result is `Dec 29, Dec 31, Dec 31`. Iterating PlainDates reaches the nonexistent Dec 30; compatible conversion shifts it to Dec 31. The next iteration emits Dec 31 again. This can double-count daily buckets or schedule duplicate work.

Advance through valid zoned calendar days, or check that a projected date exists and avoid duplicate timeline boundaries. Test strictly increasing, unique results across skipped dates as well as ordinary DST.

### 8. [P2] Reversed intervals return values when their endpoints share a bucket

Sources: [src/eachDayOfInterval.ts:75](/Users/rubencostamartinez/Desktop/tiempo/src/eachDayOfInterval.ts:75), [src/eachMonthOfInterval.ts:69](/Users/rubencostamartinez/Desktop/tiempo/src/eachMonthOfInterval.ts:69), [src/eachQuarterOfInterval.ts:91](/Users/rubencostamartinez/Desktop/tiempo/src/eachQuarterOfInterval.ts:91).

Interval functions discard lower fields before checking ordering. A start at 16:00 and end at 15:00 on the same date returns that day's start rather than the empty array expected by the existing reversed-interval tests. Month, week, year, and quarter variants likewise return their shared bucket. Hour and minute variants have the same issue for endpoints reversed within one hour/minute. A reversed PlainDate quarter interval also returns a quarter start.

Check the original endpoint order before rounding to buckets, using the appropriate timeline or calendar comparison. Keep the current empty-array contract and test reversed endpoints within the same bucket.

### 9. [P2] Historical timezone offsets produce invalid ISO offset strings

Source: [src/format.ts:393](/Users/rubencostamartinez/Desktop/tiempo/src/format.ts:393).

Paris on 1 January 1900 has offset `+00:09:21`. Formatting `XXXXX` returns `+00:9.35`. Dividing offset nanoseconds into minutes and taking a remainder creates fractional minute text rather than integer minutes and seconds. The other X/x widths share this arithmetic.

Decompose offset nanoseconds into integer hours, minutes, and seconds. Emit seconds for token widths that support them and apply the documented width-specific behavior for shorter tokens. Test historical offsets in addition to current quarter-hour and half-hour offsets.

### 10. [P2] The pinned pnpm release blocks the development and release commands

Sources: [package.json:4](/Users/rubencostamartinez/Desktop/tiempo/package.json:4), [.github/workflows/ci.yml:25](/Users/rubencostamartinez/Desktop/tiempo/.github/workflows/ci.yml:25).

The package and CI both pin `11.12.0`. The installed pnpm launcher rejects this version, explaining that its standalone executable was shipped without a working binary. Even `pnpm --version` fails in this checkout, so normal test/build/release commands cannot start here. Independently, the [npm registry metadata for pnpm 11.12.0](https://registry.npmjs.org/pnpm/11.12.0) marks the release deprecated: “This release is broken. Please upgrade to v11.13.1 or newer.” Its `engines.node` is `>=22.13`, while CI includes Node 20. This confirms an unsuitable pin, but does not mean every possible installation of its JavaScript distribution necessarily fails in the same way. The remote CI workflow was not executed in this review.

Choose a working pnpm release compatible with the development Node matrix and update both pins together. Check the replacement's Node requirements as well as its deprecation status. Verify a clean install, the build, and CI across the supported Node matrix. No pnpm installation or upgrade was performed during the review.

### 11. [P2] Interactive releases stop at Vitest watch mode

Sources: [scripts/release.sh:55](/Users/rubencostamartinez/Desktop/tiempo/scripts/release.sh:55), [package.json:40](/Users/rubencostamartinez/Desktop/tiempo/package.json:40).

The release script calls `pnpm test`, whose script is bare `vitest`. Running the underlying command in an interactive terminal enters `DEV` mode, passes the suite, and remains at `PASS Waiting for file changes...` until manually quit. Once the pnpm pin is repaired, an ordinary local release will still stop here instead of continuing automatically.

Make the release validation explicitly run once, for example `pnpm exec vitest run`. CI's noninteractive behavior does not cover this local release path. No version bump, push, or publish was run to verify this finding; the test subprocess alone was reproduced and quit.

## Original verification and limits

| Check | Result |
|---|---|
| Existing suite: `./node_modules/.bin/vitest run --reporter=dot` | 196 test-file runs, 3,174 tests pass across polyfill and native projects |
| `./node_modules/.bin/tsc --noEmit` | Pass |
| Full build stages in a temporary checkout of the reviewed commit | Timezone, matrix and docs generators; tsup; declaration emit and rewriting all pass |
| Built-package consumer check in that checkout | Type checking with NodeNext and runtime smoke both pass |
| Original review probes against source | 14 assertions fail: 11 demonstrate defects, 3 exercise the known native interoperability limitation |
| Original probes against freshly built output | The same 14 assertions fail |
| Standard pnpm command | Blocked by the pinned broken release |
| Bare Vitest in an interactive terminal | Passes tests, then waits in watch mode |

Run [the reproduction script](./2026-10-08-reproduce.mjs) from the repository root:

```sh
node --import tsx docs/reviews/2026-10-08-reproduce.mjs
# Optional: verify another freshly built artifact using its absolute path.
node --import tsx docs/reviews/2026-10-08-reproduce.mjs /absolute/path/to/dist/index.js
```

The expanded audit script produced identical results against source and the previously built artifact of the same commit. It runs 18 probes on Node 26: two positive controls pass, 13 assertions demonstrate defects, and three separately labeled compatibility probes reproduce the native input limitation. It explicitly selects the shipped polyfill path so a shell's test-only environment setting cannot silently change the result. The audit also checked reversed endpoints in every interval family, reversed PlainDate quarter endpoints, mixed native/polyfill comparison arguments, and a minified browser bundle containing only a `toInstant` consumer. These additional checks confirmed the corresponding claims. The minified browser consumer failed without a process shim and succeeded with one.

The script intentionally exits with status 1 while defect or compatibility assertions fail. Native probes require a runtime with native Temporal. It uses the already installed esbuild through the build toolchain; no dependencies were added. The browser check evaluates a browser bundle in a Node VM without Node globals; a full browser engine was not run. Remote published Tiempo npm artifacts and hosted website content were not independently audited. The original build and baseline suite results above are retained from the first review; the audit did not repeat those unchanged checks.

## Maintenance direction

Fix browser loading first, then the shared end-of-day, formatting, and precision helpers. Repair the pnpm pin and release watch behavior so ordinary checks can run. Address interval boundaries with concrete transition fixtures and invariants such as sorted unique output. Treat native interoperability as a known limitation to resolve before expanding the supported implementation contract.

Retain direct Temporal primitives and small functions. The existing implicit UTC handling for Instant arithmetic, wall-clock equality across repeated hours, and PlainDate time formatting are documented API choices in `docs/api-semantics.md`; they are not counted as bugs here. Changes to those contracts belong in a separately considered major release. The inconsistent availability of PlainDate overloads is also an API design question rather than a reason to rewrite the implementation during this review.

The internal `new Date(...)` in `format` conflicts with the current repository's Temporal-only guidance. Existing Date conversion inputs are compatibility APIs; any removal needs an explicit compatibility decision. Formatting fixes can use integer timestamps with Intl and avoid adding more Date objects.
