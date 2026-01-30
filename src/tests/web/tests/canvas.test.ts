/// <reference types="mocha" />

import { expect } from "chai";
import {
  resize,
  createContextSnapshot,
  applyContextSnapshot,
  cloneImageData,
  getDimensions,
  mirrorImageToCanvas,
  getImage,
  getImageData,
} from "../../../canvas/canvas.ts";

const compareImageData = (a: ImageData, b: ImageData): boolean => {
  return (
    a.width === b.width &&
    a.height === b.height &&
    a.colorSpace === b.colorSpace &&
    a.data.length === b.data.length &&
    a.data.every((v, i) => v === b.data[i])
  );
};

const imageData = new ImageData(4, 2);
imageData.data.set([255, 0, 0, 255], 0);
imageData.data.set([128, 255, 128, 255], 4);
imageData.data.set([0, 0, 255, 255], 8);
imageData.data.set([0, 255, 255, 255], 12);
imageData.data.set([255, 0, 255, 255], 16);
imageData.data.set([0, 255, 255, 255], 20);

const [testImage, testImageUrl, testImageBlob] = await (async () => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const image = document.createElement("img");

  if (!context) throw new Error("Failed to acquire 2D context");

  canvas.width = imageData.width;
  canvas.height = imageData.height;

  context.putImageData(imageData, 0, 0);
  image.src = canvas.toDataURL();

  await image.decode();
  return [
    image,
    image.src,
    await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Failed to create blob"));
        },
        "image/webp",
        1,
      );
    }),
  ];
})();

// warmup
for (let i = 0; i < 5; ++i) {
  await getImage(testImageUrl);
  await getImage(testImageBlob);
  await getImageData(testImage);
  await getImageData(testImageUrl);
}

