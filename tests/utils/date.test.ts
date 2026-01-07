import { describe, expect, it } from "@jest/globals";
import { datesInSameDay } from "../../src/utils/date.js";

describe("datesInSameDay", () => {
  it("should return true for two identical dates", () => {
    const date1 = new Date("2024-01-15T10:30:00");
    const date2 = new Date("2024-01-15T10:30:00");
    expect(datesInSameDay(date1, date2)).toBe(true);
  });

  it("should return true for two dates on the same day with different times", () => {
    const date1 = new Date("2024-01-15T08:00:00");
    const date2 = new Date("2024-01-15T23:59:59");
    expect(datesInSameDay(date1, date2)).toBe(true);
  });

  it("should return false for two dates on different days", () => {
    const date1 = new Date("2024-01-15T10:30:00");
    const date2 = new Date("2024-01-16T10:30:00");
    expect(datesInSameDay(date1, date2)).toBe(false);
  });

  it("should return false for two dates in different months", () => {
    const date1 = new Date("2024-01-15T10:30:00");
    const date2 = new Date("2024-02-15T10:30:00");
    expect(datesInSameDay(date1, date2)).toBe(false);
  });

  it("should return false for two dates in different years", () => {
    const date1 = new Date("2024-01-15T10:30:00");
    const date2 = new Date("2025-01-15T10:30:00");
    expect(datesInSameDay(date1, date2)).toBe(false);
  });
});
