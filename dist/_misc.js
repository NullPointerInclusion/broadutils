/// <reference types="bun" />
import { open } from "node:fs/promises";
export const createReadStream = async function* (path, options) {
    const handle = await open(path);
    const stat = await handle.stat().catch((error) => {
        handle.close();
        throw error;
    });
    try {
        let offset = options?.offset ?? 0;
        let endOffset = options?.length == null ? stat.size : offset + Math.floor(options.length);
        let chunkSize = options?.chunkSize ?? 16384;
        while (offset < endOffset) {
            const readSize = Math.min(chunkSize, endOffset - offset);
            const chunk = await handle.read(Buffer.allocUnsafe(readSize), 0, readSize, offset);
            offset += chunk.bytesRead;
            yield chunk.buffer;
        }
    }
    finally {
        await handle.close();
    }
};
//# sourceMappingURL=_misc.js.map