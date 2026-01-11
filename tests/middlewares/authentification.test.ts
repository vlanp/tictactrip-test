import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
} from "@jest/globals";
import { zocker } from "zocker";
import {
  UserInfo,
  ZUserInfo,
  type IDbUserInfo,
  type IDbUserInfoDocument,
} from "../../src/models/user-info-models.js";
import type { Mongoose } from "mongoose";
import mongoose from "mongoose";
import checkedEnv from "../../src/utils/check-env.js";
import request from "supertest";
import express from "express";
import { isAuthenticated } from "../../src/middlewares/authentication.js";
import type { IAuthenticatedRequest } from "../../src/models/authenticated-request-models.js";

const seed = 345;

describe("The isAuthenticated middleware", () => {
  let connection: Mongoose;
  const documents: IDbUserInfoDocument[] = [];

  beforeAll(async () => {
    connection = await mongoose.connect(checkedEnv.MONGODB_URI, {
      dbName: checkedEnv.TEST_DB_NAME,
    });
  });

  afterEach(async () => {
    for (const doc of documents) {
      await doc.deleteOne();
    }
  });

  afterAll(async () => {
    await connection.disconnect();
  });

  const app = express();
  const route = "/authUser";
  app.get(route, isAuthenticated, (req: IAuthenticatedRequest, res) => {
    res.status(200).json({
      dbUserInfo: req.dbUserInfo,
    });
  });

  describe("given a valid Bearer token", () => {
    it("should add dbUserInfo to the request and return the next function", async () => {
      const userInfo = zocker(ZUserInfo).setSeed(seed).generate();
      const newUserInfo = new UserInfo(userInfo);
      await newUserInfo.save();
      documents.push(newUserInfo);
      const response = await request(app)
        .get(route)
        .auth(userInfo.token, { type: "bearer" });
      expect(response.statusCode).toBe(200);
      const dbUserInfo: IDbUserInfo = response.body.dbUserInfo;
      expect(dbUserInfo._id.toString()).toEqual(newUserInfo._id.toString());
      expect(dbUserInfo.__v).toEqual(newUserInfo.__v);
      expect(dbUserInfo.email).toBe(newUserInfo.email);
      expect(dbUserInfo.token).toBe(newUserInfo.token);
      expect(dbUserInfo.words).toBe(newUserInfo.words);
      expect(dbUserInfo.wordsUpdatedAt).toBe(
        newUserInfo.wordsUpdatedAt.toISOString()
      );
    });
  });

  describe("given no Bearer token were provided", () => {
    it("should respond a statusCode 401 with a ITypedResponse<IUnauthorizedResponse> and return undefined", async () => {
      const response = await request(app).get(route);
      expect(response.statusCode).toBe(401);
      expect(response.body.success).toBe(false);
      expect(typeof response.body.message).toBe("string");
    });
  });

  describe("given the provided Bearer token does not correspond to any user in db", () => {
    it("should respond a statusCode 401 with a ITypedResponse<IUnauthorizedResponse> and return undefined", async () => {
      const userInfo = zocker(ZUserInfo).setSeed(seed).generate();
      const response = await request(app)
        .get(route)
        .auth(userInfo.token, { type: "bearer" });
      expect(response.statusCode).toBe(401);
      expect(response.body.success).toBe(false);
      expect(typeof response.body.message).toBe("string");
    });
  });
});
