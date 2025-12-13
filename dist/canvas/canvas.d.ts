import type { Vector2 } from "../types/types.ts";
import type { ContextSnapshot, ExtendedImageSource, RenderingContext } from "./types.ts";
export declare const resize: (target: CanvasRenderingContext2D | HTMLCanvasElement, dimensions: Partial<Record<"height" | "width", number>> | Vector2) => CanvasRenderingContext2D | HTMLCanvasElement;
export declare const createContextSnapshot: (context: CanvasRenderingContext2D) => ContextSnapshot;
export declare const applyContextSnapshot: (context: CanvasRenderingContext2D, snapshot: ContextSnapshot) => CanvasRenderingContext2D;
export declare const cloneImageData: (imageData: ImageData) => ImageData;
export declare const getDimensions: (source: ImageData | CanvasImageSource) => Vector2;
export declare const mirrorImageToCanvas: <T extends RenderingContext>(context: T, image: ImageData | CanvasImageSource) => T;
export declare const getImage: (source: ExtendedImageSource) => Promise<HTMLImageElement>;
export declare const getImageData: (source: ExtendedImageSource) => Promise<ImageData>;
export * from "./types.ts";
//# sourceMappingURL=canvas.d.ts.map