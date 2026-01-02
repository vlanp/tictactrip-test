const justifyLine = (line: string[], width: number, maxWidth: number) => {
  const totalSpaces = maxWidth - width;
  const spacesBetweenWords = Math.floor(totalSpaces / (line.length - 1));
  const nbOfWordsWithMoreSpaces = totalSpaces % (line.length - 1);
  let justifiedLine: string = "";
  for (let i = 0; i < line.length; i++) {
    const currentLineWord = line[i] as string;
    justifiedLine =
      justifiedLine +
      currentLineWord +
      (i === line.length - 1
        ? ""
        : " ".repeat(spacesBetweenWords) +
          (i + 1 <= nbOfWordsWithMoreSpaces ? " " : ""));
  }
  return justifiedLine;
};

const leftJustifyLine = (line: string[], width: number, maxWidth: number) => {
  const totalSpaces = maxWidth - width;
  const endSpaces = totalSpaces - (line.length - 1);
  let justifiedLine: string = "";
  for (let i = 0; i < line.length; i++) {
    const currentLineWord = line[i] as string;
    justifiedLine =
      justifiedLine +
      currentLineWord +
      (i === line.length - 1 ? " ".repeat(endSpaces) : " ");
  }
  return justifiedLine;
};

function fullJustify(words: string[], maxWidth: number): string[] {
  const justifiedLinesContainer: string[] = [];
  let currentLine: string[] = [];
  let currentWidth: number = 0;
  for (let i = 0; i < words.length; i++) {
    const word = words[i] as string;
    let wordAdded = false;
    if (word.length === 0 || word.length > maxWidth)
      throw new Error("The word as an incorrect length");
    const availableWidth = maxWidth - currentWidth;
    if (availableWidth > word.length + currentLine.length - 1) {
      currentLine.push(word);
      currentWidth += word.length;
      wordAdded = true;
    } else {
      if (currentLine.length === 1) {
        justifiedLinesContainer.push(
          leftJustifyLine(currentLine, currentWidth, maxWidth)
        );
      } else {
        justifiedLinesContainer.push(
          justifyLine(currentLine, currentWidth, maxWidth)
        );
      }
      currentLine = [];
      currentLine.push(word);
      currentWidth = word.length;
    }
  }
  justifiedLinesContainer.push(
    leftJustifyLine(currentLine, currentWidth, maxWidth)
  );
  return justifiedLinesContainer;
}

fullJustify(
  ["This", "is", "an", "example", "of", "text", "justification."],
  16
);
