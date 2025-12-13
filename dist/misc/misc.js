export const noop = (...args) => null;
export const createDeferred = async () => {
    const deferred = {
        promise: {},
        resolve: noop,
        reject: noop,
    };
    await new Promise((rresolved) => {
        deferred.promise = new Promise((resolve, reject) => {
            deferred.resolve = resolve;
            deferred.reject = reject;
            rresolved(null);
        });
    });
    return deferred;
};
export * from "./types.js";
//# sourceMappingURL=misc.js.map