// @ts-nocheck

import { describe, it, expect, mock } from "bun:test";
import { fetch } from "../../network/network.ts";

// Mock global fetch
const mockResponse = {
  ok: true,
  status: 200,
  statusText: "OK",
  headers: new Headers({ "Content-Type": "application/json" }),
  arrayBuffer: mock(() => Promise.resolve(new ArrayBuffer(10))),
  blob: mock(() => Promise.resolve(new Blob(["test"]))),
  bytes: mock(() => Promise.resolve(new Uint8Array([1, 2, 3]))),
  json: mock(() => Promise.resolve({ test: "data" })),
  text: mock(() => Promise.resolve("test text")),
  body: {
    values: function* () {
      yield new Uint8Array([1]);
    },
  },
};
const originalFetch = globalThis.fetch;
globalThis.fetch = mock(() => Promise.resolve(mockResponse as any));

describe("Network utilities", () => {
  describe("fetch", () => {
    it("calls global fetch", async () => {
      await fetch("https://example.com");
      expect(globalThis.fetch).toHaveBeenCalledWith("https://example.com");
    });
  });

  describe("fetch.ok", () => {
    it("returns response if ok", async () => {
      const response = await fetch.ok("https://example.com");
      expect(response.ok).toBe(true);
    });

    it("throws if not ok", async () => {
      const badResponse = { ...mockResponse, ok: false, status: 404 };
      globalThis.fetch = mock(() => Promise.resolve(badResponse as any));
      await expect(fetch.ok("https://example.com")).rejects.toThrow();
      globalThis.fetch = mock(() => Promise.resolve(mockResponse as any));
    });
  });

  describe("fetch.arraybuffer", () => {
    it("returns array buffer", async () => {
      const result = await fetch.arraybuffer("https://example.com");
      expect(result).toBeInstanceOf(ArrayBuffer);
    });
  });

  describe("fetch.blob", () => {
    it("returns blob", async () => {
      const result = await fetch.blob("https://example.com");
      expect(result).toBeInstanceOf(Blob);
    });
  });

  describe("fetch.bytes", () => {
    it("returns uint8array", async () => {
      const result = await fetch.bytes("https://example.com");
      expect(result).toBeInstanceOf(Uint8Array);
    });
  });

  describe("fetch.headers", () => {
    it("returns augmented headers", async () => {
      const result = await fetch.headers("https://example.com");
      expect(result).toHaveProperty("ok");
      expect(result).toHaveProperty("status");
      expect(result).toHaveProperty("statusText");
    });
  });

  describe("fetch.json", () => {
    it("returns parsed json", async () => {
      const result = await fetch.json("https://example.com");
      expect(result).toEqual({ test: "data" });
    });
  });

  describe("fetch.stream", () => {
    it("returns readable stream", async () => {
      const result = await fetch.stream("https://example.com");
      expect(result).toBeDefined();
    });
  });

  describe("fetch.text", () => {
    it("returns text", async () => {
      const result = await fetch.text("https://example.com");
      expect(result).toBe("test text");
    });
  });
});
