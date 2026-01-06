import type { Request } from "express";
import type { IDbUserInfoDocument } from "./user-info-models.js";

interface AuthenticatedRequest extends Request {
  dbUserInfo?: IDbUserInfoDocument;
}

export type { AuthenticatedRequest };
