# PlainDate calendar families and API conventions

Unreleased additive update, 8 October 2026. Continues the user-authorized PlainDate work and explains the calling convention questioned in the preceding discussion.

## Implemented

- Added PlainDate pair overloads to `differenceInWeeks`, `differenceInMonths`, and `differenceInYears`. Together with existing days/quarters support, all current calendar difference names accept date-only pairs. Matching calendars, truncation toward zero and fractional options follow the existing family. Canonical strings bridge native/polyfill input objects.
- Added PlainDate interval overloads to `eachWeekOfInterval`, `eachMonthOfInterval`, and `eachYearOfInterval`. All current calendar interval names now accept PlainDate bounds. Original reversed bounds return []; results are starts of touched periods in the start calendar. Weeks begin Monday. Iteration stops at the last boundary without advancing beyond the maximum supported date.
- Mixed PlainDate/timeline values are rejected at compile time and runtime. Quarter intervals now report the same explicit domain error instead of an incidental Temporal error; their public overload order is unchanged.
- New overloads precede existing timeline overloads, retaining Parameters/ReturnType inference. Existing timeline algorithms, UTC defaults and bundled polyfill behavior remain unchanged.
- Added `www/content/docs/api-conventions.mdx` to Getting Started, llms.txt, public Markdown and discovery resources. It teaches positional subtraction versus a named interval object, date-only versus timeline domains, inclusive intervals and period boundaries. Both guide examples execute in tests.
- Updated the six API pages, quarter interval domain guidance, generated API references/type matrix, roadmap and semantics. The introduction links to the guide and uses a deterministic, correct formatting example.

## Verification

- New valid PlainDate calls failed typecheck before implementation. The initial runtime matrix had 154 failures and 2 passes under both implementation selections.
- Quarter error clarity was independently checked against the previous implementation: the explicit-domain-error expectation fails before the guard and passes afterward. The old implementation already threw a TypeError; this change improves its explanation.
- The new 79-case calendar suite passes under both implementations (158 runs). Covers native/polyfill combinations, fractional/negative counts, equal/reversed bounds, non-ISO calendars, month-end/leap-year constraining, Hebrew leap months/year boundaries, maximum-date bounds, runtime domain errors and unchanged timeline inference.
- Node 22 runs 22 applicable cases successfully and visibly skips 57 native-dependent cases.
- Full suite: 4,112 passing runs across 216 project/file runs on Node 26.
- Typecheck, library build, built-package smoke and generated documentation checks pass. Both guide examples pass in browser-bundled execution contexts.

Installed-tarball ESM, NodeNext/Bundler declarations and minified browser consumer checks pass. Website typecheck and production build pass, and `git diff --check` passes. Existing Node loader deprecation and website chunk-size advisories remain nonblocking. No real-browser rerun or remote CI execution was performed in this batch. No version bump, publication or deployment was performed.

## Still open

This does not mark the library or roadmap complete. Same-period PlainDate comparison overloads, the non-ISO quarter return-type contract, advertised minimum-runtime/TypeScript qualification, browser CI, wider documentation/evaluation work and release/deployment remain open. Bundled polyfill removal is deferred per the user's preference. The API conventions are deliberate date-fns-style calling shapes, not a claim of identical behavior in every edge case or proven AI recommendation ranking.
