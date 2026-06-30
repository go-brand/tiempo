import { describe, expect, it } from "vitest";
import { Temporal } from "./shared/temporal";
import { isSameQuarter } from "./isSameQuarter";

describe("isSameQuarter", () => {
  it("returns true for two dates in the same quarter and year", () => {
    const jan = Temporal.ZonedDateTime.from("2025-01-15T08:00:00Z[UTC]");
    const mar = Temporal.ZonedDateTime.from("2025-03-31T23:59:59Z[UTC]");

    expect(isSameQuarter(jan, mar)).toBe(true);
  });

  it("returns false across a quarter boundary", () => {
    const mar = Temporal.ZonedDateTime.from("2025-03-31T23:59:59Z[UTC]");
    const apr = Temporal.ZonedDateTime.from("2025-04-01T00:00:00Z[UTC]");

    expect(isSameQuarter(mar, apr)).toBe(false);
  });

  it("returns false for the same quarter number in different years", () => {
    const q1of2024 = Temporal.ZonedDateTime.from("2024-02-15T00:00:00Z[UTC]");
    const q1of2025 = Temporal.ZonedDateTime.from("2025-02-15T00:00:00Z[UTC]");

    expect(isSameQuarter(q1of2024, q1of2025)).toBe(false);
  });

  it("works with Instant inputs (compared in UTC)", () => {
    const a = Temporal.Instant.from("2025-07-01T00:00:00Z");
    const b = Temporal.Instant.from("2025-09-30T23:59:59Z");

    expect(isSameQuarter(a, b)).toBe(true);
  });

  it("compares each zoned datetime in its own timezone", () => {
    // Same instant, but Q1 in NY and Q2 in Tokyo around the Mar/Apr boundary
    const ny = Temporal.ZonedDateTime.from("2025-03-31T23:00:00-04:00[America/New_York]");
    const tokyo = ny.withTimeZone("Asia/Tokyo"); // 2025-04-01 12:00 in Tokyo

    expect(isSameQuarter(ny, tokyo)).toBe(false);
  });
});
