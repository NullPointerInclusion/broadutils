import { fetch } from "../network/network.js";
import { nonNullable } from "../validate/validate.js";
import { convertToDataUrl } from "../data/data.js";
const sharedCanvas = new OffscreenCanvas(1, 1);
const sharedContext = nonNullable(sharedCanvas.getContext("2d", { willReadFrequently: true }));
export const resize = (target, dimensions) => {
    const canvas = target instanceof HTMLCanvasElement ? target : target.canvas;
    let width, height;
    if (Array.isArray(dimensions))
        ((width = dimensions[0]), (height = dimensions[1]));
    else
        ((width = dimensions.width ?? canvas.width), (height = dimensions.height ?? canvas.height));
    canvas.width = width;
    canvas.height = height;
    return target;
};
export const createContextSnapshot = (context) => {
    return {
        direction: context.direction,
        fillStyle: context.fillStyle,
        filter: context.filter,
        font: context.font,
        fontKerning: context.fontKerning,
        fontStretch: context.fontStretch,
        fontVariantCaps: context.fontVariantCaps,
        globalAlpha: context.globalAlpha,
        globalCompositeOperation: context.globalCompositeOperation,
        imageSmoothingEnabled: context.imageSmoothingEnabled,
        imageSmoothingQuality: context.imageSmoothingQuality,
        letterSpacing: context.letterSpacing,
        lineCap: context.lineCap,
        lineDashOffset: context.lineDashOffset,
        lineJoin: context.lineJoin,
        lineWidth: context.lineWidth,
        miterLimit: context.miterLimit,
        shadowBlur: context.shadowBlur,
        shadowColor: context.shadowColor,
        shadowOffsetX: context.shadowOffsetX,
        shadowOffsetY: context.shadowOffsetY,
        strokeStyle: context.strokeStyle,
        textAlign: context.textAlign,
        textBaseline: context.textBaseline,
        textRendering: context.textRendering,
        wordSpacing: context.wordSpacing,
        transform: context.getTransform(),
    };
};
export const applyContextSnapshot = (context, snapshot) => {
    context.direction = snapshot.direction;
    context.fillStyle = snapshot.fillStyle;
    context.filter = snapshot.filter;
    context.font = snapshot.font;
    context.fontKerning = snapshot.fontKerning;
    context.fontStretch = snapshot.fontStretch;
    context.fontVariantCaps = snapshot.fontVariantCaps;
    context.globalAlpha = snapshot.globalAlpha;
    context.globalCompositeOperation = snapshot.globalCompositeOperation;
    context.imageSmoothingEnabled = snapshot.imageSmoothingEnabled;
    context.imageSmoothingQuality = snapshot.imageSmoothingQuality;
    context.letterSpacing = snapshot.letterSpacing;
    context.lineCap = snapshot.lineCap;
    context.lineDashOffset = snapshot.lineDashOffset;
    context.lineJoin = snapshot.lineJoin;
    context.lineWidth = snapshot.lineWidth;
    context.miterLimit = snapshot.miterLimit;
    context.shadowBlur = snapshot.shadowBlur;
    context.shadowColor = snapshot.shadowColor;
    context.shadowOffsetX = snapshot.shadowOffsetX;
    context.shadowOffsetY = snapshot.shadowOffsetY;
    context.strokeStyle = snapshot.strokeStyle;
    context.textAlign = snapshot.textAlign;
    context.textBaseline = snapshot.textBaseline;
    context.textRendering = snapshot.textRendering;
    context.wordSpacing = snapshot.wordSpacing;
    context.setTransform(snapshot.transform);
    return context;
};
export const cloneImageData = (imageData) => {
    const cloned = new ImageData(imageData.width, imageData.height);
    cloned.data.set(imageData.data);
    return cloned;
};
export const getDimensions = (source) => {
    if (source instanceof VideoFrame)
        return [source.displayWidth, source.displayHeight];
    if (!(source instanceof SVGImageElement)) {
        return [source.width, source.height];
    }
    const widthUnit = source.width.baseVal.unitType;
    const heightUnit = source.height.baseVal.unitType;
    source.width.baseVal.convertToSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX);
    source.height.baseVal.convertToSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX);
    const dimensions = [
        source.width.baseVal.valueInSpecifiedUnits,
        source.height.baseVal.valueInSpecifiedUnits,
    ];
    source.width.baseVal.convertToSpecifiedUnits(widthUnit);
    source.height.baseVal.convertToSpecifiedUnits(heightUnit);
    return dimensions;
};
export const mirrorImageToCanvas = (context, image) => {
    const imageSmoothingEnabled = context.imageSmoothingEnabled;
    const canvas = context.canvas;
    const [width, height] = getDimensions(image);
    canvas.width = width;
    canvas.height = height;
    context.imageSmoothingEnabled = false;
    if (image instanceof ImageData)
        context.putImageData(image, 0, 0);
    else
        context.drawImage(image, 0, 0, width, height);
    context.imageSmoothingEnabled = imageSmoothingEnabled;
    return context;
};
export const getImage = async (source) => {
    if (typeof source === "string")
        return fetch.image(source);
    if (source instanceof ArrayBuffer || ArrayBuffer.isView(source) || source instanceof Blob) {
        const url = URL.createObjectURL(new Blob([source]));
        const image = document.createElement("img");
        image.src = url;
        await image.decode().then(() => URL.revokeObjectURL(url));
        return image;
    }
    mirrorImageToCanvas(sharedContext, source);
    const image = document.createElement("img");
    const blob = await sharedCanvas.convertToBlob({ type: "image/webp", quality: 1 });
    const dataUrl = await convertToDataUrl(blob);
    image.src = dataUrl;
    await image.decode();
    return image;
};
export const getImageData = async (source) => {
    let imageSource;
    if (typeof source === "string")
        imageSource = await fetch.image(source);
    else if (source instanceof ImageData)
        return cloneImageData(source);
    else if (source instanceof ArrayBuffer || ArrayBuffer.isView(source) || source instanceof Blob) {
        imageSource = await getImage(source);
    }
    else
        imageSource = source;
    mirrorImageToCanvas(sharedContext, imageSource);
    return sharedContext.getImageData(0, 0, sharedCanvas.width, sharedCanvas.height);
};
export * from "./types.js";
//# sourceMappingURL=canvas.js.map