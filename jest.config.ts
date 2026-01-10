import type { Config } from "jest";

export default {
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  transform: {
    "^.+\\.(t|j)sx?$": [
      "@swc/jest",
      {
        //...other `ts-jest` options
      },
    ],
  },
  testMatch: ["**/tests/**/*.test.js"],
  preset: "@shelf/jest-mongodb",
} satisfies Config;
