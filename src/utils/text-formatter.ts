const MIN_CHARACTERS_PER_LINE = 16;
const LINE_BREAK_REGEX = /[\r\n]+/g;

/**
 * Extracts line break characters from a string and separates the text content.
 *
 * @param s - A string to clean up and extract line breaks from
 * @returns An object containing:
 *   - cleanWords: An array of word(s) without line break characters (empty array if only line breaks)
 *   - before: Line break characters at the very start (or undefined if none)
 *   - between: An array of line break sequences found between words (empty array if none)
 *   - after: Line break characters at the very end (or undefined if none)
 *
 * @example
 * extractLineBreak("\n\r\nfoo\r")
 * // Returns: {cleanWords: ["foo"], before: "\n\r\n", after: "\r", between: []}
 *
 * @example
 * extractLineBreak("foo\nbar\r\nbaz")
 * // Returns: {cleanWords: ["foo", "bar", "baz"], before: undefined, after: undefined, between: ["\n", "\r\n"]}
 *
 * @example
 * extractLineBreak("hello\nworld")
 * // Returns: {cleanWords: ["hello", "world"], before: undefined, after: undefined, between: ["\n"]}
 *
 * @example
 * extractLineBreak("\n\n\n")
 * // Returns: {cleanWords: [], before: "\n\n\n", after: undefined, between: []}
 */
const extractLineBreak = (s: string) => {
  const matchResult = Array.from(s.matchAll(LINE_BREAK_REGEX));
  const before =
    matchResult &&
    (matchResult[0]?.index === 0 ? matchResult[0][0] : undefined);
  const lastIndex = matchResult.length - 1;
  const between = matchResult
    .filter((v) => v.index !== 0 && v.index + v[0].length !== s.length)
    .map((v) => v[0]);
  const after =
    before && before.length === s.length
      ? undefined
      : matchResult &&
        matchResult[lastIndex] &&
        matchResult[lastIndex].index + matchResult[lastIndex][0].length ===
          s.length
      ? matchResult[lastIndex][0]
      : undefined;
  return {
    cleanWords: s.split(LINE_BREAK_REGEX).filter((v) => v.length > 0),
    before,
    after,
    between,
  };
};

/**
 * Justifies a line of text by distributing spaces evenly between words.
 *
 * @param line - Array of words to justify (each ≤ maxWidth characters)
 * @param width - Total width of all words of the line array
 * @param maxWidth - Maximum width the justified line should occupy (must be >= {@link MIN_CHARACTERS_PER_LINE})
 * @returns A fully justified text line (string) with maxWidth caracters long
 *
 * @throws {Error} If maxWidth < {@link MIN_CHARACTERS_PER_LINE}
 * @throws {Error} If any word is longer than maxWidth
 * @throws {Error} If width does not equal the total length of all words in the line array
 *
 * @example
 * justifyLine(['This', 'is', 'an'], 8, 16)
 * // Returns: "This    is    an"
 *
 * @remarks
 * - Extra spaces are added from left to right when even distribution isn't possible
 * - The last word never has trailing spaces
 */
const justifyLine = (line: string[], width: number, maxWidth: number) => {
  if (maxWidth < MIN_CHARACTERS_PER_LINE) {
    throw new Error(
      `Invalid minWidth: expected at least ${MIN_CHARACTERS_PER_LINE}.`
    );
  }
  const cleanLine = line.filter((v) => v.length > 0);
  let computedWidth = 0;
  const totalSpaces = maxWidth - width;
  const spacesBetweenWords = Math.floor(totalSpaces / (cleanLine.length - 1));
  const nbOfWordsWithMoreSpaces = totalSpaces % (cleanLine.length - 1);
  let justifiedLine: string = "";
  for (let i = 0; i < cleanLine.length; i++) {
    const word = cleanLine[i] as string;
    if (word.length > maxWidth)
      throw new Error(
        `Invalid word length: expected between 1 and ${maxWidth} characters, but received ${word.length}.`
      );
    computedWidth += word.length;
    justifiedLine =
      justifiedLine +
      word +
      (i === cleanLine.length - 1
        ? ""
        : " ".repeat(spacesBetweenWords) +
          (i + 1 <= nbOfWordsWithMoreSpaces ? " " : ""));
  }
  if (computedWidth !== width) {
    throw new Error(`Invalid width: expected ${computedWidth}.`);
  }
  return justifiedLine + "\r\n";
};

/**
 * Left-justifies a line of text by placing single spaces between words and adding extra spaces to the end until maxWidth is reached.
 *
 * @param line - Array of words to left-justify (each ≤ maxWidth characters)
 * @param width - Total width of all words of the line array
 * @param maxWidth - Maximum width the justified line should occupy (must be >= {@link MIN_CHARACTERS_PER_LINE})
 * @returns A left-justified text line (string) with maxWidth caracters long
 *
 * @throws {Error} If maxWidth < {@link MIN_CHARACTERS_PER_LINE}
 * @throws {Error} If any word is longer than maxWidth
 * @throws {Error} If width does not equal the total length of all words in the line array
 *
 * @example
 * leftJustifyLine(['This', 'is'], 6, 16)
 * // Returns: "This is         "
 */
