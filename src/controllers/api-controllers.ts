import type { Request } from "express";
import type {
  IBadRequestResponse,
  IOkResponse,
  IPaymentRequiredResponse,
  ITypedResponse,
} from "../models/typed-response-models.js";
import type { IToken } from "../models/token-models.js";
import { ZEmail } from "../models/email-models.js";
import z from "zod/v4";
import { fetchToken } from "../services/token-services.js";
import type { IJustifiedText } from "../models/justified-text-models.js";
import type { AuthenticatedRequest } from "../models/authenticated-request-models.js";
import {
  generateJustifiedText,
  getFormattingAllowed,
} from "../services/formatter-services.js";

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

const getJustifiedText = async (
  req: AuthenticatedRequest,
  res:
    | ITypedResponse<IOkResponse<IJustifiedText>>
    | ITypedResponse<IBadRequestResponse>
    | ITypedResponse<IPaymentRequiredResponse>
) => {
  const dbUserInfo = req.dbUserInfo;
  if (!dbUserInfo) {
    throw new Error("The authentication middleware must be applied beforehand");
  }
  if (!req.body) {
    (res as ITypedResponse<IBadRequestResponse>).status(400).json({
      success: false,
      message: "Request body is missing.",
    });
    return;
  }
  const text = req.body;
  if (typeof text !== "string") {
    (res as ITypedResponse<IBadRequestResponse>).status(400).json({
      success: false,
      message: "Request body should have a ContentType of text/plain.",
    });
    return;
  }
  const words = text.split(" ");
  const formattingAllowed = await getFormattingAllowed(words, dbUserInfo);
  if (!formattingAllowed) {
    (res as ITypedResponse<IPaymentRequiredResponse>).status(402).json({
      success: false,
      message: "Daily words limit reached. Payment is required to continue.",
    });
    return;
  }
  const justifiedText = await generateJustifiedText(words, dbUserInfo);
  (res as ITypedResponse<IOkResponse<IJustifiedText>>).status(200).json({
    success: true,
    message: "Ok",
    data: justifiedText,
  });
};

export { getToken, getJustifiedText };
