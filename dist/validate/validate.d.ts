import type { Assert, Check } from "./types.ts";
declare function _check_number(value: unknown): value is number;
declare namespace _check_number {
    var aan: import("./types.ts").CheckFunction<number>;
}
declare namespace _check_number {
    var positive: import("./types.ts").CheckFunction<number>;
}
declare namespace _check_number {
    var negative: import("./types.ts").CheckFunction<number>;
}
declare namespace _check_number {
    var zero: import("./types.ts").CheckFunction<number>;
}
declare namespace _check_number {
    var integer: import("./types.ts").CheckFunction<number>;
}
declare namespace _check_number {
    var float: import("./types.ts").CheckFunction<number>;
}
declare namespace _check_number {
    var finite: import("./types.ts").CheckFunction<number>;
}
declare namespace _check_number {
    var safeInteger: import("./types.ts").CheckFunction<number>;
}
declare function _assert_number(value: unknown, message: string | undefined): void;
declare namespace _assert_number {
    var aan: import("./types.ts").AssertFunction<number>;
}
declare namespace _assert_number {
    var positive: import("./types.ts").AssertFunction<number>;
}
declare namespace _assert_number {
    var negative: import("./types.ts").AssertFunction<number>;
}
declare namespace _assert_number {
    var zero: import("./types.ts").AssertFunction<number>;
}
declare namespace _assert_number {
    var integer: import("./types.ts").AssertFunction<number>;
}
declare namespace _assert_number {
    var float: import("./types.ts").AssertFunction<number>;
}
declare namespace _assert_number {
    var finite: import("./types.ts").AssertFunction<number>;
}
declare namespace _assert_number {
    var safeInteger: import("./types.ts").AssertFunction<number>;
}
export declare const assert: Assert;
export declare const check: Check;
export declare const nonNullable: <T>(value: T) => NonNullable<T>;
export declare const isNonNullable: <T>(value: T) => value is NonNullable<T>;
export * from "./types.ts";
//# sourceMappingURL=validate.d.ts.map