const MIN_CHARACTERS_PER_LINE = 16;

/**
 * Justifies a line of text by distributing spaces evenly between words.
 *
 * @param line - Array of words to justify (each non-empty, each ≤ maxWidth characters)
 * @param width - Total width of all words of the line array
 * @param maxWidth - Maximum width the justified line should occupy (must be >= {@link MIN_CHARACTERS_PER_LINE})
 * @returns A fully justified text line (string) with maxWidth caracters long
 *
 * @throws {Error} If maxWidth < {@link MIN_CHARACTERS_PER_LINE}
 * @throws {Error} If any word is empty or longer than maxWidth
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
  const totalSpaces = maxWidth - width;
  const spacesBetweenWords = Math.floor(totalSpaces / (line.length - 1));
  const nbOfWordsWithMoreSpaces = totalSpaces % (line.length - 1);
  let justifiedLine: string = "";
  for (let i = 0; i < line.length; i++) {
    const word = line[i] as string;
    if (word.length === 0 || word.length > maxWidth)
      throw new Error(
        `Invalid word length: expected between 1 and ${maxWidth} characters, but received ${word.length}.`
      );
    justifiedLine =
      justifiedLine +
      word +
      (i === line.length - 1
        ? ""
        : " ".repeat(spacesBetweenWords) +
          (i + 1 <= nbOfWordsWithMoreSpaces ? " " : ""));
  }
  return justifiedLine;
};

/**
 * Left-justifies a line of text by placing single spaces between words and adding extra spaces to the end until maxWidth is reached.
 *
 * @param line - Array of words to left-justify (each non-empty, each ≤ maxWidth characters)
 * @param width - Total width of all words of the line array
 * @param maxWidth - Maximum width the justified line should occupy (must be >= {@link MIN_CHARACTERS_PER_LINE})
 * @returns A left-justified text line (string) with maxWidth caracters long
 *
 * @throws {Error} If maxWidth < {@link MIN_CHARACTERS_PER_LINE}
 * @throws {Error} If any word is empty or longer than maxWidth
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
  const totalSpaces = maxWidth - width;
  const extraSpaces = totalSpaces - (line.length - 1);
  let justifiedLine: string = "";
  for (let i = 0; i < line.length; i++) {
    const word = line[i] as string;
    if (word.length === 0 || word.length > maxWidth)
      throw new Error(
        `Invalid word length: expected between 1 and ${maxWidth} characters, but received ${word.length}.`
      );
    justifiedLine =
      justifiedLine +
      word +
      (i === line.length - 1 ? " ".repeat(extraSpaces) : " ");
  }
  return justifiedLine;
};

/**
 * Formats an array of words into justified lines.
 *
 * @param words - Array of words to justify (each non-empty, each ≤ maxWidth characters)
 * @param maxWidth - Maximum width each line should occupy (must be >= {@link MIN_CHARACTERS_PER_LINE})
 * @returns Array of justified text lines (string) with maxWidth caracters long
 *
 * @throws {Error} If maxWidth < {@link MIN_CHARACTERS_PER_LINE}
 * @throws {Error} If any word is empty or longer than maxWidth
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
  const justifiedLines: string[] = [];
  let currentLine: string[] = [];
  let currentWidth: number = 0;
  for (let i = 0; i < words.length; i++) {
    const word = words[i] as string;
    if (word.length === 0 || word.length > maxWidth)
      throw new Error(
        `Invalid word length: expected between 1 and ${maxWidth} characters, but received ${word.length}.`
      );
    const availableWidth = maxWidth - currentWidth;
    if (availableWidth > word.length + currentLine.length - 1) {
      currentLine.push(word);
      currentWidth += word.length;
    } else {
      if (currentLine.length === 1) {
        justifiedLines.push(
          leftJustifyLine(currentLine, currentWidth, maxWidth)
        );
      } else {
        justifiedLines.push(justifyLine(currentLine, currentWidth, maxWidth));
      }
      currentLine = [];
      currentLine.push(word);
      currentWidth = word.length;
    }
  }
  justifiedLines.push(leftJustifyLine(currentLine, currentWidth, maxWidth));
  return justifiedLines;
}

export { justifyLine, fullJustify, leftJustifyLine };
