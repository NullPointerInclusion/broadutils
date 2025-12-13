import type { CallbackFunction } from "../types/types.ts";
export interface Deferred<T> {
    promise: Promise<T>;
    resolve: CallbackFunction<T>;
    reject: CallbackFunction<unknown>;
}
//# sourceMappingURL=types.d.ts.map