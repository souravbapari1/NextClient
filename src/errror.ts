export class HttpError<T> extends Error {
  public statusCode: number;
  public response: T | string | object;

  constructor(statusCode: number, responseText: string | object) {
    // Add detailed message for better debugging
    super(
      `HTTP Error ${statusCode}: ${
        typeof responseText === "string"
          ? responseText
          : JSON.stringify(responseText)
      }`
    );
    this.statusCode = statusCode;
    this.response = responseText;

    // Ensure correct prototype chain
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
