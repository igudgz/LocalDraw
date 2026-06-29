import { describe, expect, it } from "vitest";
import { formatUpdatedAt } from "./formatUpdatedAt";

describe("formatUpdatedAt", () => {
  it("formats a valid ISO date", () => {
    const formatted = formatUpdatedAt("2026-06-28T14:30:00.000Z");

    expect(formatted).toContain("2026");
  });

  it("returns the original value for invalid dates", () => {
    expect(formatUpdatedAt("not-a-date")).toBe("not-a-date");
  });
});
