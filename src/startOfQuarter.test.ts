import { describe, expect, it } from "vitest";
import { Temporal } from "./shared/temporal";
import { startOfQuarter } from "./startOfQuarter";

describe("startOfQuarter", () => {
  describe("from Temporal.Instant", () => {
    it.each([
      ["2025-01-15T12:00:00Z", 1],
      ["2025-02-15T12:00:00Z", 1],
      ["2025-03-31T23:59:59Z", 1],
      ["2025-04-01T00:00:00Z", 4],
      ["2025-06-15T12:00:00Z", 4],
      ["2025-07-15T12:00:00Z", 7],
      ["2025-09-30T12:00:00Z", 7],
      ["2025-10-01T00:00:00Z", 10],
      ["2025-12-31T23:59:59Z", 10],
    ])("maps %s to the 1st of month %i", (iso, expectedMonth) => {
      const result = startOfQuarter(Temporal.Instant.from(iso));

      expect(result).toBeInstanceOf(Temporal.ZonedDateTime);
      expect(result.month).toBe(expectedMonth);
      expect(result.day).toBe(1);
      expect(result.hour).toBe(0);
      expect(result.minute).toBe(0);
      expect(result.second).toBe(0);
      expect(result.nanosecond).toBe(0);
      expect(result.timeZoneId).toBe("UTC");
    });
  });

  describe("from Temporal.ZonedDateTime", () => {
    it("preserves the timezone", () => {
      const zoned = Temporal.ZonedDateTime.from("2025-08-15T15:30:00-04:00[America/New_York]");
      const result = startOfQuarter(zoned);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(7);
      expect(result.day).toBe(1);
      expect(result.hour).toBe(0);
      expect(result.timeZoneId).toBe("America/New_York");
    });
  });

  describe("from Temporal.PlainDate", () => {
    it("requires a timezone and returns start of quarter at midnight", () => {
      const date = Temporal.PlainDate.from("2025-11-15");
      const result = startOfQuarter(date, "America/New_York");

      expect(result.year).toBe(2025);
      expect(result.month).toBe(10);
      expect(result.day).toBe(1);
      expect(result.hour).toBe(0);
      expect(result.timeZoneId).toBe("America/New_York");
    });
  });

  it("maps a leap day (Feb 29) to the start of Q1 (Jan 1)", () => {
    const result = startOfQuarter(Temporal.Instant.from("2024-02-29T12:00:00Z"));

    expect(result.year).toBe(2024);
    expect(result.month).toBe(1);
    expect(result.day).toBe(1);
    expect(result.hour).toBe(0);
  });

  it("is idempotent — already at a quarter start stays put", () => {
    const start = startOfQuarter(Temporal.Instant.from("2025-08-15T12:00:00Z"));
    const again = startOfQuarter(start);

    expect(again.equals(start)).toBe(true);
  });

  describe("from Temporal.PlainDate (returns PlainDate, no timezone)", () => {
    it("returns the first day of the quarter as a PlainDate", () => {
      const result = startOfQuarter(Temporal.PlainDate.from("2025-05-15"));

      expect(result).toBeInstanceOf(Temporal.PlainDate);
      expect(result.year).toBe(2025);
      expect(result.month).toBe(4);
      expect(result.day).toBe(1);
    });

    it.each([
      ["2025-02-28", 1],
      ["2025-06-30", 4],
      ["2025-09-01", 7],
      ["2025-12-31", 10],
    ])("maps %s to quarter-start month %i", (iso, month) => {
      expect(startOfQuarter(Temporal.PlainDate.from(iso)).month).toBe(month);
    });

    it("still returns a ZonedDateTime when a timezone is given (bridge)", () => {
      const result = startOfQuarter(Temporal.PlainDate.from("2025-11-15"), "America/New_York");

      expect(result).toBeInstanceOf(Temporal.ZonedDateTime);
      expect(result.month).toBe(10);
      expect(result.day).toBe(1);
      expect(result.hour).toBe(0);
      expect(result.timeZoneId).toBe("America/New_York");
    });
  });
});
