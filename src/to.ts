import { FormRequest } from "./form";
import { JsonRequest } from "./json";
import { NextClientConfig } from "../dist/types/config";

export type TMethads =
  | "GET"
  | "HEAD"
  | "OPTIONS"
  | "POST"
  | "PUT"
  | "DELETE"
  | "PATCH";

export class ToPath {
  private path: string;
  private host: string;
  private init: RequestInit;
  private method: TMethads;
  private searchParams: URLSearchParams;
  private config?: NextClientConfig;

  /**
   * Constructor for ToPath.
   *
   * @param {string} path The path to the resource.
   * @param {string} host The host of the resource.
   * @param {RequestInit} init The request initialization options.
   * @param {TMethads} method The HTTP method to use.
   * @param {URLSearchParams} searchParams The search parameters to be sent with the request.
   */
  constructor(
    path: string,
    host: string,
    init: RequestInit,
    method: TMethads,
    searchParams: URLSearchParams,
    config?: NextClientConfig
  ) {
    this.path = path;
    this.host = host;
    this.init = init;
    this.method = method;
    this.searchParams = searchParams;
    this.config = config;
  }
  /**
   * Converts a JSON object into a FormData object.
   * Handles different data types such as string, string[], File, File[], and nested objects.
   *
   * @param {Record<string, any>} jsonObject The JSON object to be converted.
   * @param {FormData} [formData] Optional FormData object to append to (useful for recursion).
   * @param {string} [parentKey] Optional parent key for nested objects.
   * @returns {FormData} The FormData object.
   */
  private jsonToFormData(
    jsonObject: Record<string, any>,
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
   * Creates a new {@link FormRequest} instance with the given data as a form body.
   *
   * @template T The type of the data to be sent.
   * @param {T | Record<string, any>} data The data to be sent as a form body.
   * @returns {FormRequest} The FormRequest instance.
   */
  form<T>(data?: T | Record<string, any>) {
    const formData: FormData = data
      ? this.jsonToFormData(data as Record<string, any>)
      : new FormData();
    return new FormRequest(
      formData,
      this.path,
      this.host,
      this.init,
      this.method,
      this.searchParams,
      this.config
    );
  }
  /**
   * Creates a new {@link JsonRequest} instance with the given data as a JSON body.
   *
   * @template T The type of the data to be sent.
   * @param {T | Record<string, any>} data The data to be sent as a JSON body.
   * @returns {JsonRequest} The JsonRequest instance.
   */
  json<T>(data?: T | Record<string, any>) {
    return new JsonRequest(
      data as Record<string, any>,
      this.path,
      this.host,
      this.init,
      this.method,
      this.searchParams,
      this.config
    );
  }
  /**
   * Sends a HTTP request using the current path, host, and other settings.
   *
   * @template T The expected response type.
   * @param {RequestInit["headers"]} [headers] Optional custom headers to include in the request.
   * @param {RequestInit} [init] Optional custom initialization options for the request.
   * @returns {Promise<T>} A promise that resolves with the response data of type T.
   */
  async send<T>(headers?: RequestInit["headers"], init?: RequestInit) {
    const formData = new FormData();
    const request = new FormRequest(
      formData,
      this.path,
      this.host,
      this.init,
      this.method,
      this.searchParams,
      this.config
    );
    return await request.send<T>(headers, init);
  }
}
