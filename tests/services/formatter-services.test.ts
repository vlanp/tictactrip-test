import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import { getFormattingAllowed } from "../../src/services/formatter-services.js";
import { MAX_NUMBER_OF_WORDS_PER_DAY } from "../../src/config/config.js";
import {
  UserInfo,
  ZDbUserInfo,
  ZUserInfo,
  type IUserInfo,
} from "../../src/models/user-info-models.js";
import { zocker } from "zocker";
import mongoose, { Mongoose } from "mongoose";
import { faker } from "@faker-js/faker";
import checkedEnv from "../../src/utils/check-env.js";

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

// describe("generateJustifiedText", () => {
//   let connection: Mongoose;

//   beforeAll(async () => {
//     connection = await mongoose.connect(checkedEnv.MONGODB_URI, {
//       dbName: checkedEnv.DB_NAME,
//     });
//   });

//   afterAll(async () => {
//     await connection.disconnect();
//   });

//   const userInfo = zocker(ZUserInfo)
//     .setSeed(123)
//     .supply(ZUserInfo.shape.words, 0)
//     .supply(ZUserInfo.shape.wordsUpdatedAt, new Date())
//     .generate();
//   const newUserInfo = new UserInfo<IUserInfo>(userInfo);
// });
