import { describe, expect, it } from "vitest";
import { formatTagsForInput, parseTagsInput } from "./tagHelpers";

describe("tagHelpers", () => {
  it("parses comma-separated tags", () => {
    expect(parseTagsInput("mvp, local, draft")).toEqual([
      "mvp",
      "local",
      "draft",
    ]);
  });

  it("ignores empty segments", () => {
    expect(parseTagsInput("one,, two , ,three")).toEqual(["one", "two", "three"]);
  });

  it("formats tags for input", () => {
    expect(formatTagsForInput(["alpha", "beta"])).toBe("alpha, beta");
  });
});
