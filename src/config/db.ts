import mongoose from "mongoose";
import checkedEnv from "../utils/check-env.js";

const connectDB = async () => {
  try {
    await mongoose.connect(checkedEnv.MONGODB_URI, {
      dbName: checkedEnv.DB_NAME,
    });
    console.log("MongoDB Connected");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

export { connectDB };
