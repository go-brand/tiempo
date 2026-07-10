import { describe, expect, it } from "vitest";
import {
  capabilityCell,
  capabilityMatrixIntro,
  semanticInputNote,
} from "./capability-matrix-semantics";

describe("capability matrix semantics", () => {
  it("shows idempotent Instant conversions as supported", () => {
    expect(semanticInputNote("toInstant", "Instant")).toBeUndefined();
    expect(capabilityCell("toInstant", "Instant", true)).toBe("✅");
  });

  it("does not invent notes for genuine unsupported inputs", () => {
    expect(semanticInputNote("addDays", "PlainTime")).toBeUndefined();
    expect(capabilityCell("addDays", "PlainTime", false)).toBe("·");
    expect(capabilityCell("addDays", "Instant", true)).toBe("✅");
  });

  it("describes the matrix as the current source contract", () => {
    expect(capabilityMatrixIntro).toContain("current source API");
    expect(capabilityMatrixIntro).not.toContain("published API");
  });
});
