# PlainDate day differences and intervals

Unreleased additive update, 8 October 2026. Advances roadmap item 14 using the two existing names approved by the user. API clarity for people and AI callers is the deciding design principle, recorded in the roadmap.

- `differenceInDays(laterDate, earlierDate, options?)` accepts two PlainDates and returns signed whole calendar days. Equal dates return positive zero; fractional options do not change date-only results. Calendars must match, following Temporal and the existing calendar-difference family.
- `eachDayOfInterval({ start, end })` accepts two PlainDates and returns PlainDate[], including both endpoints. Equal dates yield one value, reversed bounds yield an empty array. The start calendar determines the result calendar. There is no timezone, so dates skipped in particular timezones are still included.
- Both APIs reject mixed PlainDate/timeline inputs in TypeScript and at runtime. No implicit parsing or midnight conversion was added.
- Native/polyfill pairs work in either direction. Canonical strings bridge the underlying PlainDate difference. Enumeration never advances beyond its final date, including Temporal's maximum supported date.
- Existing timeline overloads remain last, retaining TypeScript Parameters/ReturnType behavior. Timeline UTC defaults, DST handling and fractional differences remain unchanged.
- Updated both owning MDX pages, generated type matrix/skill/public Markdown resources, API semantics and roadmap. Examples distinguish two days between endpoints from three dates in an inclusive interval. Installation guidance now explicitly keeps the bundled polyfill default and defers optional native-only packaging.

Verification:

- Before implementation, typecheck rejected the new valid PlainDate calls; runtime regressions had 58 failures and 2 passes across both implementation selections.
- After implementation, all 60 new regression runs pass, covering leap days, equal/reversed dates, native/polyfill combinations, Hebrew leap months, differing-calendar interval context, skipped-zone dates, maximum-date bounds, mixed-domain rejection and old timeline inference/behavior.
- Full suite: 3,950 passing test runs across 214 project/file runs on Node 26.
- Node 22: 9 applicable cases pass, with 21 native-dependent cases visibly skipped.
- Typecheck, library build, built-package consumer, installed-tarball ESM/NodeNext/Bundler/browser checks, website typecheck/build, and `git diff --check` pass.

No version bump, publication or deployment. Bundled polyfill and supported-runtime policy remain in place. No real-browser rerun was needed for this additive date-only change; the installed-package browser-bundle check passed. Weeks/months/years PlainDate differences and intervals remain future scope.
