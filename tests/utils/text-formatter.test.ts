import { LINE_LENGTH } from "../../src/config/config.js";
import {
  extractLineBreak,
  fullJustify,
  justifyLine,
  leftJustifyLine,
  MIN_CHARACTERS_PER_LINE,
} from "../../src/utils/text-formatter.js";
import { describe, expect, it } from "@jest/globals";

describe("extractLineBreak", () => {
  describe("given valid inputs", () => {
    it("should extract line breaks from both start and end", () => {
      const result = extractLineBreak("\n\r\nfoo\r");
      expect(result).toEqual({
        cleanWords: ["foo"],
        before: "\n\r\n",
        after: "\r",
        between: [],
      });
    });

    it("should extract line breaks only from the start", () => {
      const result = extractLineBreak("\n\nbar");
      expect(result).toEqual({
        cleanWords: ["bar"],
        before: "\n\n",
        after: undefined,
        between: [],
      });
    });

    it("should extract line breaks only from the end", () => {
      const result = extractLineBreak("baz\r\n");
      expect(result).toEqual({
        cleanWords: ["baz"],
        before: undefined,
        after: "\r\n",
        between: [],
      });
    });

    it("should handle a word with no line breaks", () => {
      const result = extractLineBreak("hello");
      expect(result).toEqual({
        cleanWords: ["hello"],
        before: undefined,
        after: undefined,
        between: [],
      });
    });

    it("should handle a single line break at the start", () => {
      const result = extractLineBreak("\nword");
      expect(result).toEqual({
        cleanWords: ["word"],
        before: "\n",
        after: undefined,
        between: [],
      });
    });

    it("should handle a single line break at the end", () => {
      const result = extractLineBreak("word\r");
      expect(result).toEqual({
        cleanWords: ["word"],
        before: undefined,
        after: "\r",
        between: [],
      });
    });

    it("should handle multiple different line break types", () => {
      const result = extractLineBreak("\r\n\ntest\n\r");
      expect(result).toEqual({
        cleanWords: ["test"],
        before: "\r\n\n",
        after: "\n\r",
        between: [],
      });
    });

    it("should handle an empty string", () => {
      const result = extractLineBreak("");
      expect(result).toEqual({
        cleanWords: [],
        before: undefined,
        after: undefined,
        between: [],
      });
    });

    it("should handle only line breaks", () => {
      const result = extractLineBreak("\n\r\n\r");
      expect(result).toEqual({
        cleanWords: [],
        before: "\n\r\n\r",
        after: undefined,
        between: [],
      });
    });

    it("should handle a single character with line breaks", () => {
      const result = extractLineBreak("\na\r");
      expect(result).toEqual({
        cleanWords: ["a"],
        before: "\n",
        after: "\r",
        between: [],
      });
    });

    it("should handle consecutive identical line breaks", () => {
      const result = extractLineBreak("\n\n\ntest\r\r\r");
      expect(result).toEqual({
        cleanWords: ["test"],
        before: "\n\n\n",
        after: "\r\r\r",
        between: [],
      });
    });

    it("should extract line break between two words", () => {
      const result = extractLineBreak("hello\r\n\rworld");
      expect(result).toEqual({
        cleanWords: ["hello", "world"],
        before: undefined,
        after: undefined,
        between: ["\r\n\r"],
      });
    });

    it("should handle line breaks at start and between words", () => {
      const result = extractLineBreak("\nfoo\rbar");
      expect(result).toEqual({
        cleanWords: ["foo", "bar"],
        before: "\n",
        after: undefined,
        between: ["\r"],
      });
    });

    it("should handle line breaks between words and at end", () => {
      const result = extractLineBreak("foo\nbar\r");
      expect(result).toEqual({
        cleanWords: ["foo", "bar"],
        before: undefined,
        after: "\r",
        between: ["\n"],
      });
    });

    it("should handle line breaks at start, between, and end", () => {
      const result = extractLineBreak("\rfoo\nbar\r\n");
      expect(result).toEqual({
        cleanWords: ["foo", "bar"],
        before: "\r",
        after: "\r\n",
        between: ["\n"],
      });
    });

    it("should handle multiple words separated by line breaks", () => {
      const result = extractLineBreak("one\ntwo\rthree");
      expect(result).toEqual({
        cleanWords: ["one", "two", "three"],
        before: undefined,
        after: undefined,
        between: ["\n", "\r"],
      });
    });
  });
});

