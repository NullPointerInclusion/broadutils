import { describe, it, expect } from "bun:test";
import { noop, createDeferred } from "../../misc/misc.ts";

describe("Misc utilities", () => {
  describe("noop", () => {
    it("returns null regardless of arguments", () => {
      expect(noop()).toBe(null);
      expect(noop(1, "test", {})).toBe(null);
    });
  });

  describe("createDeferred", () => {
    it("creates a deferred object", async () => {
      const deferred = await createDeferred<string>();
      expect(deferred).toHaveProperty("promise");
      expect(deferred).toHaveProperty("resolve");
      expect(deferred).toHaveProperty("reject");
      expect(deferred.promise).toBeInstanceOf(Promise);
    });

    it("resolves the promise when resolve is called", async () => {
      const deferred = await createDeferred<number>();
      const result = deferred.promise;
      deferred.resolve(42);
      expect(await result).toBe(42);
    });

    it("rejects the promise when reject is called", async () => {
      const deferred = await createDeferred<number>();
      const error = new Error("test error");
      deferred.reject(error);
      await expect(deferred.promise).rejects.toThrow("test error");
    });
  });
});
