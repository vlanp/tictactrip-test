import type { Request } from "express";
import type {
  IBadRequestResponse,
  IOkResponse,
  ITypedResponse,
} from "../models/ITypedResponse.js";
import type { IToken } from "../models/IToken.js";
import { ZEmail } from "../models/IEmail.js";
import z from "zod/v4";
import { fetchToken } from "../services/token-handler.js";

const getToken = async (
  req: Request,
  res: ITypedResponse<IOkResponse<IToken>> | ITypedResponse<IBadRequestResponse>
) => {
  if (!req.body) {
    (res as ITypedResponse<IBadRequestResponse>).status(400).json({
      success: false,
      message: "Request body is missing.",
    });
    return;
  }
  const emailParseResult = ZEmail.safeParse(req.body);
  if (!emailParseResult.success) {
    (res as ITypedResponse<IBadRequestResponse>).status(400).json({
      success: false,
      message: z.prettifyError(emailParseResult.error),
    });
    return;
  }
  const email = emailParseResult.data.email;
  const token = await fetchToken(email);
  (res as ITypedResponse<IOkResponse<IToken>>).status(200).json({
    success: true,
    message: "Ok",
    data: { token },
  });
};

export { getToken };
