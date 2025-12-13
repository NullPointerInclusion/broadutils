import { assert } from "../validate/validate.js";
const loadMetadata = (mediaElement) => new Promise((resolve, reject) => {
    const cleanup = (...args) => {
        mediaElement.onloadedmetadata = mediaElement.onerror = null;
        return null;
    };
    mediaElement.onloadedmetadata = () => cleanup(resolve(mediaElement));
    mediaElement.onerror = () => cleanup(reject(new Error("Failed to load metadata")));
});
export const fetch = Object.assign((...params) => globalThis.fetch(...params), {
    ok: async (...params) => {
        const response = await fetch(...params);
        assert.true(response.ok, "The response was not okay.");
        return response;
    },
    arraybuffer: async (...params) => {
        const response = await fetch.ok(...params);
        return response.arrayBuffer();
    },
    blob: async (...params) => {
        const response = await fetch.ok(...params);
        return response.blob();
    },
    bytes: async (...params) => {
        const response = await fetch.ok(...params);
        return response.bytes();
    },
    headers: async (...params) => {
        const response = await fetch(...params);
        return Object.assign(response.headers, {
            ok: response.ok,
            status: response.status,
            statusText: response.statusText,
        });
    },
    json: async (...params) => {
        const response = await fetch.ok(...params);
        return response.json();
    },
    stream: async (...params) => {
        const response = await fetch.ok(...params);
        const body = response.body;
        if (!body)
            throw new Error("No response body.");
        return body;
    },
    text: async (...params) => {
        const response = await fetch.ok(...params);
        return response.text();
    },
    audio: async (...params) => {
        const blob = await fetch.blob(...params);
        const audio = new Audio();
        audio.src = URL.createObjectURL(blob);
        return loadMetadata(audio);
    },
    image: async (...params) => {
        const blob = await fetch.blob(...params);
        const url = URL.createObjectURL(blob);
        const image = document.createElement("img");
        image.src = url;
        await image.decode();
        URL.revokeObjectURL(url);
        return image;
    },
    video: async (...params) => {
        const blob = await fetch.blob(...params);
        const video = document.createElement("video");
        video.src = URL.createObjectURL(blob);
        return loadMetadata(video);
    },
});
export * from "./types.js";
//# sourceMappingURL=network.js.map