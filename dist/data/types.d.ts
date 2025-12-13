import type { IfExtendsThenElse, Nullish, OrArray } from "../types/types.ts";
export type DataUrlSource = OrArray<Blob | ArrayBuffer | ArrayBufferView<ArrayBuffer>>;
export interface ObjectUtils {
    omit<T extends {}, K extends keyof T>(obj: T, keys: K[]): Omit<T, K>;
    pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>;
    merge<T, U, V, W>(...sources: [T?, U?, V?, W?]): IfExtendsThenElse<T, Nullish, {}, T> & IfExtendsThenElse<U, Nullish, {}, U> & IfExtendsThenElse<V, Nullish, {}, V> & IfExtendsThenElse<W, Nullish, {}, W>;
    merge(...sources: unknown[]): unknown;
    mergeInto<T extends object, U, V, W>(...sources: [T, U?, V?, W?]): T & IfExtendsThenElse<U, Nullish, {}, U> & IfExtendsThenElse<V, Nullish, {}, V> & IfExtendsThenElse<W, Nullish, {}, W>;
    mergeInto(...sources: unknown[]): unknown;
}
export interface StringUtils {
    reverse(inputStr: string): string;
    substitute(inputStr: string, substitionMap: Map<string | RegExp, string> | Record<string, string>): string;
}
//# sourceMappingURL=types.d.ts.map