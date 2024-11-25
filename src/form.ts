import { HttpError } from "./errror";
import { TMethads } from "./to";

export class FormRequest {
  private formData: FormData;
  private path: string;
  private host: string;
  private init: RequestInit;
  private method: TMethads;
  private searchParams: URLSearchParams;
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
    searchParams: URLSearchParams
  ) {
    this.formData = formData;
    this.method = method;
    this.path = path;
    this.host = host;
    this.init = init;
    this.searchParams = searchParams;
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
    headers?: RequestInit["headers"],
    init?: RequestInit
  ): Promise<T> {
    const url = new URL(this.path, this.host);
    url.search = this.searchParams.toString();

    const response = await fetch(url, {
      ...this.init,
      ...init,
      headers: { ...this.init.headers, ...headers },
      method: this.method,
      body: this.method === "GET" ? null : this.formData,
    });

    if (!response.ok) {
      const errorText = await response.json().catch((_) => response.text());
      throw new HttpError(response.status, errorText);
    }

    const contentType = response.headers.get("Content-Type") || "";

    if (contentType.includes("application/json")) {
      return (await response.json()) as T;
    } else if (contentType.includes("text/") || contentType === "") {
      return (await response.text()) as T;
    } else {
      throw new Error(`Unsupported content type: ${contentType}`);
    }
  }
}
