import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from "@jest/globals";
import {
  generateJustifiedText,
  getFormattingAllowed,
} from "../../src/services/formatter-services.js";
import {
  LINE_LENGTH,
  MAX_NUMBER_OF_WORDS_PER_DAY,
} from "../../src/config/config.js";
import {
  UserInfo,
  ZDbUserInfo,
  ZUserInfo,
  type IDbUserInfoDocument,
  type IUserInfo,
} from "../../src/models/user-info-models.js";
import mongoose, { Mongoose } from "mongoose";
import { faker } from "@faker-js/faker";
import { zocker } from "zocker";
import checkedEnv from "../../src/utils/check-env.js";
import { fullJustify } from "../../src/utils/text-formatter.js";

describe("getFormattingAllowed", () => {
  const dbUserInfoZock0 = zocker(ZDbUserInfo)
    .setSeed(123)
    .supply(ZDbUserInfo.shape._id, new mongoose.Types.ObjectId());

  describe("given that the wordsUpdatedAt is today", () => {
    const dbUserInfoZock = dbUserInfoZock0.supply(
      ZDbUserInfo.shape.wordsUpdatedAt,
      new Date()
    );
    it("should return true when input words + words already used is within daily limit", async () => {
      const words = ["hello", "world"];
      const dbUserInfo = dbUserInfoZock
        .supply(
          ZDbUserInfo.shape.words,
          faker.number.int({
            min: 0,
            max: MAX_NUMBER_OF_WORDS_PER_DAY - words.length - 1,
          })
        )
        .generate();

      const result = await getFormattingAllowed(words, dbUserInfo);
      expect(result).toBe(true);
    });

    it("should return false when input words + words already used would exceed daily limit", async () => {
      const words = Array<string>(1000).fill("word");
      const dbUserInfo = dbUserInfoZock
        .supply(
          ZDbUserInfo.shape.words,
          faker.number.int({
            min: MAX_NUMBER_OF_WORDS_PER_DAY - words.length + 1,
            max: MAX_NUMBER_OF_WORDS_PER_DAY,
          })
        )
        .generate();
      const result = await getFormattingAllowed(words, dbUserInfo);

      expect(result).toBe(false);
    });

    it("should return true when input words + words already used exactly equals remaining daily limit", async () => {
      const words = Array(1000).fill("word");
      const dbUserInfo = dbUserInfoZock
        .supply(
          ZDbUserInfo.shape.words,
          MAX_NUMBER_OF_WORDS_PER_DAY - words.length
        )
        .generate();
      const result = await getFormattingAllowed(words, dbUserInfo);

      expect(result).toBe(true);
    });

    it("should return true when there is no input words and the daily limit has not been reached already", async () => {
      const words: string[] = [];
      const dbUserInfo = dbUserInfoZock
        .supply(
          ZDbUserInfo.shape.words,
          faker.number.int({
            min: 0,
            max: MAX_NUMBER_OF_WORDS_PER_DAY,
          })
        )
        .generate();

      const result = await getFormattingAllowed(words, dbUserInfo);

      expect(result).toBe(true);
    });

    it("should return false when there is no input words and the daily limit has been reached already", async () => {
      const words: string[] = [];
      const dbUserInfo = dbUserInfoZock
        .supply(ZDbUserInfo.shape.words, MAX_NUMBER_OF_WORDS_PER_DAY + 1)
        .generate();

      const result = await getFormattingAllowed(words, dbUserInfo);

      expect(result).toBe(false);
    });
  });

  describe("given that the wordsUpdatedAt is not today", () => {
    const dbUserInfoZock = dbUserInfoZock0.supply(
      ZDbUserInfo.shape.wordsUpdatedAt,
      new Date(2018, 8, 22, 15, 0, 0)
    );

    it("should return true when input words is within daily limit, even if input words + words already used is not", async () => {
      const words = ["hello", "world"];
      const dbUserInfo = dbUserInfoZock
        .supply(ZDbUserInfo.shape.words, MAX_NUMBER_OF_WORDS_PER_DAY + 1)
        .generate();

      const result = await getFormattingAllowed(words, dbUserInfo);
      expect(result).toBe(true);
    });

    it("should return false when input words is not within daily limit", async () => {
      const words = Array<string>(MAX_NUMBER_OF_WORDS_PER_DAY + 1).fill("word");
      const dbUserInfo = dbUserInfoZock
        .supply(ZDbUserInfo.shape.words, 0)
        .generate();

      const result = await getFormattingAllowed(words, dbUserInfo);
      expect(result).toBe(false);
    });
  });
});

