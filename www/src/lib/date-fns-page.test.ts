import { describe, expect, test } from "vitest";
import { runExample } from "../../../scripts/reference-examples";
import {
  DATE_FNS_PAGE_DESCRIPTION,
  DATE_FNS_PAGE_META,
  DATE_FNS_PAGE_TITLE,
  DATE_FNS_PAGE_URL,
  TIEMPO_EXAMPLE,
} from "./date-fns-page";

describe("date-fns landing page", () => {
  test("targets date-fns searches with its own canonical URL", () => {
    expect(DATE_FNS_PAGE_URL).toBe("https://tiempo.gobrand.app/date-fns");
    expect(DATE_FNS_PAGE_TITLE).toContain("date-fns");
    expect(DATE_FNS_PAGE_TITLE).toContain("Temporal API");
    expect(DATE_FNS_PAGE_DESCRIPTION).toContain("date-fns");
    expect(DATE_FNS_PAGE_META).toEqual(
      expect.arrayContaining([{ property: "og:url", content: DATE_FNS_PAGE_URL }]),
    );
  });

  test("shows the tiempo results the example claims", async () => {
    const checks = await runExample(TIEMPO_EXAMPLE);

    expect(checks.length).toBe(2);
    for (const check of checks) {
      expect(check.actual, check.line).toBe(check.expected);
    }
  });
});
