import dotenv from "dotenv";
dotenv.config();

interface IEnvVariables {
  PORT: string;
  MONGODB_URI: string;
}

const checkEnv = (): IEnvVariables => {
  if (!process.env.PORT) {
    throw new Error("PORT is not defined");
  }
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined");
  }
  return {
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI,
  };
};

const checkedEnv = checkEnv();

export default checkedEnv;
