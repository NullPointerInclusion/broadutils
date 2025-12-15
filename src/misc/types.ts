import type { CallbackFunctionOne } from "../types/types.ts";

export interface Deferred<T> {
  promise: Promise<T>;
  resolve: CallbackFunctionOne<T>;
  reject: CallbackFunctionOne<unknown>;
}
