"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpError = void 0;
class HttpError extends Error {
    statusCode;
    response;
    constructor(statusCode, responseText) {
        super(`HTTP Error: ${statusCode}`);
        this.statusCode = statusCode;
        this.response = responseText;
        // Set the prototype explicitly to preserve the correct instance type
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.HttpError = HttpError;
