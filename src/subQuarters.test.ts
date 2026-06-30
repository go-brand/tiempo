import { describe, expect, it } from "vitest";
import { Temporal } from "./shared/temporal";
import { subQuarters } from "./subQuarters";

describe("subQuarters", () => {
  it("subtracts quarters from an Instant", () => {
    const result = subQuarters(Temporal.Instant.from("2025-07-20T12:00:00Z"), 2);

    expect(result).toBeInstanceOf(Temporal.ZonedDateTime);
    expect(result.year).toBe(2025);
    expect(result.month).toBe(1);
    expect(result.day).toBe(20);
    expect(result.timeZoneId).toBe("UTC");
  });

  it("crosses year boundaries backward", () => {
    const result = subQuarters(Temporal.Instant.from("2025-02-20T12:00:00Z"), 1);

    expect(result.year).toBe(2024);
    expect(result.month).toBe(11);
    expect(result.day).toBe(20);
  });

  it("negative quarters add", () => {
    const result = subQuarters(Temporal.Instant.from("2025-01-20T12:00:00Z"), -2);
    expect(result.month).toBe(7);
  });

  it("preserves the timezone of a ZonedDateTime", () => {
    const zoned = Temporal.ZonedDateTime.from("2025-07-20T15:30:00-04:00[America/New_York]");
    const result = subQuarters(zoned, 1);

    expect(result.month).toBe(4);
    expect(result.day).toBe(20);
    expect(result.timeZoneId).toBe("America/New_York");
  });
});