describe("generateJustifiedText", () => {
  let connection: Mongoose;

  beforeAll(async () => {
    connection = await mongoose.connect(checkedEnv.MONGODB_URI, {
      dbName: checkedEnv.TEST_DB_NAME,
    });
    await UserInfo.deleteMany({});
  });

  beforeEach(async () => {
    await UserInfo.deleteMany({});
  });

  afterAll(async () => {
    await UserInfo.deleteMany({});
    await connection.disconnect();
  });

  const userInfoZock = zocker(ZUserInfo)
    .setSeed(123)
    .supply(ZUserInfo.shape.words, 20);

  it("should update dbUserInfo and return a valid IJustifiedText object", async () => {
    const userInfo = userInfoZock
      .supply(ZUserInfo.shape.wordsUpdatedAt, new Date())
      .generate();
    const newUserInfo: IDbUserInfoDocument = new UserInfo<IUserInfo>(userInfo);

    const words = Array<string>(
      faker.number.int({
        min: 1,
        max: MAX_NUMBER_OF_WORDS_PER_DAY,
      })
    ).fill("words");
    const wordsLeft =
      MAX_NUMBER_OF_WORDS_PER_DAY - (newUserInfo.words + words.length);
    const beforeDate = new Date();
    const result = await generateJustifiedText(words, newUserInfo);
    const afterDate = new Date();
    expect(result).toEqual({
      justifiedText: fullJustify(words, LINE_LENGTH).join(""),
      wordsUsed: words.length,
      wordsLeft: wordsLeft,
    });
    const dbUserInfo = await UserInfo.findOne({
      email: newUserInfo.email,
    }).lean();
    expect(dbUserInfo?.email).toBe(newUserInfo.email);
    expect(dbUserInfo?.token).toBe(newUserInfo.token);
    expect(dbUserInfo?.words).toBe(MAX_NUMBER_OF_WORDS_PER_DAY - wordsLeft);
    expect(dbUserInfo?.wordsUpdatedAt.getTime()).toBeGreaterThanOrEqual(
      beforeDate.getTime()
    );
    expect(dbUserInfo?.wordsUpdatedAt.getTime()).toBeLessThanOrEqual(
      afterDate.getTime()
    );
  });

  it("should update dbUserInfo and return a valid IJustifiedText object", async () => {
    const d = new Date();
    d.setDate(d.getDate() - 5);
    const userInfo = userInfoZock
      .supply(ZUserInfo.shape.wordsUpdatedAt, d)
      .generate();
    const newUserInfo: IDbUserInfoDocument = new UserInfo<IUserInfo>(userInfo);

    const words = Array<string>(
      faker.number.int({
        min: 1,
        max: MAX_NUMBER_OF_WORDS_PER_DAY,
      })
    ).fill("words");
    const wordsLeft = MAX_NUMBER_OF_WORDS_PER_DAY - words.length;
    const beforeDate = new Date();
    const result = await generateJustifiedText(words, newUserInfo);
    const afterDate = new Date();
    expect(result).toEqual({
      justifiedText: fullJustify(words, LINE_LENGTH).join(""),
      wordsUsed: words.length,
      wordsLeft: wordsLeft,
    });
    const dbUserInfo = await UserInfo.findOne({
      email: newUserInfo.email,
    }).lean();
    expect(dbUserInfo?.email).toBe(newUserInfo.email);
    expect(dbUserInfo?.token).toBe(newUserInfo.token);
    expect(dbUserInfo?.words).toBe(MAX_NUMBER_OF_WORDS_PER_DAY - wordsLeft);
    expect(dbUserInfo?.wordsUpdatedAt.getTime()).toBeGreaterThanOrEqual(
      beforeDate.getTime()
    );
    expect(dbUserInfo?.wordsUpdatedAt.getTime()).toBeLessThanOrEqual(
      afterDate.getTime()
    );
  });
});
