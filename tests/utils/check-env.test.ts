import {
  afterAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import { checkEnv, ZEnvVariables } from "../../src/utils/check-env.js";
import { zocker } from "zocker";

describe("checkEnv", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  const envVariables = zocker(ZEnvVariables).generate();
  const entries = Object.entries(envVariables);

  it("should return environment variables when all are defined", () => {
    for (let entry of entries) {
      process.env[entry[0]] = entry[1];
    }

    expect(checkEnv()).toEqual(envVariables);
  });

  for (let entry of entries) {
    it("should throw an error if a variable is missing", () => {
      delete process.env[entry[0]];
      expect(checkEnv).toThrow(Error);
    });
  }

  it("should throw an error if no variable is defined", () => {
    for (let entry of entries) {
      delete process.env[entry[0]];
    }

    expect(checkEnv).toThrow();
  });
});
