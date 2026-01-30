import { nonNullable } from "../validate/validate.js";
export const convertToDataUrl = async (source, mimeType) => {
    let blob;
    if (source instanceof Blob)
        blob = mimeType ? new Blob([source], { type: mimeType }) : source;
    else
        blob = new Blob(Array.isArray(source) ? source : [source], mimeType ? { type: mimeType } : undefined);
    const fileReader = new FileReader();
    return new Promise((resolve, reject) => {
        fileReader.onloadend = () => {
            if (typeof fileReader.result === "string")
                resolve(fileReader.result);
            else
                reject(new Error("Failed to convert to data URL"));
        };
        fileReader.onerror = () => reject(fileReader.error);
        fileReader.readAsDataURL(blob);
    });
};
const arrayCompare = (a, b) => {
    if (Array.isArray(a) && Array.isArray(b))
        return array.compare(a, b);
    if (typeof a === "number" && typeof b === "number") {
        return (a === b ? 0 : +(a > b) - 1 || 1);
    }
    const _a = String(a);
    const _b = String(b);
    return (_a === _b ? 0 : +(_a > _b) - 1 || 1);
};
export const array = {
    append: (target, ...sources) => {
        const result = target;
        for (const source of sources)
            result.push(...source);
        return result;
    },
    compare: (a, b, compareFn = arrayCompare) => {
        if (a.length < b.length)
            return -1;
        if (b.length < a.length)
            return 1;
        for (let i = 0; i < a.length; i++) {
            const result = compareFn(a[i], b[i]);
            if (result)
                return result < 0 ? -1 : 1;
        }
        return 0;
    },
    padStart: (value, length, padWith = 0) => {
        while (value.length < length)
            value.unshift(padWith);
        return value;
    },
    padEnd: (value, length, padWith = 0) => {
        while (value.length < length)
            value.push(padWith);
        return value;
    },
    toReversed: (value) => [...value].reverse(),
};
export const object = {
    omit: (obj, keys) => {
        const result = {};
        const toOmit = new Set(keys);
        for (const [key, value] of Object.entries(obj)) {
            if (toOmit.has(key))
                continue;
            result[key] = value;
        }
        return result;
    },
    pick: (obj, keys) => {
        const result = {};
        for (const key of keys)
            result[key] = obj[key];
        return result;
    },
    merge: (...sources) => Object.assign({}, ...sources),
    mergeInto: (...sources) => Object.assign(sources[0], ...sources),
};
export const string = {
    reverse: (inputStr) => inputStr.split("").reverse().join(""),
    substitute: (inputStr, substitionMap) => {
        const subPairs = substitionMap instanceof Map ? [...substitionMap] : Object.entries(substitionMap);
        return subPairs.reduce((acc, [key, value]) => acc.replaceAll(key, value), inputStr);
    },
};
export * from "./types.js";
//# sourceMappingURL=data.js.map