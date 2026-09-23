import { describe, expect, it } from "vitest";

import { cn } from "./utils";

describe("cn", () => {
  it("joins plain and conditional class names", () => {
    expect(cn("a", false && "b", undefined, "c")).toBe("a c");
  });

  it("lets a later utility override an earlier one from the same group", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
  });

  it("keeps utilities that belong to different groups", () => {
    expect(cn("text-sm", "text-center")).toBe("text-sm text-center");
  });
});
