import {
  calculateActivityProgress,
  calculateTimeVariance,
  calculateReportedStatus,
  getIndicator1Status,
  getIndicator2Status,
  getIndicator3Status,
} from "../indicator-calculations";

describe("calculateActivityProgress", () => {
  it("should calculate progress percentage correctly", () => {
    expect(calculateActivityProgress(50, 100)).toBe(50);
    expect(calculateActivityProgress(75, 100)).toBe(75);
    expect(calculateActivityProgress(100, 100)).toBe(100);
  });

  it("should handle edge cases", () => {
    expect(calculateActivityProgress(0, 100)).toBe(0);
    expect(calculateActivityProgress(50, 0)).toBeNull();
    expect(calculateActivityProgress(-10, 100)).toBeNull();
    expect(calculateActivityProgress(50, -10)).toBeNull();
  });

  it("should round to 2 decimal places", () => {
    expect(calculateActivityProgress(33.333, 100)).toBe(33.33);
    expect(calculateActivityProgress(66.666, 100)).toBe(66.67);
  });
});

describe("calculateTimeVariance", () => {
  it("should calculate positive variance for delays", () => {
    const actualEndDate = "2024-01-15";
    const plannedEndDate = "2024-01-10";
    expect(calculateTimeVariance(actualEndDate, plannedEndDate)).toBe(5);
  });

  it("should calculate negative variance for early completion", () => {
    const actualEndDate = "2024-01-05";
    const plannedEndDate = "2024-01-10";
    expect(calculateTimeVariance(actualEndDate, plannedEndDate)).toBe(-5);
  });

  it("should return 0 for on-time completion", () => {
    const actualEndDate = "2024-01-10";
    const plannedEndDate = "2024-01-10";
    expect(calculateTimeVariance(actualEndDate, plannedEndDate)).toBe(0);
  });

  it("should return null when actualEndDate is not provided", () => {
    expect(calculateTimeVariance(null, "2024-01-10")).toBeNull();
  });
});

describe("calculateReportedStatus", () => {
  it("should return NO_INICIADA when progress is 0", () => {
    expect(calculateReportedStatus(0, null, "2024-01-10")).toBe("NO_INICIADA");
  });

  it("should return COMPLETADA when 100% and on time", () => {
    const actualEndDate = "2024-01-10";
    const plannedEndDate = "2024-01-15";
    expect(calculateReportedStatus(100, actualEndDate, plannedEndDate)).toBe(
      "COMPLETADA"
    );
  });

  it("should return EN_RIESGO when delayed", () => {
    const actualEndDate = "2024-01-20";
    const plannedEndDate = "2024-01-15";
    expect(calculateReportedStatus(80, actualEndDate, plannedEndDate)).toBe(
      "EN_RIESGO"
    );
  });

  it("should return NO_INICIADA when in progress but not at risk", () => {
    expect(calculateReportedStatus(50, null, "2024-01-10")).toBe(
      "NO_INICIADA"
    );
  });
});

describe("getIndicator1Status", () => {
  it("should return ON_TARGET when >= 100", () => {
    expect(getIndicator1Status(100)).toBe("ON_TARGET");
    expect(getIndicator1Status(120)).toBe("ON_TARGET");
  });

  it("should return BELOW_TARGET when < 100", () => {
    expect(getIndicator1Status(50)).toBe("BELOW_TARGET");
    expect(getIndicator1Status(99.9)).toBe("BELOW_TARGET");
  });

  it("should return NOT_STARTED when null", () => {
    expect(getIndicator1Status(null)).toBe("NOT_STARTED");
  });
});

describe("getIndicator2Status", () => {
  it("should return ON_TIME when <= 0", () => {
    expect(getIndicator2Status(0)).toBe("ON_TIME");
    expect(getIndicator2Status(-5)).toBe("ON_TIME");
  });

  it("should return DELAYED when > 0", () => {
    expect(getIndicator2Status(1)).toBe("DELAYED");
    expect(getIndicator2Status(10)).toBe("DELAYED");
  });

  it("should return NOT_COMPLETED when null", () => {
    expect(getIndicator2Status(null)).toBe("NOT_COMPLETED");
  });
});

describe("getIndicator3Status", () => {
  it("should return COMPLIANT when COMPLETADA", () => {
    expect(getIndicator3Status("COMPLETADA")).toBe("COMPLIANT");
  });

  it("should return AT_RISK when EN_RIESGO", () => {
    expect(getIndicator3Status("EN_RIESGO")).toBe("AT_RISK");
  });

  it("should return NOT_STARTED when NO_INICIADA", () => {
    expect(getIndicator3Status("NO_INICIADA")).toBe("NOT_STARTED");
  });
});
