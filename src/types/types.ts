type _Number = -1 | _Numbers[number];
type _Numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
type _NumbersNegShift = _Numbers extends [...infer T, infer _] ? [-1, ...T] : never;
type _NumbersPosShift = _Numbers extends [infer _, ...infer T] ? [...T, 21] : never;

export type ArrayOf<Value, Length extends _Number = -1> = Length extends -1
  ? Value[]
  : Length extends 0
    ? []
    : [Value, ...ArrayOf<Value, _NumbersNegShift[Length]>];

export type Nullish = null | undefined;
export type OrArray<T> = T | T[];

export type Vector2 = ArrayOf<number, 2>;
export type Vector3 = ArrayOf<number, 3>;

export type AnyFunction = (...args: any[]) => any;
export type CallbackFunction<T extends any[]> = (...args: T) => void;
export type CallbackFunctionOne<T> = (value: T) => void;
export type FunctionThatReturns<T, Args extends any[] = []> = (...args: Args) => T;

export type Enforce<T, U> = T extends U ? T : never;
export type IfExtendsThenElse<T, Extension, TrueType, FalseType> = T extends Extension
  ? TrueType
  : FalseType;

type DeepFrozenObject<T extends object> = { readonly [K in keyof T]: DeepFrozen<T[K]> };
type DeepFrozenArray<T extends any[]> = any[] extends T
  ? Readonly<T>
  : T extends [infer Head, ...infer Rest]
    ? [DeepFrozen<Head>, ...DeepFrozenArray<Rest>]
    : [];
export type DeepFrozen<T> = T extends any[]
  ? DeepFrozenArray<T>
  : T extends object
    ? DeepFrozenObject<T>
    : T;
