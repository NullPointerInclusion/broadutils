/// <reference types="mocha" />

import { expect } from "chai";
import { fetch } from "../../../network/network.ts";

const URL_404 = "https://cdn.jsdelivr.net/npm/package-that-does-not-exist";

describe("Network utilities", () => {
  describe("fetch", () => {
    it("fetches a resource from a URL", async () => {
      const response = await fetch(
        "data:application/json;charset=utf-8;base64,eyJuYW1lIjoiQW5vbnltb3VzIn0=",
      );
      const data = await response.json();
      expect(response).to.have.property("ok", true);
      expect(response).to.have.property("status", 200);
      expect(data).to.have.property("name", "Anonymous");
    }).timeout(5000);
    it("handles 404 errors", async () => {
      const response = await fetch(URL_404);
      expect(response).to.have.property("ok", false);
      expect(response.status).to.be.greaterThanOrEqual(400);
      expect(response.status).to.be.lessThan(500);
    }).timeout(5000);
    it("should throw on a non-existent domain", async () => {
      try {
        await fetch("https://thisdomaindoesnotexist.tld/resource");
        expect.fail("Expected fetch to throw an error for non-existent domain");
      } catch (error) {
        expect(error).to.be.instanceOf(Error);
      }
    }).timeout(5000);
    it("should throw on invalid inputs", async () => {
      try {
        // @ts-ignore
        await fetch(12345);
        expect.fail("Expected fetch to throw an error for invalid input");
      } catch (error) {
        expect(error).to.be.instanceOf(Error);
      }

      try {
        // @ts-ignore
        await fetch(null);
        expect.fail("Expected fetch to throw an error for invalid input");
      } catch (error) {
        expect(error).to.be.instanceOf(Error);
      }

      try {
        // @ts-ignore
        await fetch(Symbol.for("invalid"));
        expect.fail("Expected fetch to throw an error for invalid input");
      } catch (error) {
        expect(error).to.be.instanceOf(Error);
      }
    });
  });
  describe("fetch.ok", async () => {
    it("fetches a resource and returns ok response", async () => {
      const response = await fetch.ok("https://jsonplaceholder.typicode.com/posts/1");
      const data = await response.json();
      expect(response).to.have.property("ok", true);
      expect(response).to.have.property("status", 200);
      expect(data).to.have.property("id", 1);
    }).timeout(5000);
    it("throws on 404 errors", async () => {
      try {
        await fetch.ok(URL_404);
        expect.fail("Expected fetch.ok to throw an error for 404 response");
      } catch (error) {
        expect(error).to.be.instanceOf(Error);
      }
    }).timeout(5000);
  });
  describe("fetch.arraybuffer", async () => {
    it("fetches a resource and returns ArrayBuffer", async () => {
      const buffer = await fetch.arraybuffer("https://jsonplaceholder.typicode.com/posts/1");
      expect(buffer).to.be.instanceOf(ArrayBuffer);
      const text = new TextDecoder().decode(buffer);
      const data = JSON.parse(text);
      expect(data).to.have.property("id", 1);
    }).timeout(5000);
    it("throws on 404 errors", async () => {
      try {
        await fetch.arraybuffer(URL_404);
        expect.fail("Expected fetch.arraybuffer to throw an error for 404 response");
      } catch (error) {
        expect(error).to.be.instanceOf(Error);
      }
    }).timeout(5000);
  });
  describe("fetch.blob", async () => {
    it("fetches a resource and returns Blob", async () => {
      const blob = await fetch.blob("https://jsonplaceholder.typicode.com/posts/1");
      expect(blob).to.be.instanceOf(Blob);
      const text = await blob.text();
      const data = JSON.parse(text);
      expect(data).to.have.property("id", 1);
    }).timeout(5000);
    it("throws on 404 errors", async () => {
      try {
        await fetch.blob(URL_404);
        expect.fail("Expected fetch.arraybuffer to throw an error for 404 response");
      } catch (error) {
        expect(error).to.be.instanceOf(Error);
      }
    }).timeout(5000);
  });
  describe("fetch.bytes", () => {
    it("fetches a resource and returns Blob", async () => {
      const bytes = await fetch.bytes("https://jsonplaceholder.typicode.com/posts/1");
      expect(bytes).to.be.instanceOf(Uint8Array);
      const data = JSON.parse(new TextDecoder().decode(bytes));
      expect(data).to.have.property("id", 1);
    }).timeout(5000);
    it("throws on 404 errors", async () => {
      try {
        await fetch.bytes(URL_404);
        expect.fail("Expected fetch.arraybuffer to throw an error for 404 response");
      } catch (error) {
        expect(error).to.be.instanceOf(Error);
      }
    }).timeout(5000);
  });
  describe("fetch.headers", () => {
    const isSuccessfulResponseStatus = (value: number) => value >= 200 && value < 300;
    const verifyAugumentedHeaders = (value: any): void => {
      expect(value).to.be.instanceOf(Headers);
      expect(typeof value.ok).to.equal("boolean");
      expect(typeof value.status).to.equal("number");
      expect(typeof value.statusText).to.equal("string");
    };

    it("should throw on invalid arguments", async () => {
      try {
        // @ts-ignore
        await fetch(null);
        expect.fail("Expected fetch.headers to throw an error for invalid input");
      } catch (error) {
        expect(error).to.be.instanceOf(Error);
      }

      try {
        // @ts-ignore
        await fetch({});
        expect.fail("Expected fetch.headers to throw an error for invalid input");
      } catch (error) {
        expect(error).to.be.instanceOf(Error);
      }
    });
    it("return augumented response headers from successfully fetching a resource", async () => {
      const headers = await fetch.headers("https://jsonplaceholder.typicode.com/posts/1");
      verifyAugumentedHeaders(headers);
      expect(headers.ok).to.be.true;
      expect(isSuccessfulResponseStatus(headers.status)).to.be.true;
    }).timeout(5000);
    it("return augumented response headers from a not okay response", async () => {
      const headers = await fetch.headers(URL_404);
      verifyAugumentedHeaders(headers);
      expect(headers.ok).to.be.false;
      expect(isSuccessfulResponseStatus(headers.status)).to.be.false;
    }).timeout(5000);
  });
  describe("fetch.json", () => {
    it("fetches a resource and returns JSON", async () => {
      const data = await fetch.json("https://jsonplaceholder.typicode.com/posts/1");
      expect(data).to.have.property("id", 1);
    }).timeout(5000);
    it("throws on 404 errors", async () => {
      try {
        await fetch.json(URL_404);
        expect.fail("Expected fetch.json to throw an error for 404 response");
      } catch (error) {
        expect(error).to.be.instanceOf(Error);
      }
    }).timeout(5000);
  });
  describe("fetch.stream", () => {
    it("fetches a resource and returns ReadableStream", async () => {
      const stream = await fetch.stream("https://jsonplaceholder.typicode.com/posts/1");
      const textDecoder = new TextDecoder();
      let string = "";

      expect(stream).to.be.instanceOf(ReadableStream);
      for await (const chunk of stream.values()) string += textDecoder.decode(chunk);

      const data = JSON.parse(string);
      expect(data).to.have.property("id", 1);
    }).timeout(5000);
    it("throws on 404 errors", async () => {
      try {
        await fetch.stream(URL_404);
        expect.fail("Expected fetch.stream to throw an error for 404 response");
      } catch (error) {
        expect(error).to.be.instanceOf(Error);
      }
    }).timeout(5000);
  });
  describe("fetch.text", () => {
    it("fetches a resource and returns text", async () => {
      const data = await fetch.text("https://jsonplaceholder.typicode.com/posts/1");
      const json = JSON.parse(data);
      expect(json).to.have.property("id", 1);
    }).timeout(5000);
    it("throws on 404 errors", async () => {
      try {
        await fetch.text(URL_404);
        expect.fail("Expected fetch.text to throw an error for 404 response");
      } catch (error) {
        expect(error).to.be.instanceOf(Error);
      }
    }).timeout(5000);
  });
  describe("fetch.audio", () => {
    it("fetches a resource and returns HTMLAudioElement", async () => {
      /* Sound Effect by
       * Alphix
       *  (https://pixabay.com/users/alphix-52619918/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=417465)
       * from Pixabay
       *  (https://pixabay.com/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=417465)
       */
      const audio = await fetch.audio("/src/tests/web/assets/audio.mp3");
      expect(audio).to.be.instanceOf(HTMLAudioElement);
      expect(audio.duration).to.equal(3.082438);
    }).timeout(5000);
    it("throws on 404 errors", async () => {
      try {
        await fetch.audio(URL_404);
        expect.fail("Expected fetch.audio to throw an error for 404 response");
      } catch (error) {
        expect(error).to.be.instanceOf(Error);
      }
    }).timeout(5000);
  });
  describe("fetch.image", () => {
    it("fetches a resource and returns HTMLImageElement", async () => {
      /* Photo by
       * Divexfre
       *  (https://pixabay.com/users/divexfre-51177510/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=9766407)
       * from Pixabay
       *  (https://pixabay.com/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=9766407)
       */
      const image = await fetch.image("/src/tests/web/assets/image.png");
      expect(image).to.be.instanceOf(HTMLImageElement);
      expect(image.width).to.equal(640);
      expect(image.height).to.equal(640);
    }).timeout(5000);
    it("throws on 404 errors", async () => {
      try {
        await fetch.image(URL_404);
        expect.fail("Expected fetch.image to throw an error for 404 response");
      } catch (error) {
        expect(error).to.be.instanceOf(Error);
      }
    }).timeout(5000);
  });
  describe("fetch.video", () => {
    it("fetches a resource and returns HTMLVideoElement", async () => {
      /* Video by
       * Bruno Magic
       *  (https://pixabay.com/users/brunomagic-32383613/?utm_source=link-attribution&utm_medium=referral&utm_campaign=video&utm_content=169757)
       * from Pixabay
       *  (https://pixabay.com/?utm_source=link-attribution&utm_medium=referral&utm_campaign=video&utm_content=169757)
       */
      const video = await fetch.video("/src/tests/web/assets/video.mp4");
      expect(video).to.be.instanceOf(HTMLVideoElement);
      expect(video.videoWidth).to.equal(1280);
      expect(video.videoHeight).to.equal(720);
    }).timeout(10000);
    it("throws on 404 errors", async () => {
      try {
        await fetch.video(URL_404);
        expect.fail("Expected fetch.video to throw an error for 404 response");
      } catch (error) {
        expect(error).to.be.instanceOf(Error);
      }
    }).timeout(5000);
  });
});
