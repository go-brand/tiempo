import { describe, expect, it } from "vitest";
import { Temporal } from "./shared/temporal";
import { getQuarter } from "./getQuarter";

describe("getQuarter", () => {
  describe("from Temporal.Instant", () => {
    it.each([
      ["2025-01-01T00:00:00Z", 1],
      ["2025-03-31T23:59:59Z", 1],
      ["2025-04-01T00:00:00Z", 2],
      ["2025-06-30T23:59:59Z", 2],
      ["2025-07-01T00:00:00Z", 3],
      ["2025-09-30T23:59:59Z", 3],
      ["2025-10-01T00:00:00Z", 4],
      ["2025-12-31T23:59:59Z", 4],
    ])("returns quarter %i for %s", (iso, expected) => {
      expect(getQuarter(Temporal.Instant.from(iso))).toBe(expected);
    });
  });

  describe("from Temporal.ZonedDateTime", () => {
    it("uses the local calendar month of the timezone", () => {
      const zoned = Temporal.ZonedDateTime.from("2025-11-15T15:30:00-05:00[America/New_York]");
      expect(getQuarter(zoned)).toBe(4);
    });

    it("can differ from UTC across a quarter boundary", () => {
      // 2025-03-31T23:00:00-04:00 is 2025-04-01T03:00 in UTC
      const zoned = Temporal.ZonedDateTime.from("2025-03-31T23:00:00-04:00[America/New_York]");
      expect(getQuarter(zoned)).toBe(1); // March in NY → Q1
      expect(getQuarter(zoned.withTimeZone("UTC"))).toBe(2); // April in UTC → Q2
    });
  });

  describe("from Temporal.PlainDate", () => {
    it("requires a timezone and returns the quarter", () => {
      const date = Temporal.PlainDate.from("2025-02-15");
      expect(getQuarter(date, "America/New_York")).toBe(1);
    });
  });
});
