# Remaining PlainDate calendar differences and intervals

Continue the user-authorized PlainDate work with week/month/year differences and interval enumeration. Reuse existing names and signatures, retaining the default polyfill and existing timeline behavior.

- Difference functions accept two PlainDates with matching calendars; native Temporal primitives calculate the total in the requested unit relative to the earlier argument. Default truncation and optional fractional results match the existing difference family. No automatic date/timestamp mixing.
- Interval functions accept two PlainDates and return PlainDate[]. Check original endpoint order before snapping; reversed intervals return []. Include the start of each touched week/month/year. Weeks begin Monday, matching existing behavior. Start-calendar context applies to the end bound. Stop at the last included boundary without stepping beyond Temporal's maximum date.
- Add PlainDate overloads first and preserve the timeline overload last for Parameters/ReturnType compatibility. Runtime domain errors accompany static rejection.
- Extend the same mixed-domain rejection to the existing quarter interval path, which otherwise surfaces incidental Temporal errors when it treats unrelated endpoints as timeline objects. Keep the quarter overload ordering unchanged.
- Add a short API conventions guide: differences use subtraction order; interval functions accept { start, end }; date-only and timeline domains require explicit conversion. Guide examples must execute in tests.
- Update owning MDX pages and generated docs/type matrix, add packed-consumer coverage, run typecheck/full tests/Node 22 checks/library+website builds, and record results. No publication, version bump or breaking runtime change.

Alternatives considered: extra date-only function names increase learning overhead; normalizing PlainDate to a midnight timestamp introduces timezone semantics. Existing names with homogeneous typed overloads are the consistent choice. No unresolved design decisions or placeholders remain.
