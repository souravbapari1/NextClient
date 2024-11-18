import { ToPath } from "./to";

export class NextClient {
  baseUrl: string;
  private init: RequestInit;
  private searchParams: URLSearchParams | undefined;
  /**
   * Constructs an instance of NextClient with the specified base URL and optional request initialization parameters.
   *
   * @param baseUrl - The base URL for the API.
   * @param init - Optional request initialization parameters. Defaults to a GET method with no-store cache setting if not provided.
   */
  constructor(baseUrl: string, init?: RequestInit) {
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
  private setSearchParams(params: { [key: string]: string | number }) {
    let searchParams: URLSearchParams = new URLSearchParams();
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
  get(path: string, query?: { [key: string]: string | number }) {
    this.searchParams = this.setSearchParams(query ?? {});
    return new ToPath(path, this.baseUrl, this.init, "GET", this.searchParams);
  }

  /**
   * Returns a ToPath object with the method set to "POST".
   *
   * @param path - The path for the request.
   * @param query - Optional query parameters. If not specified, an empty object is used.
   */
  post(path: string, query?: { [key: string]: string | number }) {
    this.searchParams = this.setSearchParams(query ?? {});
    return new ToPath(path, this.baseUrl, this.init, "POST", this.searchParams);
  }

  /**
   * Returns a ToPath object with the method set to "PUT".
   *
   * @param path - The path for the request.
   * @param query - Optional query parameters. If not specified, an empty object is used.
   */
  put(path: string, query?: { [key: string]: string | number }) {
    this.searchParams = this.setSearchParams(query ?? {});
    return new ToPath(path, this.baseUrl, this.init, "PUT", this.searchParams);
  }

  /**
   * Returns a ToPath object with the method set to "PATCH".
   *
   * @param path - The path for the request.
   * @param query - Optional query parameters. If not specified, an empty object is used.
   */
  patch(path: string, query?: { [key: string]: string | number }) {
    this.searchParams = this.setSearchParams(query ?? {});
    return new ToPath(
      path,
      this.baseUrl,
      this.init,
      "PATCH",
      this.searchParams
    );
  }

  /**
   * Returns a ToPath object with the method set to "DELETE".
   *
   * @param path - The path for the request.
   * @param query - Optional query parameters. If not specified, an empty object is used.
   */
  delete(path: string, query?: { [key: string]: string | number }) {
    this.searchParams = this.setSearchParams(query ?? {});
    return new ToPath(
      path,
      this.baseUrl,
      this.init,
      "DELETE",
      this.searchParams
    );
  }
}