const leftJustifyLine = (line: string[], width: number, maxWidth: number) => {
  if (maxWidth < MIN_CHARACTERS_PER_LINE) {
    throw new Error(
      `Invalid minWidth: expected at least ${MIN_CHARACTERS_PER_LINE}.`
    );
  }
  const cleanLine = line.filter((v) => v.length > 0);
  let computedWidth = 0;
  const totalSpaces = maxWidth - width;
  const extraSpaces = totalSpaces - (cleanLine.length - 1);
  let justifiedLine: string = "";
  for (let i = 0; i < cleanLine.length; i++) {
    const word = cleanLine[i] as string;
    if (word.length > maxWidth)
      throw new Error(
        `Invalid word length: expected between 1 and ${maxWidth} characters, but received ${word.length}.`
      );
    computedWidth += word.length;
    justifiedLine =
      justifiedLine +
      word +
      (i === cleanLine.length - 1 ? " ".repeat(extraSpaces) : " ");
  }
  if (computedWidth !== width) {
    throw new Error(`Invalid width: expected ${computedWidth}.`);
  }
  return justifiedLine + "\r\n";
};

/**
 * Formats an array of words into justified lines.
 *
 * @param words - Array of words to justify (each ≤ maxWidth characters)
 * @param maxWidth - Maximum width each line should occupy (must be >= {@link MIN_CHARACTERS_PER_LINE})
 * @returns Array of justified text lines (string) with maxWidth caracters long
 *
 * @throws {Error} If maxWidth < {@link MIN_CHARACTERS_PER_LINE}
 * @throws {Error} If any word is longer than maxWidth
 *
 * @example
 * fullJustify(['This', 'is', 'an', 'example', 'of', 'text', 'justification.'], 16)
 * // Returns: [
 * //   "This    is    an",
 * //   "example  of text",
 * //   "justification.  "
 * // ]
 *
 * @remarks
 * - Words are greedily packed into lines (fit as many words as possible per line)
 * - The last line is left-justified
 * - Lines with a single word are left-justified
 */
function fullJustify(words: string[], maxWidth: number): string[] {
  if (maxWidth < MIN_CHARACTERS_PER_LINE) {
    throw new Error(
      `Invalid minWidth: expected at least ${MIN_CHARACTERS_PER_LINE}.`
    );
  }
  const nonEmptyWords = words.filter((v) => v.length > 0);
  const justifiedLines: string[] = [];
  let currentLine: string[] = [];
  let currentWidth: number = 0;
  for (let i = 0; i < nonEmptyWords.length; i++) {
    const word = nonEmptyWords[i] as string;
    if (word.length > maxWidth)
      throw new Error(
        `Invalid word length: expected between 1 and ${maxWidth} characters, but received ${word.length}.`
      );
    const extractResult = extractLineBreak(word);
    if (extractResult.before) {
      justifiedLines.push(currentLine.join(" ") + extractResult.before);
      currentLine = [];
      currentWidth = 0;
    }
    for (let i = 0; i < extractResult.cleanWords.length; i++) {
      const cleanWord = extractResult.cleanWords[i] as string;
      const availableWidth = maxWidth - currentWidth;
      if (availableWidth > cleanWord.length + currentLine.length - 1) {
        currentLine.push(cleanWord);
        currentWidth += cleanWord.length;
      } else {
        if (currentLine.length === 1) {
          justifiedLines.push(
            leftJustifyLine(currentLine, currentWidth, maxWidth)
          );
        } else {
          justifiedLines.push(justifyLine(currentLine, currentWidth, maxWidth));
        }
        currentLine = [];
        currentLine.push(cleanWord);
        currentWidth = cleanWord.length;
      }
      if (
        i < extractResult.cleanWords.length - 1 &&
        extractResult.between.length > 0
      ) {
        justifiedLines.push(currentLine.join(" ") + extractResult.between[i]);
        currentLine = [];
        currentWidth = 0;
      }
    }
    if (
      extractResult.after ||
      (extractResult.cleanWords.length === 0 && extractResult.before)
    ) {
      justifiedLines.push(
        currentLine.join(" ") + (extractResult.after || extractResult.before)
      );
      currentLine = [];
      currentWidth = 0;
    }
  }
  justifiedLines.push(leftJustifyLine(currentLine, currentWidth, maxWidth));
  return justifiedLines;
}

export {
  justifyLine,
  fullJustify,
  leftJustifyLine,
  MIN_CHARACTERS_PER_LINE,
  extractLineBreak,
};
