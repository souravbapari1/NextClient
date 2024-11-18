"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NextClient = void 0;
const to_1 = require("./to");
class NextClient {
    baseUrl;
    init;
    searchParams;
    /**
     * Constructs an instance of NextClient with the specified base URL and optional request initialization parameters.
     *
     * @param baseUrl - The base URL for the API.
     * @param init - Optional request initialization parameters. Defaults to a GET method with no-store cache setting if not provided.
     */
    constructor(baseUrl, init) {
        this.baseUrl = baseUrl;
        this.init = init || {
            method: "GET",
            cache: "no-store",
        };
    }
    /**
     * Internal method to set query parameters.
     *
     * Creates a new URLSearchParams object, iterates over the given object of key-value pairs, and sets each key-value pair using the set() method. The value is converted to a string using the toString() method.
     *
     * @param params - An object of key-value pairs. The keys are the parameter names and the values are the parameter values.
     *
     * @returns The created URLSearchParams object. This object is returned for method chaining.
     */
    setSearchParams(params) {
        let searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            searchParams.set(key, value.toString());
        });
        return searchParams; // Return this for chaining
    }
    /**
     * Returns a ToPath object with the method set to "GET".
     *
     * @param path - The path for the request.
     * @param query - Optional query parameters. If not specified, an empty object is used.
     */
    get(path, query) {
        this.searchParams = this.setSearchParams(query ?? {});
        return new to_1.ToPath(path, this.baseUrl, this.init, "GET", this.searchParams);
    }
    /**
     * Returns a ToPath object with the method set to "POST".
     *
     * @param path - The path for the request.
     * @param query - Optional query parameters. If not specified, an empty object is used.
     */
    post(path, query) {
        this.searchParams = this.setSearchParams(query ?? {});
        return new to_1.ToPath(path, this.baseUrl, this.init, "POST", this.searchParams);
    }
    /**
     * Returns a ToPath object with the method set to "PUT".
     *
     * @param path - The path for the request.
     * @param query - Optional query parameters. If not specified, an empty object is used.
     */
    put(path, query) {
        this.searchParams = this.setSearchParams(query ?? {});
        return new to_1.ToPath(path, this.baseUrl, this.init, "PUT", this.searchParams);
    }
    /**
     * Returns a ToPath object with the method set to "PATCH".
     *
     * @param path - The path for the request.
     * @param query - Optional query parameters. If not specified, an empty object is used.
     */
    patch(path, query) {
        this.searchParams = this.setSearchParams(query ?? {});
        return new to_1.ToPath(path, this.baseUrl, this.init, "PATCH", this.searchParams);
    }
    /**
     * Returns a ToPath object with the method set to "DELETE".
     *
     * @param path - The path for the request.
     * @param query - Optional query parameters. If not specified, an empty object is used.
     */
    delete(path, query) {
        this.searchParams = this.setSearchParams(query ?? {});
        return new to_1.ToPath(path, this.baseUrl, this.init, "DELETE", this.searchParams);
    }
}
exports.NextClient = NextClient;
