import { nonNullable } from "../validate/validate.ts";
import type { ArrayUtils, DataUrlSource, ObjectUtils, StringUtils } from "./types.ts";

export const convertToDataUrl = async (
  source: DataUrlSource,
  mimeType?: string,
): Promise<string> => {
  let blob: Blob;

  if (source instanceof Blob) blob = mimeType ? new Blob([source], { type: mimeType }) : source;
  else
    blob = new Blob(
      Array.isArray(source) ? source : [source],
      mimeType ? { type: mimeType } : undefined,
    );

  const fileReader = new FileReader();
  return new Promise((resolve, reject) => {
    fileReader.onloadend = () => {
      if (typeof fileReader.result === "string") resolve(fileReader.result);
      else reject(new Error("Failed to convert to data URL"));
    };
    fileReader.onerror = () => reject(fileReader.error);
    fileReader.readAsDataURL(blob);
  });
};

const arrayCompare = (a: any, b: any): number => {
  if (Array.isArray(a) && Array.isArray(b)) return array.compare(a, b);
  if (typeof a === "number" && typeof b === "number") {
    return (a === b ? 0 : +(a > b) - 1 || 1) as -1 | 0 | 1;
  }

  const _a = String(a);
  const _b = String(b);

  return (_a === _b ? 0 : +(_a > _b) - 1 || 1) as -1 | 0 | 1;
};

export const array: ArrayUtils = {
  append: <T extends unknown[], Appended>(
    target: T,
    ...sources: Appended[][]
  ): [...T, ...Appended[]] => {
    const result = target as unknown as [...T, ...Appended[]];
    for (const source of sources) result.push(...source);
    return result;
  },
  compare: <T, U>(a: T[], b: U[], compareFn = arrayCompare): -1 | 0 | 1 => {
    if (a.length < b.length) return -1;
    if (b.length < a.length) return 1;
    for (let i = 0; i < a.length; i++) {
      const result = compareFn(a[i], b[i]);
      if (result) return result < 0 ? -1 : 1;
    }

    return 0;
  },
  padStart: (value, length, padWith = 0) => {
    while (value.length < length) value.unshift(padWith as any);
    return value;
  },
  padEnd: (value, length, padWith = 0) => {
    while (value.length < length) value.push(padWith as any);
    return value;
  },
  toReversed: (value) => [...value].reverse(),
};

export const object: ObjectUtils = {
  omit: <T extends {}, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
    const result = {} as Omit<T, K>;
    const toOmit = new Set(keys);
    for (const [key, value] of Object.entries(obj)) {
      if (toOmit.has(key as K)) continue;
      result[key as Exclude<keyof T, K>] = value as T[Exclude<keyof T, K>];
    }
    return result;
  },
  pick: <T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
    const result = {} as Pick<T, K>;
    for (const key of keys) result[key] = obj[key];
    return result;
  },
  merge: (...sources: any[]) => Object.assign({}, ...sources),
  mergeInto: (...sources: any[]) => Object.assign(sources[0], ...sources),
};

export const string: StringUtils = {
  reverse: (inputStr) => inputStr.split("").reverse().join(""),
  substitute: (inputStr, substitionMap) => {
    const subPairs =
      substitionMap instanceof Map ? [...substitionMap] : Object.entries(substitionMap);
    return subPairs.reduce((acc, [key, value]) => acc.replaceAll(key, value), inputStr);
  },
};

export * from "./types.ts";
