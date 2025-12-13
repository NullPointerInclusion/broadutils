export type Vector2 = [number, number];
export type Vector3 = [number, number, number];
export type OrArray<T> = T | T[];
export type Nullish = null | undefined;
export type CallbackFunction<T> = (value: T) => void;
export type IfExtendsThenElse<T, Extension, TrueType, FalseType> = T extends Extension ? TrueType : FalseType;
//# sourceMappingURL=types.d.ts.map