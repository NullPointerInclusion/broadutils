import type { PathLike } from "node:fs";
interface CreateReadStreamOptions {
    offset?: number;
    length?: number;
    chunkSize?: number;
}
export declare const createReadStream: (path: PathLike, options?: CreateReadStreamOptions | undefined) => AsyncGenerator<Buffer<ArrayBuffer>, void, unknown>;
export {};
//# sourceMappingURL=_misc.d.ts.map