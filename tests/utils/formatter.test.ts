import {
  fullJustify,
  justifyLine,
  leftJustifyLine,
  MIN_CHARACTERS_PER_LINE,
} from "../../src/utils/formatter.js";
import { describe, expect, it } from "@jest/globals";

describe("justifyLine", () => {
  describe("given valid inputs", () => {
    it("should justify a line with even space distribution", () => {
      const result = justifyLine(
        ["This", "is", "an"],
        8,
        MIN_CHARACTERS_PER_LINE
      );
      expect(result).toBe("This    is    an");
    });

    it("should justify a line with even space distribution", () => {
      const result = justifyLine(["This", "is"], 6, MIN_CHARACTERS_PER_LINE);
      expect(result).toBe("This          is");
    });

    it("should justify a line without extra spaces", () => {
      const result = justifyLine(["Hello", "my", "beloved", "world"], 19, 22);
      expect(result).toBe("Hello my beloved world");
    });

    it("should justify a line with uneven space distribution", () => {
      const result = justifyLine(["The", "quick", "brown"], 13, 20);
      expect(result).toBe("The    quick   brown");
    });

    it("with no words should return an empty line", () => {
      const result = justifyLine([], 0, 20);
      expect(result).toBe("");
    });

    it("with a single word at maximum allowed length should return the word", () => {
      const word = "a".repeat(MIN_CHARACTERS_PER_LINE);
      const result = justifyLine(
        [word],
        MIN_CHARACTERS_PER_LINE,
        MIN_CHARACTERS_PER_LINE
      );
      expect(result).toBe(word);
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
    it("which is an empty string should throw an Error", () => {
      expect(() => justifyLine(["Hello", "", "world"], 10, 20)).toThrow(Error);
    });

    it("which is an empty string at the first position should throw an Error", () => {
      expect(() =>
        justifyLine(["", "test"], 4, MIN_CHARACTERS_PER_LINE)
      ).toThrow(Error);
    });

    it("which is an empty string at the last position should throw an Error", () => {
      expect(() =>
        justifyLine(["test", ""], 4, MIN_CHARACTERS_PER_LINE)
      ).toThrow(Error);
    });

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
      expect(result).toBe("This is an      ");
    });

    it("should left justify a line", () => {
      const result = leftJustifyLine(
        ["This", "is"],
        6,
        MIN_CHARACTERS_PER_LINE
      );
      expect(result).toBe("This is         ");
    });

    it("should left justify a line without extra spaces", () => {
      const result = leftJustifyLine(
        ["Hello", "my", "beloved", "world"],
        19,
        22
      );
      expect(result).toBe("Hello my beloved world");
    });

    it("with no words should return an empty line", () => {
      const result = leftJustifyLine([], 0, 20);
      expect(result).toBe("");
    });

    it("with a single word at maximum allowed length should return the word", () => {
      const word = "a".repeat(MIN_CHARACTERS_PER_LINE);
      const result = leftJustifyLine(
        [word],
        MIN_CHARACTERS_PER_LINE,
        MIN_CHARACTERS_PER_LINE
      );
      expect(result).toBe(word);
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
    it("which is an empty string should throw an Error", () => {
      expect(() => leftJustifyLine(["Hello", "", "world"], 10, 20)).toThrow(
        Error
      );
    });

    it("which is an empty string at the first position should throw an Error", () => {
      expect(() =>
        leftJustifyLine(["", "test"], 4, MIN_CHARACTERS_PER_LINE)
      ).toThrow(Error);
    });

    it("which is an empty string at the last position should throw an Error", () => {
      expect(() =>
        leftJustifyLine(["test", ""], 4, MIN_CHARACTERS_PER_LINE)
      ).toThrow(Error);
    });

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
        "This    is    an",
        "example  of text",
        "justification.  ",
      ]);
    });

    it("should format into justified lines", () => {
      const result = fullJustify(
        ["What", "must", "be", "acknowledgment", "shall", "be"],
        MIN_CHARACTERS_PER_LINE
      );
      expect(result).toStrictEqual([
        "What   must   be",
        "acknowledgment  ",
        "shall be        ",
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
        "Science  is  what we",
        "understand      well",
        "enough to explain to",
        "a  computer.  Art is",
        "everything  else  we",
        "do                  ",
      ]);
    });

    it("with no words should return an array containing an unique empty string", () => {
      const result = fullJustify([], 20);
      expect(result).toStrictEqual([""]);
    });

    it("with a single word at maximum allowed length should return an array with only this word", () => {
      const word = "a".repeat(MIN_CHARACTERS_PER_LINE);
      const result = fullJustify([word], MIN_CHARACTERS_PER_LINE);
      expect(result).toStrictEqual([word]);
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
    it("which is an empty string should throw an Error", () => {
      expect(() => fullJustify(["Hello", "", "world"], 20)).toThrow(Error);
    });

    it("which is an empty string at the first position should throw an Error", () => {
      expect(() => fullJustify(["", "test"], MIN_CHARACTERS_PER_LINE)).toThrow(
        Error
      );
    });

    it("which is an empty string at the last position should throw an Error", () => {
      expect(() => fullJustify(["test", ""], MIN_CHARACTERS_PER_LINE)).toThrow(
        Error
      );
    });

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