describe("justifyLine", () => {
  describe("given valid inputs", () => {
    it("should justify a line with even space distribution", () => {
      const result = justifyLine(
        ["This", "is", "an"],
        8,
        MIN_CHARACTERS_PER_LINE
      );
      expect(result).toBe("This    is    an\r\n");
    });

    it("should justify a line with even space distribution", () => {
      const result = justifyLine(["This", "is"], 6, MIN_CHARACTERS_PER_LINE);
      expect(result).toBe("This          is\r\n");
    });

    it("should justify a line without extra spaces", () => {
      const result = justifyLine(["Hello", "my", "beloved", "world"], 19, 22);
      expect(result).toBe("Hello my beloved world\r\n");
    });

    it("should justify a line with uneven space distribution", () => {
      const result = justifyLine(["The", "quick", "brown"], 13, 20);
      expect(result).toBe("The    quick   brown\r\n");
    });

    it("should justify a line ignoring empty string", () => {
      const result = justifyLine(["The", "", "", "quick", "", "brown"], 13, 20);
      expect(result).toBe("The    quick   brown\r\n");
    });

    it("with no words should return an empty line", () => {
      const result = justifyLine([], 0, 20);
      expect(result).toBe("\r\n");
    });

    it("with a single word at maximum allowed length should return the word", () => {
      const word = "a".repeat(MIN_CHARACTERS_PER_LINE);
      const result = justifyLine(
        [word],
        MIN_CHARACTERS_PER_LINE,
        MIN_CHARACTERS_PER_LINE
      );
      expect(result).toBe(word + "\r\n");
    });
  });

  describe("given invalid maxWidth input", () => {
    it("which is less than MIN_CHARACTERS_PER_LINE should throw an Error", () => {
      expect(() =>
        justifyLine(["test"], 4, MIN_CHARACTERS_PER_LINE - 1)
      ).toThrow(Error);
    });

    it("which is 0 should throw an Error", () => {
      expect(() => justifyLine(["test"], 4, 0)).toThrow(Error);
    });

    it("which is negative should throw an Error", () => {
      expect(() => justifyLine(["test"], 4, -5)).toThrow(Error);
    });
  });

  describe("given an invalid word in the input array", () => {
    it("which is longer than maxWidth should throw an Error", () => {
      expect(() =>
        justifyLine(
          ["Hello", "a".repeat(MIN_CHARACTERS_PER_LINE + 1)],
          22,
          MIN_CHARACTERS_PER_LINE
        )
      ).toThrow(Error);
    });
  });

  describe("given an invalid width", () => {
    it("which does not equal the total length of all words in the input array should throw an Error", () => {
      expect(() => justifyLine(["Hello", "world"], 4, 20)).toThrow(Error);
    });
  });
});

describe("leftJustifyLine", () => {
  describe("given valid inputs", () => {
    it("should left justify a line", () => {
      const result = leftJustifyLine(
        ["This", "is", "an"],
        8,
        MIN_CHARACTERS_PER_LINE
      );
      expect(result).toBe("This is an      \r\n");
    });

    it("should left justify a line", () => {
      const result = leftJustifyLine(
        ["This", "is"],
        6,
        MIN_CHARACTERS_PER_LINE
      );
      expect(result).toBe("This is         \r\n");
    });

    it("should left justify a line without extra spaces", () => {
      const result = leftJustifyLine(
        ["Hello", "my", "beloved", "world"],
        19,
        22
      );
      expect(result).toBe("Hello my beloved world\r\n");
    });

    it("with no words should return an empty line", () => {
      const result = leftJustifyLine([], 0, 20);
      expect(result).toBe("\r\n");
    });

    it("with a single word at maximum allowed length should return the word", () => {
      const word = "a".repeat(MIN_CHARACTERS_PER_LINE);
      const result = leftJustifyLine(
        [word],
        MIN_CHARACTERS_PER_LINE,
        MIN_CHARACTERS_PER_LINE
      );
      expect(result).toBe(word + "\r\n");
    });
  });

  describe("given invalid maxWidth input", () => {
    it("which is less than MIN_CHARACTERS_PER_LINE should throw an Error", () => {
      expect(() =>
        leftJustifyLine(["test"], 4, MIN_CHARACTERS_PER_LINE - 1)
      ).toThrow(Error);
    });

    it("which is 0 should throw an Error", () => {
      expect(() => leftJustifyLine(["test"], 4, 0)).toThrow(Error);
    });

    it("which is negative should throw an Error", () => {
      expect(() => leftJustifyLine(["test"], 4, -5)).toThrow(Error);
    });
  });

  describe("given an invalid word in the input array", () => {
    it("which is longer than maxWidth should throw an Error", () => {
      expect(() =>
        leftJustifyLine(
          ["Hello", "a".repeat(MIN_CHARACTERS_PER_LINE + 1)],
          22,
          MIN_CHARACTERS_PER_LINE
        )
      ).toThrow(Error);
    });
  });

  describe("given an invalid width", () => {
    it("which does not equal the total length of all words in the input array should throw an Error", () => {
      expect(() => leftJustifyLine(["Hello", "world"], 4, 20)).toThrow(Error);
    });
  });
});

