import type { Request } from "express";
import type { IDbUserInfoDocument } from "./user-info-models.js";

interface IAuthenticatedRequest extends Request {
  dbUserInfo?: IDbUserInfoDocument;
}

export type { IAuthenticatedRequest };
