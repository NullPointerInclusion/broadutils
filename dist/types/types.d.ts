export type Nullish = null | undefined;
export type OrArray<T> = T | T[];
export type Vector2 = [number, number];
export type Vector3 = [number, number, number];
export type AnyFunction = (...args: any[]) => any;
export type CallbackFunction<T extends any[]> = (...args: T) => void;
export type CallbackFunctionOne<T> = (value: T) => void;
export type Enforce<T, U> = T extends U ? T : never;
export type IfExtendsThenElse<T, Extension, TrueType, FalseType> = T extends Extension ? TrueType : FalseType;
//# sourceMappingURL=types.d.ts.map