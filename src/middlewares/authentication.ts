import type { NextFunction } from "express";
import type {
  ITypedResponse,
  IUnauthorizedResponse,
} from "../models/typed-response-models.js";
import { UserInfo } from "../models/user-info-models.js";
import type { IAuthenticatedRequest } from "../models/authenticated-request-models.js";

/**
 * Return next() if the parameter req contains a Bearer token in req.headers.authorization and this token correspond to a user in the database.
 * Use as a middleware with express package, next() make the code continue to the next middleware.
 * The userInfo found in the database is added to req.user and can be access in the next middleware.
 * Return undefined if there is no valid Bearer token in the req, and respond to the client.
 *
 * @param req The object that contains all the datas and information about the request send to the express route.
 * @param res The object that allows to respond to the request send to the express route.
 * @param next The function that allows to go to the next middleware when it is returned.
 * @return next() if there is a valid Bearer token in the req parameter and undefined if not.
 */
const isAuthenticated = async (
  req: IAuthenticatedRequest,
  res: ITypedResponse<IUnauthorizedResponse>,
  next: NextFunction
) => {
  if (!req.headers || !req.headers.authorization) {
    res.status(401).json({
      success: false,
      message: "No token found in the request. Unauthorized access.",
    });
    return;
  }
  const token = req.headers.authorization.replace("Bearer ", "");
  const dbUserInfo = await UserInfo.findOne({
    token,
  });

  if (!dbUserInfo) {
    res.status(401).json({
      success: false,
      message: "No user found for the provided token. Unauthorized access.",
    });
    return;
  }
  req.dbUserInfo = dbUserInfo;

  return next();
};

export { isAuthenticated };
