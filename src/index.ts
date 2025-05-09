// Interface definitions
/**
 * Configuration options for the NextClient.
 */
interface NextClientConfig {
  debug?: boolean; // Enable or disable debug mode
  baseUrl: string; // Base URL for API requests
  headers?: Record<string, string>; // Custom headers for requests
  prefix?: string; // Optional prefix for the request path
}

/**
 * Configuration options for requests made by NextClient.
 */
interface NextClientBodyConfig extends NextClientConfig {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"; // HTTP method
  path: string; // Request path
  query?: Record<string, string>; // Query parameters
}

/**
 * Configuration options for appending data to requests.
 */
interface NextBodyAppendConfig<T> extends NextClientBodyConfig {
  data: T | Record<string, any>; // Data to be sent in the request
  isForm: boolean; // Indicates if the data is form data
}

/**
 * Configuration options for executing requests.
 */
interface NextClientExecuterConfig<T> extends NextBodyAppendConfig<T> {
  url: URL; // Full URL for the request
  formData?: FormData; // FormData object if applicable
}

/**
 * Parameters for sending requests.
 */
interface ParamsSend {
  signal?: AbortSignal | null; // Abort signal for request cancellation
  credentials?: RequestCredentials | null; // Credentials mode for the request
  mode?: RequestMode | undefined; // Mode for the request
  referrerPolicy?: ReferrerPolicy; // Referrer policy for the request
}

// Base NextClient class
/**
 * A client for making API requests.
 */
export class NextClient {
  private config: NextClientConfig;

  /**
   * Initializes the NextClient with the provided configuration.
   * @param config - Configuration options for the client.
   */
  constructor(config: NextClientConfig) {
    this.config = config;
  }

  /**
   * Creates a request with the specified method and path.
   * @param method - HTTP method for the request.
   * @param path - Request path.
   * @param query - Optional query parameters.
   * @returns A NextClientBody instance for further configuration.
   */
  private createRequest(
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    path: string,
    query?: Record<string, any>
  ) {
    return new NextClientBody({
      ...this.config,
      method,
      path,
      query,
    });
  }

  /**
   * Sends a GET request.
   * @param path - Request path.
   * @param query - Optional query parameters.
   * @returns A NextClientBody instance for further configuration.
   */
  get(path: string, query?: Record<string, any>) {
    return this.createRequest("GET", path, query);
  }

  /**
   * Sends a POST request.
   * @param path - Request path.
   * @param query - Optional query parameters.
   * @returns A NextClientBody instance for further configuration.
   */
  post(path: string, query?: Record<string, any>) {
    return this.createRequest("POST", path, query);
  }

  /**
   * Sends a PUT request.
   * @param path - Request path.
   * @param query - Optional query parameters.
   * @returns A NextClientBody instance for further configuration.
   */
  put(path: string, query?: Record<string, any>) {
    return this.createRequest("PUT", path, query);
  }

  /**
   * Sends a PATCH request.
   * @param path - Request path.
   * @param query - Optional query parameters.
   * @returns A NextClientBody instance for further configuration.
   */
  patch(path: string, query?: Record<string, any>) {
    return this.createRequest("PATCH", path, query);
  }

  /**
   * Sends a DELETE request.
   * @param path - Request path.
   * @param query - Optional query parameters.
   * @returns A NextClientBody instance for further configuration.
   */
  delete(path: string, query?: Record<string, any>) {
    return this.createRequest("DELETE", path, query);
  }

  /**
   * Sends the request with the specified parameters.
   * @param params - Optional parameters for the request.
   * @returns A promise that resolves with the response data.
   */
  send<R>(params?: ParamsSend) {
    const parser = new Parser<NextClientBodyConfig>(
      {
        isForm: false,
        method: "GET",
        path: "",
        query: undefined,
        data: this.config,
        ...this.config,
      },
      params
    );
    return parser.exec<R>();
  }
}

// NextClientBody class
/**
 * Represents a body for a NextClient request.
 */
class NextClientBody {
  private config: NextClientBodyConfig;

  /**
   * Initializes the NextClientBody with the provided configuration.
   * @param config - Configuration options for the body.
   */
  constructor(config: NextClientBodyConfig) {
    this.config = config;
  }

  /**
   * Appends form data to the request.
   * @param data - Data to be sent as form data.
   * @returns A NextBodyAppend instance for further configuration.
   */
  form<T>(data: T | Record<string, any>) {
    return new NextBodyAppend<T>({
      ...this.config,
      data,
      isForm: true,
    });
  }

  /**
   * Appends JSON data to the request.
   * @param data - Data to be sent as JSON.
   * @returns A NextBodyAppend instance for further configuration.
   */
  json<T>(data: T | Record<string, any>) {
    return new NextBodyAppend<T>({
      ...this.config,
      data,
      isForm: false,
    });
  }

