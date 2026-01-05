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
export const { setImmediate, clearImmediate } = (() => {
    const immediateQueue = new Map();
    const channel = new MessageChannel();
    const dummyEntry = {
        callback: () => { },
        arguments: [],
        canceled: false,
    };
    const drainQueue = () => {
        const queue = [...immediateQueue.values()];
        immediateQueue.clear();
        awaitingDrain = false;
        for (let i = 0; i < queue.length; ++i) {
            const entry = queue[i];
            if (!entry || entry.canceled)
                continue;
            try {
                entry.callback(...entry.arguments);
            }
            catch (error) {
                console.log("An error occured whilst executing an immediate callback.");
                console.error(error);
            }
        }
        return null;
    };
    let awaitingDrain = false;
    let immediate = 0;
    channel.port2.onmessage = drainQueue;
    return {
        setImmediate: (callback, args = []) => {
            if (typeof callback !== "function")
                throw new TypeError("Invalid callback.");
            if (!Array.isArray(args))
                throw new TypeError("Invalid callback arguments.");
            const _immediate = immediate++;
            immediateQueue.set(_immediate, {
                callback,
                arguments: args,
                canceled: false,
            });
            if (!awaitingDrain) {
                channel.port1.postMessage(null);
                awaitingDrain = true;
            }
            return _immediate;
        },
        clearImmediate: (immediate) => {
            (immediateQueue.get(immediate) || dummyEntry).canceled = true;
            return null;
        },
    };
})();
export * from "./types.js";
//# sourceMappingURL=misc.js.map