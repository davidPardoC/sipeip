import {
  calculateDurationInDays,
  isDateBeforeOrEqual,
  isDateBefore,
  isActualStartDateInRange,
} from "../date-calculations";

describe("calculateDurationInDays", () => {
  it("should calculate duration correctly", () => {
    expect(calculateDurationInDays("2024-01-01", "2024-01-11")).toBe(10);
    expect(calculateDurationInDays("2024-01-01", "2024-01-02")).toBe(1);
  });

  it("should handle same date", () => {
    expect(calculateDurationInDays("2024-01-01", "2024-01-01")).toBe(0);
  });

  it("should handle negative duration", () => {
    expect(calculateDurationInDays("2024-01-11", "2024-01-01")).toBe(-10);
  });
});

describe("isDateBeforeOrEqual", () => {
  it("should return true when date1 is before date2", () => {
    expect(isDateBeforeOrEqual("2024-01-01", "2024-01-10")).toBe(true);
  });

  it("should return true when dates are equal", () => {
    expect(isDateBeforeOrEqual("2024-01-10", "2024-01-10")).toBe(true);
  });

  it("should return false when date1 is after date2", () => {
    expect(isDateBeforeOrEqual("2024-01-10", "2024-01-01")).toBe(false);
  });
});

describe("isDateBefore", () => {
  it("should return true when date1 is before date2", () => {
    expect(isDateBefore("2024-01-01", "2024-01-10")).toBe(true);
  });

  it("should return false when dates are equal", () => {
    expect(isDateBefore("2024-01-10", "2024-01-10")).toBe(false);
  });

  it("should return false when date1 is after date2", () => {
    expect(isDateBefore("2024-01-10", "2024-01-01")).toBe(false);
  });
});

describe("isActualStartDateInRange", () => {
  it("should return true when actualStartDate is within range", () => {
    expect(
      isActualStartDateInRange("2024-01-05", "2024-01-01", "2024-01-10")
    ).toBe(true);
  });

  it("should return true when actualStartDate equals startDate", () => {
    expect(
      isActualStartDateInRange("2024-01-01", "2024-01-01", "2024-01-10")
    ).toBe(true);
  });

  it("should return true when actualStartDate equals endDate", () => {
    expect(
      isActualStartDateInRange("2024-01-10", "2024-01-01", "2024-01-10")
    ).toBe(true);
  });

  it("should return false when actualStartDate is before startDate", () => {
    expect(
      isActualStartDateInRange("2023-12-31", "2024-01-01", "2024-01-10")
    ).toBe(false);
  });

  it("should return false when actualStartDate is after endDate", () => {
    expect(
      isActualStartDateInRange("2024-01-11", "2024-01-01", "2024-01-10")
    ).toBe(false);
  });
});
