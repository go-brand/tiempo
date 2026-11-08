# Calendar differences across Temporal implementations

Unreleased fix, 8 October 2026. Advances roadmap item 23; records eventual polyfill removal under item 24.

## Behavior

`differenceInDays`, `differenceInWeeks`, `differenceInMonths`, `differenceInQuarters`, and `differenceInYears` now accept mixed native/polyfill inputs. The calendar-difference methods consume the other value's canonical Temporal string, retaining timezone, calendar annotations, and nanoseconds. PlainDate quarters use the same bridge, including non-ISO calendars. Existing signatures, UTC defaults, fractional options, truncation, and matching-calendar requirements remain intact.

The bridge intentionally serializes one argument even for same-implementation pairs. This keeps the fix direct and avoids implementation detection or constructor assumptions. Serialization/parsing adds work; no performance improvement is claimed. Measure this cost before adding a fast path.

## Evidence

- Added a four-combination matrix: polyfill/polyfill, native/native, polyfill/native, native/polyfill, under both library implementation selections.
- Before the fix: 192 failing and 200 passing test runs. Failures reproduce timezone lookup errors and non-ISO calendar errors when consuming foreign objects.
- After the fix: all 392 regression runs pass. Coverage includes forward/reverse differences, fractional/whole results, DST in New York and Lord Howe, month ends, leap years, different timezones, Hebrew leap months, nanosecond boundaries, Instant inputs, mixed timeline types, equality, immutable inputs and incompatible-calendar rejection.
- Full suite: 3,770 passing runs across 210 project/file runs on Node 26.
- Node 22: 49 applicable regression cases pass; 147 native-dependent cases visibly skip.
- Typecheck, library build, built-package smoke, installed-tarball ESM/NodeNext/Bundler/browser checks, website typecheck/build, and `git diff --check` pass.
- The installed-package consumer exercises native callers against the bundled polyfill for all five functions and PlainDate quarters when native Temporal is available.
- Website API pages, generated reference resources, API semantics and roadmap updated.

## Remaining work

Production still includes the polyfill. Finish auditing conversion and other object-consuming boundaries, define output identity guarantees, establish the native runtime support policy, and measure a native-only package before removing the dependency. Older environments will need an explicit application-supplied polyfill migration. Runtime selection alone does not remove a statically imported dependency from a bundle.

No version bump, publication, or deployment performed. Native behavior was verified locally in Node 26; this batch did not add a real-browser native test or run remote CI. Existing Node loader deprecation and website chunk-size warnings remain nonblocking.
