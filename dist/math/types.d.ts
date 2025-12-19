export type Average = {
    (...values: number[]): number;
    (values: Iterable<number>): number;
};
export type MinOrMax = {
    (...values: number[]): number;
    (...values: bigint[]): bigint;
    (...values: (number | bigint)[]): number | bigint;
};
export type Clamp = {
    (value: number, min: number, max: number): number;
    (value: bigint, min: bigint, max: bigint): bigint;
};
export type Constrain = (value: number, low: number, high: number) => number;
export type AngleUnit = "degrees" | "radians" | "gradians" | "turns";
export type DistanceUnit = "nanometers" | "micrometers" | "millimetres" | "centimetres" | "decimetres" | "metres" | "kilometres";
export type MassUnit = "nanograms" | "micrograms" | "milligrams" | "centigrams" | "decigrams" | "grams" | "kilograms" | "tonnes" | "tons" | "pounds" | "ounces";
export type TimeUnit = "nanoseconds" | "microseconds" | "milliseconds" | "seconds" | "minutes" | "hours" | "days" | "months" | "years";
export type Convert = {
    (value: number, from: AngleUnit, to: AngleUnit): number;
    (value: number, from: DistanceUnit, to: DistanceUnit): number;
    (value: number, from: MassUnit, to: MassUnit): number;
    (value: number, from: TimeUnit, to: TimeUnit): number;
};
//# sourceMappingURL=types.d.ts.map