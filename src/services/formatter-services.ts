import { LINE_LENGTH, MAX_NUMBER_OF_WORDS_PER_DAY } from "../config/config.js";
import type { IJustifiedText } from "../models/justified-text-models.js";
import {
  type IDbUserInfo,
  type IDbUserInfoDocument,
} from "../models/user-info-models.js";
import { datesInSameDay } from "../utils/date.js";
import { fullJustify } from "../utils/text-formatter.js";

const getFormattingAllowed = async (
  words: string[],
  dbUserInfo: IDbUserInfo
) => {
  const today = new Date();
  if (datesInSameDay(dbUserInfo.wordsUpdatedAt, today)) {
    return words.length <= MAX_NUMBER_OF_WORDS_PER_DAY - dbUserInfo.words
      ? true
      : false;
  } else return words.length <= MAX_NUMBER_OF_WORDS_PER_DAY ? true : false;
};

const generateJustifiedText = async (
  words: string[],
  dbUserInfo: IDbUserInfoDocument
): Promise<IJustifiedText> => {
  const today = new Date();
  const justifiedText = fullJustify(words, LINE_LENGTH);
  if (datesInSameDay(dbUserInfo.wordsUpdatedAt, today))
    dbUserInfo.words += words.length;
  else dbUserInfo.words = words.length;
  dbUserInfo.wordsUpdatedAt = today;
  await dbUserInfo.save();
  return {
    justifiedText: justifiedText.join(""),
    wordsUsed: words.length,
    wordsLeft: MAX_NUMBER_OF_WORDS_PER_DAY - dbUserInfo.words,
  };
};

export { generateJustifiedText, getFormattingAllowed };
