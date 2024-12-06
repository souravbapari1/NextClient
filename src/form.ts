import { HttpError } from "./errror";
import { TMethads } from "./to";
import { NextClientConfig } from "../dist/types/config";

export class FormRequest {
  private formData: FormData;
  private path: string;
  private host: string;
  private init: RequestInit;
  private method: TMethads;
  private searchParams: URLSearchParams;
  private config?: NextClientConfig;
  /**
   * Constructor for FormRequest.
   * @param formData FormData to be sent
   * @param path URL path
   * @param host URL host
   * @param init Optional RequestInit object with settings
   * @param method TMethads value for the request method
   * @param searchParams URLSearchParams for query parameters
   */
  constructor(
    formData: FormData,
    path: string,
    host: string,
    init: RequestInit,
    method: TMethads,
    searchParams: URLSearchParams,
    config?: NextClientConfig
  ) {
    this.formData = formData;
    this.method = method;
    this.path = path;
    this.host = host;
    this.init = init;
    this.searchParams = searchParams;
    this.config = config;
  }
  /**
   * Append a file to the FormData.
   * @param key The key for the file
   * @param file The file to append
   * @returns A new FormRequest object with the appended file
   */
  append(key: string, file: string | Blob | File) {
    this.formData.append(key, file);
    return new FormRequest(
      this.formData,
      this.path,
      this.host,
      this.init,
      this.method,
      this.searchParams
    );
  }

  /**
   * Send the request and return the response body as T.
   * @param headers Additional headers to send with the request
   * @param init Additional settings to send with the request
   * @throws HttpError if the response status is an error
   * @throws Error if the response content type is unsupported
   */
  async send<T>(
    headers?: [string, string][] | Record<string, string>,
    init?: RequestInit
  ): Promise<{ statusCode: number; data: T }> {
    try {
      const url = new URL(this.path, this.host);
      url.search = this.searchParams.toString();

      const response = await fetch(url, {
        ...this.init,
        ...init,
        headers: { ...this.init.headers, ...headers },
        method: this.method,
        body: this.method === "GET" ? null : this.formData,
      });

      const statusCode = response.status;
      if (!response.ok) {
        let clonedResponse = response.clone();
        // Clone the response to allow multiple reads of its body
        let errorText: string | object;

        try {
          errorText = await clonedResponse.json();
        } catch (jsonError) {
          // If parsing as JSON fails, fallback to text
          errorText = await response.text();
        }

        throw new HttpError(response.status, errorText);
      }

      // Check the Content-Type header to determine how to parse the response
      const contentType = response.headers.get("Content-Type") || "";

      if (contentType.includes("application/json")) {
        // Parse response body as JSON
        const responseData: T = await response.json();
        return { statusCode, data: responseData };
      } else if (contentType.includes("text/") || contentType == "") {
        // Parse response body as text
        const responseData: T = (await response.text()) as T;
        return { statusCode, data: responseData };
      } else {
        // Handle unexpected content types
        throw new Error(`Unsupported content type: ${contentType}`);
      }
    } catch (error) {
      // Handle network errors or JSON parsing errors
      if (this.config?.debug) {
        if (error instanceof HttpError) {
          const url = new URL(this.path, this.host);
          url.search = this.searchParams.toString();
          console.log(
            "\n================= NEXT CLIENT DEBUG ================= \n"
          );
          console.log(`ENDPOINT: => ${url}`);
          console.log(`METHOD: => ${this.method} \n`);
          console.log(`PAYLOAD: =>`, this.formData);
          console.log(
            "\n------------------------------------------------------\n"
          );
          console.log(`STATUS CODE: => ${error.statusCode}`);
          console.debug("RESPONSE: =>", error.response);
          console.log(
            "\n------------------------------------------------------\n"
          );
        } else {
          console.log(
            "\n================= NEXT CLIENT DEBUG ================= \n"
          );
          console.error("Request failed:", error);
          console.log(
            "\n------------------------------------------------------\n"
          );
        }
      }
      throw error;
    }
  }
}