describe("Canvas utilities", () => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d", { willReadFrequently: true })!;
  if (!context) throw new Error("Failed to acquire 2D context");

  beforeEach(() => {
    context.reset();
    canvas.width = 2 * (canvas.height = 150);
  });

  describe("resize", () => {
    it("resizes canvas with array dimensions", () => {
      canvas.width = 100;
      canvas.height = 100;
      resize(canvas, [200, 300]);
      expect(canvas.width).to.equal(200);
      expect(canvas.height).to.equal(300);
    });

    it("resizes canvas with partial dimensions", () => {
      canvas.width = 100;
      canvas.height = 100;
      resize(canvas, { width: 150 });
      expect(canvas.width).to.equal(150);
      expect(canvas.height).to.equal(100);
    });

    it("resizes context", () => {
      canvas.width = 100;
      canvas.height = 100;
      resize(context, [200, 300]);
      expect(canvas.width).to.equal(200);
      expect(canvas.height).to.equal(300);
    });
  });

  describe("createContextSnapshot", () => {
    it("creates a snapshot of context state", () => {
      context.fillStyle = "red";
      context.lineWidth = 5;
      const snapshot = createContextSnapshot(context);
      expect(snapshot.fillStyle).to.equal("#ff0000");
      expect(snapshot.lineWidth).to.equal(5);
      expect(snapshot).to.have.property("transform");
    });
  });

  describe("applyContextSnapshot", () => {
    it("applies snapshot to context", () => {
      const snapshot = createContextSnapshot(context);
      snapshot.fillStyle = "blue";
      snapshot.lineWidth = 10;
      applyContextSnapshot(context, snapshot);
      expect(context.fillStyle).to.equal("#0000ff");
      expect(context.lineWidth).to.equal(10);
    });
  });

  describe("cloneImageData", () => {
    it("clones ImageData", () => {
      const cloned = cloneImageData(imageData);
      expect(cloned.width).to.equal(imageData.width);
      expect(cloned.height).to.equal(imageData.height);
      expect(cloned.data).to.deep.equal(imageData.data);
      expect(cloned).not.to.equal(imageData);
      expect(cloned.data).not.to.equal(imageData.data);
    });
  });

  describe("getDimensions", () => {
    it("gets dimensions from ImageData", () => {
      const imageData = new ImageData(100, 200);
      const dims = getDimensions(imageData);
      expect(dims).to.deep.equal([100, 200]);
    });

    it("gets dimensions from canvas", () => {
      canvas.width = 150;
      canvas.height = 250;
      const dims = getDimensions(canvas);
      expect(dims).to.deep.equal([150, 250]);
    });

    it("gets dimensions from image", () => {
      const img = document.createElement("img");
      img.width = 300;
      img.height = 400;
      const dims = getDimensions(img);
      expect(dims).to.deep.equal([300, 400]);
    });
  });

  describe("mirrorImageToCanvas", () => {
    it("mirrors ImageData to canvas", () => {
      mirrorImageToCanvas(context, imageData);
      expect(canvas.width).to.equal(imageData.width);
      expect(canvas.height).to.equal(imageData.height);
      expect(
        compareImageData(context.getImageData(0, 0, canvas.width, canvas.height), imageData),
      ).to.equal(true);
    });

    it("mirrors canvas image to canvas", () => {
      const sourceCanvas = document.createElement("canvas");
      const sourceContext = sourceCanvas.getContext("2d")!;
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d")!;
      mirrorImageToCanvas(sourceContext, testImage);
      mirrorImageToCanvas(context, sourceCanvas);
      expect(canvas.width).to.equal(imageData.width);
      expect(canvas.height).to.equal(imageData.height);
    });
  });

  describe("getImage", () => {
    it("loads image from string URL", async () => {
      const img = await getImage(testImageUrl);
      expect(img).to.be.instanceOf(HTMLImageElement);
      expect(
        compareImageData(
          mirrorImageToCanvas(context, img).getImageData(0, 0, canvas.width, canvas.height),
          mirrorImageToCanvas(context, testImage).getImageData(0, 0, canvas.width, canvas.height),
        ),
      ).to.equal(true);
    });

    it("loads image from Blob", async () => {
      const img = await getImage(testImageBlob);
      expect(img).to.be.instanceOf(HTMLImageElement);
      expect(
        compareImageData(
          mirrorImageToCanvas(context, img).getImageData(0, 0, canvas.width, canvas.height),
          mirrorImageToCanvas(context, testImage).getImageData(0, 0, canvas.width, canvas.height),
        ),
      ).to.equal(true);
    });

    it("loads image from ArrayBuffer", async () => {
      const buffer = await testImageBlob.arrayBuffer();
      const img = await getImage(buffer);
      expect(img).to.be.instanceOf(HTMLImageElement);
      expect(
        compareImageData(
          mirrorImageToCanvas(context, img).getImageData(0, 0, canvas.width, canvas.height),
          mirrorImageToCanvas(context, testImage).getImageData(0, 0, canvas.width, canvas.height),
        ),
      ).to.equal(true);
    });
  });

  describe("getImageData", () => {
    it("gets ImageData from ImageData", async () => {
      const result = await getImageData(imageData);
      expect(result).to.be.instanceOf(ImageData);
      expect(compareImageData(result, imageData)).to.equal(true);
    });

    it("gets ImageData from canvas", async () => {
      canvas.width = 2 * (canvas.height = 1);
      context.imageSmoothingEnabled = false;
      context.drawImage(testImage, 0, 0);
      const result = await getImageData(canvas);
      expect(result).to.be.instanceOf(ImageData);
      expect([result.width, result.height]).to.deep.equal([2, 1]);
      expect([...result.data]).to.deep.equal([255, 0, 0, 255, 128, 255, 128, 255]);
    });

    it("gets ImageData from data URL", async () => {
      const result = await getImageData(testImageUrl);
      expect(result).to.be.instanceOf(ImageData);
      expect(compareImageData(result, imageData)).to.equal(true);
    });
  });
});
