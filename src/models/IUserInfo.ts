import mongoose, { Types } from "mongoose";
import z from "zod/v4";

const ZUserInfo = z.strictObject({
  email: z.email(),
  token: z.uuidv4(),
  words: z.int().positive(),
});

type IUserInfo = z.infer<typeof ZUserInfo>;

const ZDbUserInfo = z.strictObject({
  ...ZUserInfo.shape,
  _id: z.instanceof(Types.ObjectId),
  createdAt: z.instanceof(Date),
  updatedAt: z.instanceof(Date),
  __v: z.number(),
});

type IDbUserInfo = z.infer<typeof ZDbUserInfo>;

const UserInfoSchema = new mongoose.Schema<IUserInfo>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    words: {
      type: Number,
      required: true,
    },
  },
  { _id: true }
);

const UserInfo = mongoose.model<IUserInfo>("UserInfo", UserInfoSchema);

export { ZUserInfo, ZDbUserInfo, UserInfoSchema, UserInfo };
export type { IUserInfo, IDbUserInfo };