  /**
   * Sends the request with the specified parameters.
   * @param params - Optional parameters for the request.
   * @returns A promise that resolves with the response data.
   */
  send<R>(params?: ParamsSend) {
    const parser = new Parser(
      {
        isForm: true,
        query: this.config.query,
        data: undefined,
        ...this.config,
      },
      params
    );
    return parser.exec<R>();
  }
}

// NextBodyAppend class
/**
 * Represents a body append for a NextClient request.
 */
class NextBodyAppend<T> {
  private config: NextBodyAppendConfig<T>;

  /**
   * Initializes the NextBodyAppend with the provided configuration.
   * @param config - Configuration options for the body append.
   */
  constructor(config: NextBodyAppendConfig<T>) {
    this.config = config;
  }

  /**
   * Sets a key-value pair in the data.
   * @param key - The key to set.
   * @param value - The value to set.
   * @returns The current instance for method chaining.
   */
  set(key: string, value: string | Blob | File) {
    this.config.data = {
      ...this.config.data,
      [key]: value,
    };
    return this;
  }

  /**
   * Deletes a key from the data.
   * @param key - The key to delete.
   * @returns The current instance for method chaining.
   */
  delete(key: string) {
    let currentData: any = this.config.data;
    delete currentData[key as any];
    this.config.data = currentData;
    return this;
  }

  /**
   * Sets custom headers for the request.
   * @param headers - Headers to set.
   * @returns The current instance for method chaining.
   */
  headers<T>(headers: T | Record<string, string>) {
    this.config.headers = {
      ...this.config.headers,
      ...headers,
    };
    return this;
  }

  /**
   * Sends the request with the specified parameters.
   * @param params - Optional parameters for the request.
   * @returns A promise that resolves with the response data.
   */
  send<R>(params?: ParamsSend) {
    const parser = new Parser<T>(this.config, params);
    return parser.exec<R>();
  }
}

/**
 * Parser class for processing requests.
 */
class Parser<T> {
  private config: NextBodyAppendConfig<T>;
  private url: URL;
  private formData?: FormData;
  private params?: ParamsSend;

  /**
   * Initializes the Parser with the provided configuration.
   * @param config - Configuration options for the parser.
   * @param params - Optional parameters for the request.
   */
  constructor(config: NextBodyAppendConfig<T>, params?: ParamsSend) {
    this.config = config;
    const url = this.generateUrl();
    this.params = params;

    this.url = url;
    this.formData = this.config.isForm
      ? this.jsonToFormData(config.data)
      : undefined;
  }

  /**
   * Sets search parameters for the URL.
   * @param params - Parameters to set.
   * @param prefix - Optional prefix for the parameters.
   * @returns A URLSearchParams object.
   */
  private setSearchParams(
    params: { [key: string]: any },
    prefix = ""
  ): URLSearchParams {
    const searchParams = new URLSearchParams();

    const addParam = (key: string, value: any) => {
      if (typeof value === "object" && !Array.isArray(value)) {
        Object.entries(value).forEach(([nestedKey, nestedValue]) => {
          addParam(`${prefix}${key}[${nestedKey}]`, nestedValue);
        });
      } else {
        searchParams.set(prefix ? `${prefix}${key}` : key, value.toString());
      }
    };

    Object.entries(params).forEach(([key, value]) => addParam(key, value));

    return searchParams;
  }

  /**
   * Generates the full URL for the request.
   * @returns The generated URL.
   */
  private generateUrl() {
    const url = new URL(
      this.config.prefix
        ? `${this.config.prefix}/${this.config.path}`
        : this.config.path,
      this.config.baseUrl
    );
    url.search =
      (this.config.query &&
        this.setSearchParams(this.config.query).toString()) ||
      "";

    return url;
  }

  /**
   * Converts a JSON object to FormData.
   * @param jsonObject - The JSON object to convert.
   * @param formData - Optional FormData object to append to.
   * @param parentKey - Optional parent key for nested objects.
   * @returns The FormData object.
   */
  private jsonToFormData(
    jsonObject: any,
    formData: FormData = new FormData(),
    parentKey: string = ""
  ): FormData {
    for (const key in jsonObject) {
      if (jsonObject.hasOwnProperty(key)) {
        const value = jsonObject[key];
        const formKey = parentKey ? `${parentKey}[${key}]` : key;

        if (value instanceof File) {
          // Handle File
          const formKeyFile = parentKey || key;
          formData.append(formKeyFile, value);
        } else if (Array.isArray(value)) {
          // Handle arrays (including empty and single-value arrays)
          if (value.length === 0) {
            // Append an empty key for empty arrays
            formData.append(formKey, "");
          } else {
            value.forEach((item, index) => {
              const arrayKey = `${formKey}[${index}]`;
              if (item instanceof File) {
                formData.append(formKey, item);
              } else {
                formData.append(arrayKey, item?.toString() || "");
              }
            });
          }
        } else if (
          value &&
          typeof value === "object" &&
          !(value instanceof File)
        ) {
          // Handle nested objects
          this.jsonToFormData(value, formData, formKey);
        } else {
          // Handle primitive values (including null and undefined)
          formData.append(formKey, value?.toString() || "");
        }
      }
    }
    return formData;
  }

