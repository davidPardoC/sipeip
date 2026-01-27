/**
 * Date calculation utilities
 */

/**
 * Calculate duration in days between two dates
 */
export function calculateDurationInDays(
  startDate: string,
  endDate: string
): number {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

/**
 * Check if date1 is before or equal to date2
 */
export function isDateBeforeOrEqual(date1: string, date2: string): boolean {
  return new Date(date1) <= new Date(date2);
}

/**
 * Check if date1 is before date2
 */
export function isDateBefore(date1: string, date2: string): boolean {
  return new Date(date1) < new Date(date2);
}

/**
 * Validate that actualStartDate is within [startDate, endDate] range
 */
export function isActualStartDateInRange(
  actualStartDate: string,
  startDate: string,
  endDate: string
): boolean {
  const actual = new Date(actualStartDate);
  const planned = new Date(startDate);
  const end = new Date(endDate);

  return actual >= planned && actual <= end;
}
