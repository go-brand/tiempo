# PlainDate arithmetic — implementation report

Unreleased additive update, 8 October 2026. This completes the arithmetic portion of roadmap item 14; other date-only families remain open.

`addDays`, `subDays`, `addWeeks`, `subWeeks`, `addMonths`, `subMonths`, `addYears`, and `subYears` now explicitly accept PlainDate and return PlainDate. They preserve the input calendar and delegate calendar arithmetic to Temporal. Existing quarter helpers provide the same date-only behavior. Instant inputs still return UTC ZonedDateTime; zoned inputs retain their timezone.

The missing capability was primarily in the declared API: the old runtime already handled these date objects, but TypeScript rejected them. Typechecking new consumer cases failed before the overloads were added and passes afterward. Explicit date dispatch now agrees with the public types. Overload ordering preserves existing `Parameters`/`ReturnType` results for the eight expanded functions.

Tests cover return inference, signed and zero counts, input immutability, month-end/leap-day constraining, Hebrew calendar months, rejection of fractional counts and unsupported input domains, and native/polyfill date callers. Public docs, generated agent references, the type matrix and installed-package smoke tests are updated.

Verification: 3,346 test runs pass across 206 native/polyfill project-file runs on Node 26. The new arithmetic suite has 44 cases; on Node 22, 43 pass and the native-only case visibly skips. Root typecheck, library build and installed-tarball checks pass, including ESM execution and NodeNext/Bundler declarations.

No release or version bump was performed. Formatting/comparison overloads and broader calendar-difference interoperability are subsequent work.
