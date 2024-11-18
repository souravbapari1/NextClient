"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonRequest = void 0;
const errror_1 = require("./errror");
class JsonRequest {
    formData;
    path;
    host;
    init;
    method;
    searchParams;
    /**
     * Constructor for JsonRequest.
     *
     * @param {Record<string, any>} formData JSON data to be sent in the request
     * @param {string} path URL path to send the request to
     * @param {string} host Host of the request
     * @param {RequestInit} init Request init options
     * @param {TMethads} method HTTP method to use
     * @param {URLSearchParams} searchParams URL search params
     */
    constructor(formData, path, host, init, method, searchParams) {
        this.formData = formData;
        this.method = method;
        this.path = path;
        this.host = host;
        this.init = init;
        this.searchParams = searchParams;
    }
    /**
     * Sends an HTTP request to the specified path and host with the provided headers and returns the response.
     *
     * @template T The expected response type.
     * @param {RequestInit["headers"]} [headers] Optional headers to include in the request, merged with default headers.
     * @returns {Promise<T>} A promise that resolves with the response data of type T.
     * @throws {HttpError} If the HTTP response status is not ok, throws an HttpError with the response status and error text.
     * @throws {Error} If the response content type is unsupported or if there is a network error.
     */
    async send(headers) {
        try {
            const url = new URL(this.path, this.host);
            url.search = this.searchParams.toString();
            const response = await fetch(url, {
                ...this.init,
                headers: {
                    "Content-Type": "application/json",
                    ...this.init.headers,
                    ...headers,
                },
                method: this.method,
                body: JSON.stringify(this.formData),
            });
            if (!response.ok) {
                // Try to parse the response as JSON
                let errorText;
                try {
                    errorText = await response.json();
                }
                catch (jsonError) {
                    // If parsing as JSON fails, fallback to text
                    errorText = await response.text();
                }
                throw new errror_1.HttpError(response.status, errorText);
            }
            // Check the Content-Type header to determine how to parse the response
            const contentType = response.headers.get("Content-Type") || "";
            if (contentType.includes("application/json")) {
                // Parse response body as JSON
                const responseData = await response.json();
                return responseData;
            }
            else if (contentType.includes("text/") || contentType == "") {
                // Parse response body as text
                const responseData = (await response.text());
                return responseData;
            }
            else {
                // Handle unexpected content types
                throw new Error(`Unsupported content type: ${contentType}`);
            }
        }
        catch (error) {
            // Handle network errors or JSON parsing errors
            if (error instanceof errror_1.HttpError) {
                console.error(`HTTP Error ${error.statusCode}:`, error.response);
            }
            else {
                console.error("Request failed:", error);
            }
            throw error;
        }
    }
}
exports.JsonRequest = JsonRequest;
