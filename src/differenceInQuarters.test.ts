import { describe, expect, it } from "vitest";
import { Temporal } from "./shared/temporal";
import { differenceInQuarters } from "./differenceInQuarters";

describe("differenceInQuarters", () => {
  it("returns whole quarters between two instants", () => {
    const later = Temporal.Instant.from("2025-07-20T12:00:00Z");
    const earlier = Temporal.Instant.from("2025-01-20T12:00:00Z");

    expect(differenceInQuarters(later, earlier)).toBe(2);
  });

  it("is negative when laterDate is before earlierDate", () => {
    const later = Temporal.Instant.from("2025-01-20T12:00:00Z");
    const earlier = Temporal.Instant.from("2025-07-20T12:00:00Z");

    expect(differenceInQuarters(later, earlier)).toBe(-2);
  });

  it("truncates toward zero by default", () => {
    const later = Temporal.Instant.from("2025-03-20T12:00:00Z");
    const earlier = Temporal.Instant.from("2025-01-20T12:00:00Z");

    expect(differenceInQuarters(later, earlier)).toBe(0);
  });

  it("returns a fractional value with { fractional: true }", () => {
    const later = Temporal.Instant.from("2025-03-20T12:00:00Z");
    const earlier = Temporal.Instant.from("2025-01-20T12:00:00Z");

    const result = differenceInQuarters(later, earlier, { fractional: true });
    expect(result).toBeCloseTo(2 / 3, 5);
  });

  it("returns 0 for the same datetime", () => {
    const instant = Temporal.Instant.from("2025-05-05T12:00:00Z");
    expect(differenceInQuarters(instant, instant)).toBe(0);
  });

  it("works across year boundaries", () => {
    const later = Temporal.Instant.from("2026-01-20T12:00:00Z");
    const earlier = Temporal.Instant.from("2025-01-20T12:00:00Z");

    expect(differenceInQuarters(later, earlier)).toBe(4);
  });

  it("truncates a negative partial quarter toward zero (not down)", () => {
    const later = Temporal.Instant.from("2025-01-20T12:00:00Z");
    const earlier = Temporal.Instant.from("2025-03-20T12:00:00Z");

    // ~-0.67 quarters must truncate toward zero (to 0), not floor to -1
    expect(differenceInQuarters(later, earlier)).toBeCloseTo(0);
    expect(differenceInQuarters(later, earlier, { fractional: true })).toBeCloseTo(-2 / 3, 5);
  });

  it("works with ZonedDateTime inputs in their own timezone", () => {
    const later = Temporal.ZonedDateTime.from("2025-10-15T09:00:00-04:00[America/New_York]");
    const earlier = Temporal.ZonedDateTime.from("2025-01-15T09:00:00-05:00[America/New_York]");

    expect(differenceInQuarters(later, earlier)).toBe(3);
  });

  it("accepts mixed Instant and ZonedDateTime inputs", () => {
    const later = Temporal.ZonedDateTime.from("2025-07-20T12:00:00Z[UTC]");
    const earlier = Temporal.Instant.from("2025-01-20T12:00:00Z");

    expect(differenceInQuarters(later, earlier)).toBe(2);
  });

  describe("from Temporal.PlainDate (no timezone)", () => {
    const pd = (s: string) => Temporal.PlainDate.from(s);

    it("returns whole quarters between two dates", () => {
      expect(differenceInQuarters(pd("2025-07-20"), pd("2025-01-20"))).toBe(2);
    });

    it("is negative when laterDate is before earlierDate", () => {
      expect(differenceInQuarters(pd("2025-01-20"), pd("2025-07-20"))).toBe(-2);
    });

    it("truncates a negative partial quarter toward zero", () => {
      // ~-0.67 quarters must truncate toward zero, not floor to -1
      expect(differenceInQuarters(pd("2025-01-20"), pd("2025-03-20"))).toBeCloseTo(0);
      expect(
        differenceInQuarters(pd("2025-03-20"), pd("2025-01-20"), {
          fractional: true,
        }),
      ).toBeCloseTo(2 / 3, 5);
    });

    it("counts across year boundaries", () => {
      expect(differenceInQuarters(pd("2026-01-20"), pd("2025-01-20"))).toBe(4);
    });
  });
});
