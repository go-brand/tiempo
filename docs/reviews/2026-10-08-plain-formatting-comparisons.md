# PlainDate formatting and plain comparisons

Unreleased additive update, 8 October 2026. Completes roadmap item 16 and the additive formatting overload in item 19.

- `format(PlainDate, pattern, options)` delegates to `formatPlainDate`, preserving its date tokens, locale handling and literal treatment of unsupported time/zone tokens. PlainDate timezone overrides are rejected at compile time and runtime. Existing Instant/ZonedDateTime defaults remain intact.
- `isBefore` and `isAfter` accept two PlainDates or two PlainTimes, in addition to existing timeline pairs. Cross-domain plain/timeline comparisons are rejected at compile time and runtime. Time ordering does not infer a date or wrap midnight.
- Specialized helpers remain supported. The three PlainDate ordering/equality helpers compare same-implementation values directly and convert foreign values to canonical Temporal strings, preserving calendar annotations across native/polyfill implementations.
- Public overload ordering retains the existing timeline signatures for TypeScript utility-type extraction. Installed-package smoke checks exercise accepted and rejected calls against packaged declarations.
- Website API pages, specialized-helper references, generated skill/Markdown resources, llms.txt, the type matrix and API semantics are updated. A previously incorrect same-instant comparison example is corrected.

Verification: typecheck passes; all 3,378 test runs pass across 208 native/polyfill project-file runs on Node 26. The new 16-case suite passes under both selections; Node 22 passes its 13 applicable cases and visibly skips 3 native-only cases. Library build and installed-tarball ESM, NodeNext/Bundler declaration, and browser-bundle checks pass. Website typecheck and production build pass.

No version bump, npm publication or website deployment was performed. Calendar-difference interoperability, other PlainDate families, and stricter formatting policy remain separate work.
