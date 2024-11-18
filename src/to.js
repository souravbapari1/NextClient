"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToPath = void 0;
const form_1 = require("./form");
const json_1 = require("./json");
class ToPath {
    path;
    host;
    init;
    method;
    searchParams;
    /**
     * Constructor for ToPath.
     *
     * @param {string} path The path to the resource.
     * @param {string} host The host of the resource.
     * @param {RequestInit} init The request initialization options.
     * @param {TMethads} method The HTTP method to use.
     * @param {URLSearchParams} searchParams The search parameters to be sent with the request.
     */
    constructor(path, host, init, method, searchParams) {
        this.path = path;
        this.host = host;
        this.init = init;
        this.method = method;
        this.searchParams = searchParams;
    }
    /**
     * Converts a JSON object into a FormData object.
     *
     * @param {Record<string, any>} jsonObject The JSON object to be converted.
     * @param {{ [key: string]: string | number }} query The query string parameters.
     * @returns {FormData} The FormData object.
     */
    jsonToFormData(jsonObject, query) {
        const formData = new FormData();
        // Iterate over the keys of the JSON object
        for (const key in jsonObject) {
            if (jsonObject.hasOwnProperty(key)) {
                // Append each key-value pair to the FormData object
                formData.append(key, jsonObject[key]);
            }
        }
        return formData;
    }
    /**
     * Creates a new {@link FormRequest} instance with the given data as a form body.
     *
     * @template T The type of the data to be sent.
     * @param {T | Record<string, any>} data The data to be sent as a form body.
     * @returns {FormRequest} The FormRequest instance.
     */
    form(data) {
        const formData = this.jsonToFormData(data);
        return new form_1.FormRequest(formData, this.path, this.host, this.init, this.method, this.searchParams);
    }
    /**
     * Creates a new {@link JsonRequest} instance with the given data as a JSON body.
     *
     * @template T The type of the data to be sent.
     * @param {T | Record<string, any>} data The data to be sent as a JSON body.
     * @returns {JsonRequest} The JsonRequest instance.
     */
    json(data) {
        return new json_1.JsonRequest(data, this.path, this.host, this.init, this.method, this.searchParams);
    }
    /**
     * Sends a HTTP request using the current path, host, and other settings.
     *
     * @template T The expected response type.
     * @param {RequestInit["headers"]} [headers] Optional custom headers to include in the request.
     * @param {RequestInit} [init] Optional custom initialization options for the request.
     * @returns {Promise<T>} A promise that resolves with the response data of type T.
     */
    async send(headers, init) {
        const formData = new FormData();
        const request = new form_1.FormRequest(formData, this.path, this.host, this.init, this.method, this.searchParams);
        return await request.send(headers, init);
    }
}
exports.ToPath = ToPath;
