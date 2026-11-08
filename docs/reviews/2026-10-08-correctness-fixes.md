# Confirmed correctness fixes — implementation report

8 October 2026 · working tree based on `6219c0a` · package version remains 3.0.1

This batch implements roadmap **01–10, 27 and 33**, with partial progress on **23/25/32/34/36**. It does not implement the whole roadmap or adopt breaking API proposals. The original review and decision audit remain historical evidence.

## Changes

- Browser imports guard the Node-only test selector; default runtime selection remains polyfill-backed.
- Day ends resolve the next actual day start before subtracting a nanosecond, fixing skipped-midnight overflow through the shared day/week/month/quarter/year helper.
- Millisecond differences subtract nanoseconds before integer division. Whole seconds/minutes/hours use bigint division before conversion; fractional results retain submillisecond information until numeric conversion. Number precision limits are documented.
- Era and timezone-name tokens extract individual Intl parts, preserving zone and calendar context. Formatting no longer constructs a Date for day-period extraction. Offset widths follow the existing Unicode-style token meanings: short widths omit seconds, long widths retain them, and actual zero offsets produce `Z` for uppercase tokens.
- All seven interval families reject reversed original endpoints before rounding, including PlainDate quarters. Daily iteration skips nonexistent dates without duplicates.
- Hourly enumeration follows local boundaries and offset transitions. Missing whole hours are skipped; partial/repeated hours begin at the transition; subsequent entries realign to local `:00`. Steps are therefore not always 60 elapsed minutes. This behavior is documented and tested for Lord Howe and existing full-hour DST cases.
- Absolute before/after comparisons and minute/week interval loops compare epoch nanoseconds. Mixed native/polyfill tests cover ordering, current-time predicates, interval inclusion, and minute/hour/week enumeration under both library runtime selections.
- pnpm is pinned to 10.33.4, which is nondeprecated and accepts the existing Node 20/22/26 development matrix. CI reads the package pin instead of duplicating it. Release and CI validation explicitly use `--run`; interactive developer `pnpm test` remains available.
- `pnpm smoke:tarball` packs and installs the actual package in a temporary consumer, checks ESM execution and NodeNext/Bundler declarations, and runs a minified browser bundle without Node globals. CI runs it after building. esbuild is an explicit development dependency; no runtime dependency was added.
- The capability matrix includes numeric timestamp inputs, excludes format-pattern strings from datetime inputs, and lists each public callable overload with optionality, timezone arguments, and return type.
- README and agent-guide DST examples are corrected. Timezone type documentation explains autocomplete versus validation, including the open string fallback. UTC storage guidance distinguishes exact timestamps, calendar dates, and future local scheduling intent. Generated copies are updated from their owners. README's absolute timezone-bug claim is replaced with a concrete description.

## Verification

- Regression-first runs reproduced browser, boundary, precision, formatting, interval, matrix and interop failures before the corresponding fixes. Existing successful cases remain in the suite.
- Node 26.5.0: **3,258 tests pass across 204 project/file runs**, covering native and polyfill selections. This is 1,629 test cases run under each selection, not 3,258 unique cases.
- Node 22.22.0: **1,623 tests pass; 6 native interop cases visibly skip** because that runtime does not expose native Temporal. Node 20 remains covered by the configured CI matrix; it was not run locally in this batch.
- All **18 original review probes pass** against source and a built package, including the three originally failing compatibility probes.
- Root typecheck, full build and existing built-package smoke pass. Frozen lockfile installation passes with the repaired pnpm pin.
- Installed-tarball ESM, TypeScript NodeNext/Bundler and minified browser checks pass.
- Real Chrome **154.0.8037.98** loads the built/minified library with `typeof process === 'undefined'`, converts an epoch, enumerates the Lord Howe transition correctly, and compares a native Temporal value with a library value.
- Interactive terminal validation exits **0** for a passing test and **1** for an intentionally failing temporary test, without watch mode. The temporary failing test was removed; the release script's version bump/push was not executed.
- Corrected README and guide examples are executed in permanent tests, with their output comments checked against actual results.
- Website typecheck and production build pass. The build reports a large-chunk advisory; Node 26 also reports the existing tsx/module.register deprecation warning. Neither prevents completion.

## Remaining scope

This does not establish complete native/polyfill interoperability. Calendar-difference methods and non-ISO PlainDate interoperability still need their own audit and tests; the default runtime remains unchanged. Package source-map navigation, minimum supported TypeScript policy, comprehensive runtime coverage, and a permanent real-browser CI job remain open.

PlainDate overload additions, a short learning primer and cold-learner evaluation, broader documentation alignment, and future helper families remain separate roadmap work. No AI learnability score or recommendation-rank claim is made. No version bump, publication, deployment, or remote CI success is claimed.

## Source decisions

The pnpm selection was checked against npm registry metadata for [10.33.4](https://registry.npmjs.org/pnpm/10.33.4) and pnpm's [installation compatibility documentation](https://github.com/pnpm/pnpm.io/blob/main/versioned_docs/version-10.x/installation.md). Offset token widths follow [Unicode date field definitions](https://unicode.org/reports/tr35/tr35-dates.html). These references support those specific implementation choices, not a general claim of standards completeness.