describe("fullJustify", () => {
  describe("given valid inputs", () => {
    it("should format into justified lines", () => {
      const result = fullJustify(
        ["This", "is", "an", "example", "of", "text", "justification."],
        MIN_CHARACTERS_PER_LINE
      );
      expect(result).toStrictEqual([
        "This    is    an\r\n",
        "example  of text\r\n",
        "justification.  \r\n",
      ]);
    });

    it("should format into justified lines", () => {
      const result = fullJustify(
        ["What", "must", "be", "acknowledgment", "shall", "be"],
        MIN_CHARACTERS_PER_LINE
      );
      expect(result).toStrictEqual([
        "What   must   be\r\n",
        "acknowledgment  \r\n",
        "shall be        \r\n",
      ]);
    });

    it("should format into justified lines", () => {
      const result = fullJustify(
        [
          "Science",
          "is",
          "what",
          "we",
          "understand",
          "well",
          "enough",
          "to",
          "explain",
          "to",
          "a",
          "computer.",
          "Art",
          "is",
          "everything",
          "else",
          "we",
          "do",
        ],
        20
      );
      expect(result).toStrictEqual([
        "Science  is  what we\r\n",
        "understand      well\r\n",
        "enough to explain to\r\n",
        "a  computer.  Art is\r\n",
        "everything  else  we\r\n",
        "do                  \r\n",
      ]);
    });

    it("should format into justified lines", () => {
      const result = fullJustify(
        [
          "Science",
          "is",
          "what",
          "we",
          "understand",
          "\r\nwell",
          "enough",
          "to",
          "explain",
          "to",
          "a",
          "computer.",
          "Art",
          "is",
          "everything",
          "else",
          "we",
          "do",
        ],
        20
      );
      expect(result).toStrictEqual([
        "Science  is  what we\r\n",
        "understand\r\n",
        "well    enough    to\r\n",
        "explain     to     a\r\n",
        "computer.   Art   is\r\n",
        "everything  else  we\r\n",
        "do                  \r\n",
      ]);
    });

    it("should format into justified lines", () => {
      const result = fullJustify(
        [
          "Science",
          "is",
          "what",
          "we",
          "understand\r\nwell",
          "enough",
          "to",
          "explain",
          "to",
          "a",
          "computer.",
          "Art",
          "is",
          "everything",
          "else",
          "we",
          "do",
        ],
        20
      );
      expect(result).toStrictEqual([
        "Science  is  what we\r\n",
        "understand\r\n",
        "well    enough    to\r\n",
        "explain     to     a\r\n",
        "computer.   Art   is\r\n",
        "everything  else  we\r\n",
        "do                  \r\n",
      ]);
    });

    it("should format into justified lines", () => {
      const result = fullJustify(
        [
          "Science",
          "is",
          "what",
          "we",
          "understand\r\n",
          "well",
          "enough",
          "to",
          "explain",
          "to",
          "a",
          "computer.",
          "Art",
          "is",
          "everything",
          "else",
          "we",
          "do",
        ],
        20
      );
      expect(result).toStrictEqual([
        "Science  is  what we\r\n",
        "understand\r\n",
        "well    enough    to\r\n",
        "explain     to     a\r\n",
        "computer.   Art   is\r\n",
        "everything  else  we\r\n",
        "do                  \r\n",
      ]);
    });

    it("should format into justified lines", () => {
      const result = fullJustify(
        "Cette croyance survivait pendant quelques secondes à mon réveil; elle ne choquait pas ma raison, mais pesait comme des écailles sur mes yeux et les empêchait de se rendre compte que le bougeoir n’était plus allumé. ".split(
          " "
        ),
        LINE_LENGTH
      );
      expect(result).toStrictEqual([
        "Cette  croyance  survivait  pendant  quelques  secondes  à  mon  réveil; elle ne\r\n",
        "choquait  pas  ma  raison,  mais  pesait  comme des écailles sur mes yeux et les\r\n",
        "empêchait de se rendre compte que le bougeoir n’était plus allumé.              \r\n",
      ]);
    });

    it("with no words should return an array containing an unique empty string", () => {
      const result = fullJustify([], 20);
      expect(result).toStrictEqual(["\r\n"]);
    });

    it("with a single word at maximum allowed length should return an array with only this word", () => {
      const word = "a".repeat(MIN_CHARACTERS_PER_LINE);
      const result = fullJustify([word], MIN_CHARACTERS_PER_LINE);
      expect(result).toStrictEqual([word + "\r\n"]);
    });
  });

  describe("given invalid maxWidth input", () => {
    it("which is less than MIN_CHARACTERS_PER_LINE should throw an Error", () => {
      expect(() => fullJustify(["test"], MIN_CHARACTERS_PER_LINE - 1)).toThrow(
        Error
      );
    });

    it("which is 0 should throw an Error", () => {
      expect(() => fullJustify(["test"], 0)).toThrow(Error);
    });

    it("which is negative should throw an Error", () => {
      expect(() => fullJustify(["test"], -5)).toThrow(Error);
    });
  });

  describe("given an invalid word in the input array", () => {
    it("which is longer than maxWidth should throw an Error", () => {
      expect(() =>
        fullJustify(
          ["Hello", "a".repeat(MIN_CHARACTERS_PER_LINE + 1)],
          MIN_CHARACTERS_PER_LINE
        )
      ).toThrow(Error);
    });
  });
});
