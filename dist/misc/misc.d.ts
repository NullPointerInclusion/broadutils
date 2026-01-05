import type { AnyFunction } from "../types/types.ts";
import type { Deferred } from "./types.ts";
export declare const noop: (...args: unknown[]) => null;
export declare const createDeferred: <T>() => Promise<Deferred<T>>;
export declare const setImmediate: <T extends AnyFunction>(callback: T, args?: unknown[]) => number, clearImmediate: (immediate: number) => null;
export * from "./types.ts";
//# sourceMappingURL=misc.d.ts.map