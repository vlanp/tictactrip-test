import type { Config } from "jest";
import { TS_EXT_TO_TREAT_AS_ESM, ESM_TS_TRANSFORM_PATTERN } from "ts-jest";

export default {
  extensionsToTreatAsEsm: [...TS_EXT_TO_TREAT_AS_ESM],
  transform: {
    [ESM_TS_TRANSFORM_PATTERN]: [
      "ts-jest",
      {
        //...other `ts-jest` options
        useESM: true,
      },
    ],
  },
  testMatch: ["**/tests/**/*.test.js"],
  // preset: "@shelf/jest-mongodb",
} satisfies Config;
