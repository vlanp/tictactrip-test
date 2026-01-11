import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import type { Mongoose } from "mongoose";
import mongoose from "mongoose";
import checkedEnv from "../../src/utils/check-env.js";
import {
  UserInfo,
  ZUserInfo,
  type IDbUserInfoDocument,
} from "../../src/models/user-info-models.js";
import { zocker } from "zocker";

const seed = 123;

describe("fetchToken", () => {
  const documents: IDbUserInfoDocument[] = [];
  let connection: Mongoose;

  beforeAll(async () => {
    connection = await mongoose.connect(checkedEnv.MONGODB_URI, {
      dbName: checkedEnv.TEST_DB_NAME,
    });
  });

  afterAll(async () => {
    await connection.disconnect();
  });

  afterEach(async () => {
    for (const doc of documents) {
      await doc.deleteOne();
    }
    jest.unstable_unmockModule("uuid");
  });

  it("should create a user and return his token", async () => {
    const otherUserToken = "21ecc380-1435-4b50-8547-d9b799f35dbb";
    const userToken = "21ecc380-1435-4b50-8547-d9b799f35dbc";
    const mockedFunction = jest
      .fn()
      .mockReturnValueOnce(otherUserToken)
      .mockReturnValueOnce(userToken);
    jest.unstable_mockModule("uuid", () => ({
      v4: mockedFunction,
    }));
    const { fetchToken } = await import("../../src/services/token-services.js");
    const otherUserInfo = zocker(ZUserInfo)
      .setSeed(seed)
      .supply(ZUserInfo.shape.email, "otherUserEmail")
      .supply(ZUserInfo.shape.token, otherUserToken)
      .generate();
    const newOtherUserInfo = new UserInfo(otherUserInfo);
    await newOtherUserInfo.save();
    documents.push(newOtherUserInfo);
    const email = "userEmail";
    const result = await fetchToken(email);
    const dbUserInfo = await UserInfo.findOne({ email });
    dbUserInfo && documents.push(dbUserInfo);
    expect(result).toBe(dbUserInfo?.token);
    expect(result).toBe(userToken);
    expect(mockedFunction).toHaveBeenCalledTimes(2);
  });

  it("should return the token of an existing user", async () => {
    const userInfo = zocker(ZUserInfo).setSeed(seed).generate();
    const newUserInfo = new UserInfo(userInfo);
    await newUserInfo.save();
    documents.push(newUserInfo);
    const { fetchToken } = await import("../../src/services/token-services.js");
    const result = await fetchToken(newUserInfo.email);
    expect(result).toBe(newUserInfo.token);
  });
});
