import { HttpError } from "./errror";
import { NextClient } from "./request";

export default NextClient;
export const isNextClientError = (error: unknown): boolean =>
  error instanceof HttpError ? true : false;
