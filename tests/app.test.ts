import { describe, expect, test } from "@jest/globals";
import request from "supertest";
import { app, errorHandler } from "../src/app.js";
import type {
  IInternalServerErrorResponse,
  INotFoundResponse,
} from "../src/models/typed-response-models.js";
import express from "express";

describe("Test the /*all path", () => {
  test("should respond with a 404 status code and a ITypedResponse<INotFoundResponse>", async () => {
    const response = await request(app).get("/foo");
    expect(response.statusCode).toBe(404);
    const body = response.body as INotFoundResponse;
    expect(body.success).toBe(false);
    expect(typeof body.message === "string").toBe(true);
  });
});

describe("Test the app errorHandler", () => {
  const app = express();
  app.use(express.json());
  app.use(express.text());
  const testErrorHandlerRoute = "/test-error-handler";
  app.get(testErrorHandlerRoute, () => {
    throw new Error();
  });
  const testHeadersSentRoute = "/test-headers-sent";
  const plainResponse = "Response...";
  app.get(testHeadersSentRoute, (_, res, next) => {
    res.status(200).send(plainResponse);
    throw new Error("Error after headers sent");
  });
  app.use(errorHandler);
  test("should respond with a 500 status code and a ITypedResponse<IInternalServerErrorResponse>", async () => {
    const response = await request(app).get(testErrorHandlerRoute);
    expect(response.statusCode).toBe(500);
    const body = response.body as IInternalServerErrorResponse;
    expect(body).toEqual({
      success: false,
      message: "Internal server error",
    });
  });
  test("should not modify response when headers are already sent", async () => {
    const response = await request(app).get(testHeadersSentRoute);
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe(plainResponse);
  });
});
