/// <reference types="mocha" />

import { expect } from "chai";
import { convertToDataUrl, object, string } from "../../../data/data.ts";

describe("Data utilities", () => {
  describe("convertToDataUrl", () => {
    it("converts a Blob to data URL", async () => {
      const blob = new Blob(["test"], { type: "text/plain" });
      const dataUrl = await convertToDataUrl(blob);
      expect(dataUrl.startsWith("data:text/plain;base64,")).to.be.true;
    });

    it("converts an ArrayBuffer to data URL", async () => {
      const buffer = new ArrayBuffer(4);
      const view = new Uint8Array(buffer);
      view.set([72, 101, 108, 108]); // "Hell"
      const dataUrl = await convertToDataUrl(buffer);
      expect(dataUrl.startsWith("data:")).to.be.true;
    });

    it("converts an ArrayBufferView to data URL", async () => {
      const view = new Uint8Array([72, 101, 108, 108]);
      const dataUrl = await convertToDataUrl(view);
      expect(dataUrl.startsWith("data:")).to.be.true;
    });

    it("converts with custom mimeType", async () => {
      const blob = new Blob(["test"]);
      const dataUrl = await convertToDataUrl(blob, "text/plain");
      expect(dataUrl.startsWith("data:text/plain;base64,")).to.be.true;
    });

    it("converts array of sources", async () => {
      const sources = [new Uint8Array([72]), new Uint8Array([101])];
      const dataUrl = await convertToDataUrl(sources);
      expect(dataUrl.startsWith("data:")).to.be.true;
    });
  });

  describe("object", () => {
    describe("omit", () => {
      it("omits specified keys", () => {
        const obj = { a: 1, b: 2, c: 3 };
        const result = object.omit(obj, ["b"]);
        expect(result).to.deep.equal({ a: 1, c: 3 });
      });

      it("omits multiple keys", () => {
        const obj = { a: 1, b: 2, c: 3, d: 4 };
        const result = object.omit(obj, ["a", "c"]);
        expect(result).to.deep.equal({ b: 2, d: 4 });
      });

      it("returns original object if no keys to omit", () => {
        const obj = { a: 1, b: 2 };
        const result = object.omit(obj, []);
        expect(result).to.deep.equal(obj);
      });

      it("handles non-existent keys", () => {
        const obj = { a: 1, b: 2 };
        const result = object.omit(obj, ["c" as any]);
        expect(result).to.deep.equal({ a: 1, b: 2 });
      });
    });

    describe("pick", () => {
      it("picks specified keys", () => {
        const obj = { a: 1, b: 2, c: 3 };
        const result = object.pick(obj, ["a", "c"]);
        expect(result).to.deep.equal({ a: 1, c: 3 });
      });

      it("picks single key", () => {
        const obj = { a: 1, b: 2 };
        const result = object.pick(obj, ["b"]);
        expect(result).to.deep.equal({ b: 2 });
      });

      it("returns empty object if no keys", () => {
        const obj = { a: 1, b: 2 };
        const result = object.pick(obj, []);
        expect(result).to.deep.equal({});
      });
    });

    describe("merge", () => {
      it("merges multiple objects", () => {
        const firstObj = { a: 1 };
        const result = object.merge(firstObj, { b: 2 }, { c: 3 });
        expect(result).not.to.equal(firstObj);
        expect(result).to.deep.equal({ a: 1, b: 2, c: 3 });
      });

      it("later objects override earlier ones", () => {
        const firstObj = { a: 1 };
        const secondObj = { a: 2 };
        const result = object.merge(firstObj, secondObj);
        expect(result).not.to.equal(firstObj);
        expect(result).not.to.equal(secondObj);
        expect(result).to.deep.equal({ a: 2 });
      });

      it("handles undefined sources", () => {
        const firstObj = { a: 1 };
        const secondObj = { b: 2 };
        const result = object.merge(firstObj, undefined, secondObj);
        expect(result).not.to.equal(firstObj);
        expect(result).not.to.equal(secondObj);
        expect(result).to.deep.equal({ a: 1, b: 2 });
      });
    });

    describe("mergeInto", () => {
      it("merges into the first object", () => {
        const target = { a: 1 };
        const result = object.mergeInto(target, { b: 2 }, { c: 3 });
        expect(result).to.equal(target as typeof result);
        expect(result).to.deep.equal({ a: 1, b: 2, c: 3 });
      });

      it("overrides properties in target", () => {
        const target = { a: 1, b: 2 };
        object.mergeInto(target, { b: 3 });
        expect(target).to.deep.equal({ a: 1, b: 3 });
      });
    });
  });

  describe("string", () => {
    describe("reverse", () => {
      it("reverses a string", () => {
        expect(string.reverse("hello")).to.equal("olleh");
      });

      it("reverses empty string", () => {
        expect(string.reverse("")).to.equal("");
      });

      it("reverses single character", () => {
        expect(string.reverse("a")).to.equal("a");
      });
    });

    describe("substitute", () => {
      it("substitutes with Map", () => {
        const map = new Map([
          ["a", "x"],
          ["b", "y"],
        ]);
        expect(string.substitute("abc", map)).to.equal("xyc");
      });

      it("substitutes with Record", () => {
        const record = { a: "x", b: "y" };
        expect(string.substitute("abc", record)).to.equal("xyc");
      });

      it("substitutes with RegExp", () => {
        const map = new Map([[new RegExp("\\d+", "g"), "num"]]);
        expect(string.substitute("a1b2", map)).to.equal("anumbnum");
      });

      it("handles no matches", () => {
        const record = { x: "y" };
        expect(string.substitute("abc", record)).to.equal("abc");
      });
    });
  });
});
