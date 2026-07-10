import { describe, expect, it } from "vitest";
import { Temporal } from "./shared/temporal";
import { endOfQuarter } from "./endOfQuarter";

describe("endOfQuarter", () => {
  describe("from Temporal.Instant", () => {
    it.each([
      ["2025-01-15T12:00:00Z", 3, 31],
      ["2025-05-15T12:00:00Z", 6, 30],
      ["2025-08-15T12:00:00Z", 9, 30],
      ["2025-11-15T12:00:00Z", 12, 31],
    ])("maps %s to %i/%i at last moment", (iso, expectedMonth, expectedDay) => {
      const result = endOfQuarter(Temporal.Instant.from(iso));

      expect(result).toBeInstanceOf(Temporal.ZonedDateTime);
      expect(result.month).toBe(expectedMonth);
      expect(result.day).toBe(expectedDay);
      expect(result.hour).toBe(23);
      expect(result.minute).toBe(59);
      expect(result.second).toBe(59);
      expect(result.millisecond).toBe(999);
      expect(result.microsecond).toBe(999);
      expect(result.nanosecond).toBe(999);
      expect(result.timeZoneId).toBe("UTC");
    });

    it("handles leap-year Q1 ending on March 31 (not affected by Feb 29)", () => {
      const result = endOfQuarter(Temporal.Instant.from("2024-02-29T12:00:00Z"));
      expect(result.month).toBe(3);
      expect(result.day).toBe(31);
    });
  });

  describe("from Temporal.ZonedDateTime", () => {
    it("preserves the timezone", () => {
      const zoned = Temporal.ZonedDateTime.from("2025-02-15T15:30:00-05:00[America/New_York]");
      const result = endOfQuarter(zoned);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(3);
      expect(result.day).toBe(31);
      expect(result.hour).toBe(23);
      expect(result.timeZoneId).toBe("America/New_York");
    });
  });

  describe("from Temporal.PlainDate", () => {
    it("requires a timezone and returns end of quarter", () => {
      const date = Temporal.PlainDate.from("2025-11-15");
      const result = endOfQuarter(date, "America/New_York");

      expect(result.month).toBe(12);
      expect(result.day).toBe(31);
      expect(result.hour).toBe(23);
      expect(result.timeZoneId).toBe("America/New_York");
    });
  });

  describe("from Temporal.PlainDate (returns PlainDate, no timezone)", () => {
    it("returns the last day of the quarter as a PlainDate", () => {
      const result = endOfQuarter(Temporal.PlainDate.from("2025-05-15"));

      expect(result).toBeInstanceOf(Temporal.PlainDate);
      expect(result.year).toBe(2025);
      expect(result.month).toBe(6);
      expect(result.day).toBe(30);
    });

    it.each([
      ["2025-01-15", 3, 31],
      ["2025-05-15", 6, 30],
      ["2025-08-15", 9, 30],
      ["2025-11-15", 12, 31],
    ])("maps %s to %i/%i", (iso, month, day) => {
      const result = endOfQuarter(Temporal.PlainDate.from(iso));
      expect(result.month).toBe(month);
      expect(result.day).toBe(day);
    });

    it("still returns a ZonedDateTime when a timezone is given (bridge)", () => {
      const result = endOfQuarter(Temporal.PlainDate.from("2025-11-15"), "America/New_York");

      expect(result).toBeInstanceOf(Temporal.ZonedDateTime);
      expect(result.month).toBe(12);
      expect(result.day).toBe(31);
      expect(result.hour).toBe(23);
      expect(result.timeZoneId).toBe("America/New_York");
    });
  });
});
