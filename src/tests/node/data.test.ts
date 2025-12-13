import { describe, it, expect } from "bun:test";
import { convertToDataUrl, object, string } from "../../data/data.ts";

// Mock FileReader for Node environment
global.FileReader = class MockFileReader {
  onloadend: any = null;
  onerror: any = null;
  result: string = "data:text/plain;base64,dGVzdA=="; // Mock result

  readAsDataURL() {
    // Simulate successful read
    setTimeout(() => {
      if (this.onloadend) {
        this.onloadend({ target: { result: this.result } });
      }
    }, 0);
  }
} as any;

describe("convertToDataUrl", () => {
  it("converts a Blob to data URL", async () => {
    const blob = new Blob(["test"], { type: "text/plain" });
    const dataUrl = await convertToDataUrl(blob);
    expect(dataUrl).toStartWith("data:text/plain;base64,");
  });

  it("converts an ArrayBuffer to data URL", async () => {
    const buffer = new ArrayBuffer(4);
    const view = new Uint8Array(buffer);
    view.set([72, 101, 108, 108]); // "Hell"
    const dataUrl = await convertToDataUrl(buffer);
    expect(dataUrl).toStartWith("data:");
  });

  it("converts an ArrayBufferView to data URL", async () => {
    const view = new Uint8Array([72, 101, 108, 108]);
    const dataUrl = await convertToDataUrl(view);
    expect(dataUrl).toStartWith("data:");
  });

  it("converts with custom mimeType", async () => {
    const blob = new Blob(["test"]);
    const dataUrl = await convertToDataUrl(blob, "text/plain");
    expect(dataUrl).toStartWith("data:text/plain;base64,");
  });

  it("converts array of sources", async () => {
    const sources = [new Uint8Array([72]), new Uint8Array([101])];
    const dataUrl = await convertToDataUrl(sources);
    expect(dataUrl).toStartWith("data:");
  });
});

describe("object", () => {
  describe("omit", () => {
    it("omits specified keys", () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = object.omit(obj, ["b"]);
      expect(result).toEqual({ a: 1, c: 3 });
    });

    it("omits multiple keys", () => {
      const obj = { a: 1, b: 2, c: 3, d: 4 };
      const result = object.omit(obj, ["a", "c"]);
      expect(result).toEqual({ b: 2, d: 4 });
    });

    it("returns original object if no keys to omit", () => {
      const obj = { a: 1, b: 2 };
      const result = object.omit(obj, []);
      expect(result).toEqual(obj);
    });

    it("handles non-existent keys", () => {
      const obj = { a: 1, b: 2 };
      const result = object.omit(obj, ["c" as any]);
      expect(result).toEqual({ a: 1, b: 2 });
    });
  });

  describe("pick", () => {
    it("picks specified keys", () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = object.pick(obj, ["a", "c"]);
      expect(result).toEqual({ a: 1, c: 3 });
    });

    it("picks single key", () => {
      const obj = { a: 1, b: 2 };
      const result = object.pick(obj, ["b"]);
      expect(result).toEqual({ b: 2 });
    });

    it("returns empty object if no keys", () => {
      const obj = { a: 1, b: 2 };
      const result = object.pick(obj, []);
      expect(result).toEqual({});
    });
  });

  describe("merge", () => {
    it("merges multiple objects", () => {
      const result = object.merge({ a: 1 }, { b: 2 }, { c: 3 });
      expect(result).toEqual({ a: 1, b: 2, c: 3 });
    });

    it("later objects override earlier ones", () => {
      const result = object.merge({ a: 1 }, { a: 2 });
      expect(result).toEqual({ a: 2 });
    });

    it("handles undefined sources", () => {
      const result = object.merge({ a: 1 }, undefined, { b: 2 });
      expect(result).toEqual({ a: 1, b: 2 });
    });
  });

  describe("mergeInto", () => {
    it("merges into the first object", () => {
      const target = { a: 1 };
      const result = object.mergeInto(target, { b: 2 }, { c: 3 });
      expect(result).toBe(target as typeof result);
      expect(result).toEqual({ a: 1, b: 2, c: 3 });
    });

    it("overrides properties in target", () => {
      const target = { a: 1, b: 2 };
      object.mergeInto(target, { b: 3 });
      expect(target).toEqual({ a: 1, b: 3 });
    });
  });
});

describe("string", () => {
  describe("reverse", () => {
    it("reverses a string", () => {
      expect(string.reverse("hello")).toBe("olleh");
    });

    it("reverses empty string", () => {
      expect(string.reverse("")).toBe("");
    });

    it("reverses single character", () => {
      expect(string.reverse("a")).toBe("a");
    });
  });

  describe("substitute", () => {
    it("substitutes with Map", () => {
      const map = new Map([
        ["a", "x"],
        ["b", "y"],
      ]);
      expect(string.substitute("abc", map)).toBe("xyc");
    });

    it("substitutes with Record", () => {
      const record = { a: "x", b: "y" };
      expect(string.substitute("abc", record)).toBe("xyc");
    });

    it("substitutes with RegExp", () => {
      const map = new Map([[new RegExp("\\d+", "g"), "num"]]);
      expect(string.substitute("a1b2", map)).toBe("anumbnum");
    });

    it("handles no matches", () => {
      const record = { x: "y" };
      expect(string.substitute("abc", record)).toBe("abc");
    });
  });
});
