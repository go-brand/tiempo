import { describe, expect, it } from "vitest";
import { Temporal } from "./shared/temporal";
import { eachQuarterOfInterval } from "./eachQuarterOfInterval";

describe("eachQuarterOfInterval", () => {
  it("returns the start of each quarter within a year", () => {
    const start = Temporal.ZonedDateTime.from("2025-02-15T10:00:00Z[UTC]");
    const end = Temporal.ZonedDateTime.from("2025-11-20T14:00:00Z[UTC]");

    const result = eachQuarterOfInterval({ start, end });

    expect(result).toHaveLength(4);
    expect(result.map((d) => d.month)).toEqual([1, 4, 7, 10]);
    result.forEach((d) => {
      expect(d.day).toBe(1);
      expect(d.hour).toBe(0);
      expect(d.timeZoneId).toBe("UTC");
    });
  });

  it("is inclusive of both the start and end quarters", () => {
    const start = Temporal.ZonedDateTime.from("2025-04-01T00:00:00Z[UTC]");
    const end = Temporal.ZonedDateTime.from("2025-04-01T00:00:00Z[UTC]");

    const result = eachQuarterOfInterval({ start, end });

    expect(result).toHaveLength(1);
    expect(result[0]!.month).toBe(4);
  });

  it("crosses year boundaries", () => {
    const start = Temporal.ZonedDateTime.from("2024-11-15T00:00:00Z[UTC]");
    const end = Temporal.ZonedDateTime.from("2025-05-15T00:00:00Z[UTC]");

    const result = eachQuarterOfInterval({ start, end });

    expect(result.map((d) => `${d.year}-${String(d.month).padStart(2, "0")}`)).toEqual([
      "2024-10",
      "2025-01",
      "2025-04",
    ]);
  });

  it("preserves the start timezone", () => {
    const start = Temporal.ZonedDateTime.from("2025-02-15T10:00:00-05:00[America/New_York]");
    const end = Temporal.ZonedDateTime.from("2025-08-15T10:00:00-04:00[America/New_York]");

    const result = eachQuarterOfInterval({ start, end });

    expect(result.map((d) => d.month)).toEqual([1, 4, 7]);
    result.forEach((d) => {
      expect(d.timeZoneId).toBe("America/New_York");
      expect(d.hour).toBe(0);
    });
  });

  it("works with Instant inputs in UTC", () => {
    const start = Temporal.Instant.from("2025-01-10T00:00:00Z");
    const end = Temporal.Instant.from("2025-07-10T00:00:00Z");

    const result = eachQuarterOfInterval({ start, end });

    expect(result.map((d) => d.month)).toEqual([1, 4, 7]);
    expect(result[0]!.timeZoneId).toBe("UTC");
  });

  it("returns an empty array when end is before start", () => {
    const start = Temporal.ZonedDateTime.from("2025-07-15T00:00:00Z[UTC]");
    const end = Temporal.ZonedDateTime.from("2025-02-15T00:00:00Z[UTC]");

    expect(eachQuarterOfInterval({ start, end })).toEqual([]);
  });

  it("returns a single entry when start and end share a quarter", () => {
    const start = Temporal.ZonedDateTime.from("2025-04-05T08:00:00Z[UTC]");
    const end = Temporal.ZonedDateTime.from("2025-06-28T20:00:00Z[UTC]");

    const result = eachQuarterOfInterval({ start, end });

    expect(result).toHaveLength(1);
    expect(result[0]!.month).toBe(4);
    expect(result[0]!.day).toBe(1);
  });

  it("counts quarters correctly across a multi-year span", () => {
    const start = Temporal.Instant.from("2023-01-01T00:00:00Z");
    const end = Temporal.Instant.from("2025-12-31T23:59:59Z");

    const result = eachQuarterOfInterval({ start, end });

    // 3 full years × 4 quarters, inclusive of both ends
    expect(result).toHaveLength(12);
    expect(result[0]!.year).toBe(2023);
    expect(result[0]!.month).toBe(1);
    expect(result[11]!.year).toBe(2025);
    expect(result[11]!.month).toBe(10);
  });

  it("accepts mixed Instant and ZonedDateTime inputs", () => {
    const start = Temporal.Instant.from("2025-01-10T00:00:00Z");
    const end = Temporal.ZonedDateTime.from("2025-07-10T00:00:00Z[UTC]");

    const result = eachQuarterOfInterval({ start, end });

    expect(result.map((d) => d.month)).toEqual([1, 4, 7]);
  });
});
