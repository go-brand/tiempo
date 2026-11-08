# Confirmed correctness fixes implementation plan

**Goal:** Implement the compatible fixes in roadmap items 01–10 and correct misleading documentation, keeping breaking API proposals deferred.

**Architecture:** Keep Temporal primitives, existing signatures, and documented UTC defaults. Fix shared arithmetic/boundary helpers and the owning interval/formatting functions, with regressions beside those functions. Validate a bundled browser consumer and the built package.

**Constraints:** No publishing or version bump in this task. Preserve existing workspace changes. Native-first runtime selection and new helper families remain deferred.

- [x] Browser loading: reproduce the missing-process failure in a bundled consumer; guard the test selector; rerun with no process and a shim.
- [x] Tooling: select an available nondeprecated pnpm compatible with Node 20/22/26 and the existing lockfile, use the package pin in CI, and make CI/release tests explicitly run once. Verify frozen installation and validation exit behavior without running release publication.
- [x] Boundaries: add skipped-midnight regressions for day/week ends; resolve the next actual day start in `src/shared/endOfDay.ts`; run boundary tests.
- [x] Precision: add signed nanosecond-crossing cases beside difference functions; subtract before converting/truncating; run difference tests.
- [x] Formatting: add exact era/zone part and historical-offset token regressions; use Intl parts with preserved context and integer offset components; run formatting tests.
- [x] Intervals: add reversed same-bucket, skipped-date, and partial-hour transition regressions; check original order, enumerate unique date boundaries and actual local-hour starts; run interval tests. Document the partial-hour contract.
- [x] Documentation: correct executed DST examples and timezone type claims at their sources; repair the capability matrix with callable overloads, regenerate and check outputs.
- [x] Verification: run full tests, typecheck, build, package/browser consumer checks, and original review probes. Record remaining compatibility limitations and update roadmap status without implying deferred work is complete.

Additional compatible work: timeline comparison/interval interoperability now has mixed-implementation tests; `pnpm smoke:tarball` checks installed package imports/types and browser bundling and runs in CI. Broader native interoperability remains open.
