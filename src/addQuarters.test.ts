import { describe, expect, it } from "vitest";
import { Temporal } from "./shared/temporal";
import { addQuarters } from "./addQuarters";

describe("addQuarters", () => {
  describe("from Temporal.Instant", () => {
    it("adds positive quarters (3 months each)", () => {
      const result = addQuarters(Temporal.Instant.from("2025-01-20T12:00:00Z"), 2);

      expect(result).toBeInstanceOf(Temporal.ZonedDateTime);
      expect(result.year).toBe(2025);
      expect(result.month).toBe(7);
      expect(result.day).toBe(20);
      expect(result.hour).toBe(12);
      expect(result.timeZoneId).toBe("UTC");
    });

    it("adds negative quarters (subtracts)", () => {
      const result = addQuarters(Temporal.Instant.from("2025-07-20T12:00:00Z"), -2);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(1);
      expect(result.day).toBe(20);
    });

    it("crosses year boundaries", () => {
      const result = addQuarters(Temporal.Instant.from("2025-11-20T12:00:00Z"), 1);

      expect(result.year).toBe(2026);
      expect(result.month).toBe(2);
      expect(result.day).toBe(20);
    });

    it("adds zero quarters (no change)", () => {
      const result = addQuarters(Temporal.Instant.from("2025-01-20T12:00:00Z"), 0);
      expect(result.month).toBe(1);
      expect(result.day).toBe(20);
    });
  });

  describe("from Temporal.ZonedDateTime", () => {
    it("preserves the timezone across a DST shift", () => {
      const zoned = Temporal.ZonedDateTime.from("2025-01-20T15:30:00-05:00[America/New_York]");
      const result = addQuarters(zoned, 1);

      expect(result.month).toBe(4);
      expect(result.day).toBe(20);
      expect(result.hour).toBe(15);
      expect(result.minute).toBe(30);
      expect(result.timeZoneId).toBe("America/New_York");
      expect(result.offset).toBe("-04:00"); // EDT after spring-forward
    });
  });

  it("handles month-end edge cases via Temporal constrain", () => {
    // Jan 31 + 1 quarter (3 months) → April has 30 days
    const result = addQuarters(Temporal.Instant.from("2025-01-31T12:00:00Z"), 1);
    expect(result.month).toBe(4);
    expect(result.day).toBe(30);
  });

  it("preserves sub-second components down to the nanosecond", () => {
    const zoned = Temporal.ZonedDateTime.from("2025-01-20T12:34:56.123456789Z[UTC]");
    const result = addQuarters(zoned, 1);

    expect(result.month).toBe(4);
    expect(result.millisecond).toBe(123);
    expect(result.microsecond).toBe(456);
    expect(result.nanosecond).toBe(789);
  });

  it("handles large positive and negative magnitudes", () => {
    const instant = Temporal.Instant.from("2025-01-20T12:00:00Z");

    const forward = addQuarters(instant, 12); // +3 years
    expect(forward.year).toBe(2028);
    expect(forward.month).toBe(1);

    const backward = addQuarters(instant, -12); // -3 years
    expect(backward.year).toBe(2022);
    expect(backward.month).toBe(1);
  });

  it("lands on Feb 29 in a leap year via month-end constrain", () => {
    // Nov 30 2023 + 1 quarter → Feb 2024 (leap) has 29 days
    const result = addQuarters(Temporal.Instant.from("2023-11-30T12:00:00Z"), 1);
    expect(result.year).toBe(2024);
    expect(result.month).toBe(2);
    expect(result.day).toBe(29);
  });
});
