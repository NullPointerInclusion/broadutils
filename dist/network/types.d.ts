export type AugumentedHeaders = Headers & Pick<Response, "ok" | "status" | "statusText">;
export type FetchParams = [input: string | URL | Request, init?: RequestInit];
export type ExtendedFetch = ((...params: FetchParams) => Promise<Response>) & {
    ok: (...params: FetchParams) => Promise<Response & {
        ok: true;
    }>;
    arraybuffer: (...params: FetchParams) => Promise<ArrayBuffer>;
    blob: (...params: FetchParams) => Promise<Blob>;
    bytes: (...params: FetchParams) => Promise<Uint8Array<ArrayBuffer>>;
    headers: (...params: FetchParams) => Promise<AugumentedHeaders>;
    json: <T = unknown>(...params: FetchParams) => Promise<T>;
    stream: (...params: FetchParams) => Promise<ReadableStream<Uint8Array<ArrayBuffer>>>;
    text: (...params: FetchParams) => Promise<string>;
    audio: (...params: FetchParams) => Promise<HTMLAudioElement>;
    image: (...params: FetchParams) => Promise<HTMLImageElement>;
    video: (...params: FetchParams) => Promise<HTMLVideoElement>;
};
export type LoadMetadata = <T extends HTMLMediaElement>(mediaElement: T) => Promise<T>;
//# sourceMappingURL=types.d.ts.map