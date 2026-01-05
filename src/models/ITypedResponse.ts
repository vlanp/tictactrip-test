import type { Send } from "express-serve-static-core";
import type { Response } from "express";

interface ITypedResponse<
  R extends IResBody<K>,
  K = R extends IResBody<infer U> ? U : never
> extends Response {
  json: Send<R, this>;
}
interface IResBody<K = undefined> {
  success: boolean;
  message: string;
  data?: K;
}

interface IInternalServerErrorResponse extends IResBody {
  success: false;
  message: "Internal server error";
}

interface IOkResponse<K> extends IResBody<K> {
  success: true;
  data: K;
}

interface IBadRequestResponse extends IResBody {
  success: false;
}

interface INotFoundResponse extends IResBody {
  success: false;
}

export type {
  ITypedResponse,
  IResBody,
  IInternalServerErrorResponse,
  IOkResponse,
  IBadRequestResponse,
  INotFoundResponse,
};
