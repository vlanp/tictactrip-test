import { v4 as uuidv4 } from "uuid";
import { UserInfo, type IUserInfo } from "../models/user-info-models.js";

const fetchToken = async (email: string) => {
  let dbUserInfo = await UserInfo.findOne({ email });
  if (dbUserInfo) return dbUserInfo.token;
  while (true) {
    const token = uuidv4();
    dbUserInfo = await UserInfo.findOne({ token });
    if (dbUserInfo) continue;
    const newUserInfo = new UserInfo<IUserInfo>({
      email,
      token,
      words: 0,
      wordsUpdatedAt: new Date(),
    });
    const addedUserInfo = await newUserInfo.save();
    return addedUserInfo.token;
  }
};

export { fetchToken };
