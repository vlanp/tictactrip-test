import dotenv from "dotenv";
import z from "zod/v4";
dotenv.config();

const ZEnvVariables = z.strictObject({
  PORT: z.string(),
  MONGODB_URI: z.string(),
  DB_NAME: z.string(),
  TEST_DB_NAME: z.string(),
});

type IEnvVariables = z.infer<typeof ZEnvVariables>;

const checkEnv = (): IEnvVariables => {
  if (!process.env.PORT) {
    throw new Error("PORT is not defined");
  }
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined");
  }
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined");
  }
  if (!process.env.DB_NAME) {
    throw new Error("DB_NAME is not defined");
  }
  if (!process.env.TEST_DB_NAME) {
    throw new Error("TEST_DB_NAME is not defined");
  }
  return {
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI,
    DB_NAME: process.env.DB_NAME,
    TEST_DB_NAME: process.env.TEST_DB_NAME,
  };
};

const checkedEnv = checkEnv();

export default checkedEnv;
export { checkEnv, ZEnvVariables };