  /**
   * Executes the request and returns the response.
   * @returns A promise that resolves with the response data.
   */
  async exec<R>() {
    const executer = new Executer<T>({
      ...this.config,
      url: this.url,
      formData: this.formData,
    });
    return await executer.exec<R>();
  }
}

/**
 * Custom error class for API errors.
 */
export class NextApiError extends Error {
  public status: number; // HTTP status code
  public statusText: string; // HTTP status text
  public url: string; // URL of the request
  public response?: any; // Response data

  /**
   * Initializes the NextApiError with the provided details.
   * @param message - Error message.
   * @param status - HTTP status code.
   * @param statusText - HTTP status text.
   * @param url - URL of the request.
   * @param response - Optional response data.
   */
  constructor(
    message: string,
    status: number,
    statusText: string,
    url: string,
    response?: any
  ) {
    super(message);
    this.name = "NextApiError";
    this.status = status;
    this.statusText = statusText;
    this.url = url;
    this.response = {
      status: status,
      statusText: statusText,
      url: url,
      message: message,
      data: response,
    };
  }
}

/**
 * Handles errors from the NextClient.
 * @param error - The error to handle.
 * @param callback - Callback function to handle the error.
 * @param pass - Optional function to call if the error is not handled.
 */
export const handleNextError = <T>(
  error: any,
  callback: (e: {
    data?: Partial<T>;
    statusText: string;
    url: string;
    message: string;
  }) => void,
  pass?: () => void
) => {
  if (error instanceof NextApiError) {
    callback({
      data: (error.response?.data as Partial<T>) || {},
      statusText: error.statusText,
      url: error.url,
      message: error.message,
    });
  } else {
    pass?.();
  }
};

/**
 * Class for executing requests.
 */
class Executer<T> {
  private config: NextClientExecuterConfig<T>;
  private params?: ParamsSend;

  /**
   * Initializes the Executer with the provided configuration.
   * @param config - Configuration options for the executer.
   * @param params - Optional parameters for the request.
   */
  constructor(config: NextClientExecuterConfig<T>, params?: ParamsSend) {
    this.config = config;
    this.params = params;
  }

  /**
   * Fetches the response from the server.
   * @param params - Optional parameters for the request.
   * @returns A promise that resolves with the response.
   */
  private fetcher(params?: ParamsSend) {
    const { url, method, data, headers = {}, isForm, formData } = this.config;

    let body: BodyInit | null = null;
    const finalHeaders = { ...headers }; // Copy headers to avoid modifying original object

    if (method !== "GET") {
      if (isForm && formData) {
        body = formData; // Use FormData for form submissions
        // DO NOT set Content-Type for FormData explicitly; the browser sets it with correct boundary
        delete finalHeaders["Content-Type"];
      } else if (data) {
        body = JSON.stringify(data); // Convert JSON data to string
        finalHeaders["Content-Type"] =
          finalHeaders["Content-Type"] || "application/json";
      }
    }

    return fetch(url, {
      method,
      headers: finalHeaders,
      body,
      cache: "no-store",
      signal: params?.signal || null,
      credentials: params?.credentials || "same-origin",
      mode: params?.mode || "cors",
      referrerPolicy: params?.referrerPolicy || "no-referrer",
    });
  }

  /**
   * Executes the request and returns the response data.
   * @returns A promise that resolves with the response data.
   */
  async exec<R>(): Promise<{
    data: R | any;
    status: number;
    statusText: string;
    url: string;
    message?: string;
  }> {
    try {
      if (this.config.debug) {
        console.log(
          `Fetching: ${this.config.method} -> ${this.config.url.toString()}`
        );

        if (this.params) {
          console.log(this.params);
        }
      }

      const response = await this.fetcher(this.params);

      if (!response.ok) {
        let errorResponse;
        try {
          errorResponse = await response.json();
        } catch {
          try {
            errorResponse = await response.text();
          } catch (error) {}
        }

        throw new NextApiError(
          `HTTP Error: ${response.status} ${response.statusText}`,
          response.status,
          response.statusText,
          this.config.url.toString(),
          errorResponse
        );
      }

      try {
        const data = await response.json();
        return {
          data: data as R,
          status: response.status,
          statusText: response.statusText,
          url: this.config.url.toString(),
        };
      } catch {
        const data = await response.text();
        return {
          data: data as unknown as R,
          status: response.status,
          statusText: response.statusText,
          url: this.config.url.toString(),
        };
      }
    } catch (error) {
      throw error;
    }
  }
}
