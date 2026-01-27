/**
 * Pure calculation functions for activity indicators
 * These functions contain NO side effects and are easily testable
 */

import { ActivityReportedStatus } from "@/types/domain/activity.entity";

/**
 * INDICATOR 1: Activity Progress
 * Formula: actualProgress / plannedProgress * 100
 * Target: 100%
 */
export function calculateActivityProgress(
  actualProgress: number,
  plannedProgress: number
): number | null {
  // Handle edge cases
  if (plannedProgress === 0) return null;
  if (actualProgress < 0 || plannedProgress < 0) return null;

  const percentage = (actualProgress / plannedProgress) * 100;

  // Round to 2 decimal places
  return Math.round(percentage * 100) / 100;
}

/**
 * INDICATOR 2: Time Variance
 * Formula: actualEndDate - plannedEndDate (endDate)
 * Unit: Days
 * Target: ≤0 (negative means finished early, positive means delayed)
 */
export function calculateTimeVariance(
  actualEndDate: string | null,
  plannedEndDate: string
): number | null {
  if (!actualEndDate) return null;

  const actual = new Date(actualEndDate);
  const planned = new Date(plannedEndDate);

  // Calculate difference in days
  const diffTime = actual.getTime() - planned.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

/**
 * INDICATOR 3: Deadline Compliance (reportedStatus)
 * Rules:
 * - NO_INICIADA: actualProgress = 0%
 * - EN_RIESGO: actualEndDate > endDate (delayed)
 * - COMPLETADA: actualEndDate ≤ endDate AND actualProgress = 100%
 */
export function calculateReportedStatus(
  actualProgress: number,
  actualEndDate: string | null,
  plannedEndDate: string
): ActivityReportedStatus {
  // Rule 1: Not started
  if (actualProgress === 0) {
    return "NO_INICIADA";
  }

  // Rule 2: Completed on time
  if (actualProgress >= 100 && actualEndDate) {
    const variance = calculateTimeVariance(actualEndDate, plannedEndDate);
    if (variance !== null && variance <= 0) {
      return "COMPLETADA";
    }
  }

  // Rule 3: At risk (either incomplete or delayed)
  if (actualEndDate) {
    const variance = calculateTimeVariance(actualEndDate, plannedEndDate);
    if (variance !== null && variance > 0) {
      return "EN_RIESGO";
    }
  }

  // Default: in progress but not at risk yet
  return "NO_INICIADA";
}

/**
 * Indicator status helpers
 */
export function getIndicator1Status(
  value: number | null
): "ON_TARGET" | "BELOW_TARGET" | "NOT_STARTED" {
  if (value === null) return "NOT_STARTED";
  if (value >= 100) return "ON_TARGET";
  return "BELOW_TARGET";
}

export function getIndicator2Status(
  value: number | null
): "ON_TIME" | "DELAYED" | "NOT_COMPLETED" {
  if (value === null) return "NOT_COMPLETED";
  if (value <= 0) return "ON_TIME";
  return "DELAYED";
}

export function getIndicator3Status(
  value: ActivityReportedStatus
): "COMPLIANT" | "AT_RISK" | "NOT_STARTED" {
  if (value === "COMPLETADA") return "COMPLIANT";
  if (value === "EN_RIESGO") return "AT_RISK";
  return "NOT_STARTED";
}
