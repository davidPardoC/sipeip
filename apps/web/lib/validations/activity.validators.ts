import { z } from "zod";

// Base activity schema with all fields
const activityBaseSchema = z.object({
  activityCode: z.string().min(1, "Activity code is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  responsiblePerson: z.string().min(1, "Responsible person is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  actualStartDate: z.string().optional().nullable(),
  actualEndDate: z.string().optional().nullable(),
  plannedDuration: z.number().int().positive().optional().nullable(),
  progressPercent: z.string().optional().default("0.00"),
  plannedProgress: z.string().optional().default("0.00"),
  actualProgress: z.string().optional().default("0.00"),
  executedBudget: z.string().optional().default("0.00"),
  priority: z.number().int().min(1).max(5).optional().default(3),
  status: z
    .enum(["PLANNED", "IN_PROGRESS", "COMPLETED", "CANCELLED", "ON_HOLD"])
    .optional()
    .default("PLANNED"),
  reportedStatus: z
    .enum(["NO_INICIADA", "EN_RIESGO", "COMPLETADA"])
    .optional(),
  projectId: z.number().min(1, "Project ID is required"),
  createdBy: z.string().optional(),
  objectiveIds: z.array(z.number().int().positive()).optional(),
});

// CREATE schema with validation rules
export const activityCreateSchema = activityBaseSchema
  // V-01: Date validation - startDate ≤ endDate
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return start <= end;
    },
    {
      message: "Start date must be before or equal to end date",
      path: ["endDate"],
    }
  )
  // V-01: actualStartDate ≤ actualEndDate (if both provided)
  .refine(
    (data) => {
      if (!data.actualStartDate || !data.actualEndDate) return true;
      const actualStart = new Date(data.actualStartDate);
      const actualEnd = new Date(data.actualEndDate);
      return actualStart <= actualEnd;
    },
    {
      message: "Actual start date must be before or equal to actual end date",
      path: ["actualEndDate"],
    }
  )
  // V-01 (Optional): actualStartDate should be within [startDate, endDate] range
  .refine(
    (data) => {
      if (!data.actualStartDate) return true;
      const actualStart = new Date(data.actualStartDate);
      const plannedStart = new Date(data.startDate);
      const plannedEnd = new Date(data.endDate);
      return actualStart >= plannedStart && actualStart <= plannedEnd;
    },
    {
      message: "Actual start date should be within planned date range",
      path: ["actualStartDate"],
    }
  )
  // V-03: Multiple objectives validation (at least 1 if provided)
  .refine(
    (data) => {
      if (!data.objectiveIds) return true;
      return data.objectiveIds.length >= 1;
    },
    {
      message: "Activity must be linked to at least one strategic objective",
      path: ["objectiveIds"],
    }
  )
  // Validate progress values are valid decimals
  .refine(
    (data) => {
      const planned = parseFloat(data.plannedProgress || "0");
      const actual = parseFloat(data.actualProgress || "0");
      return (
        !isNaN(planned) && !isNaN(actual) && planned >= 0 && actual >= 0
      );
    },
    {
      message: "Progress values must be valid positive numbers",
      path: ["actualProgress"],
    }
  );

// UPDATE schema (all fields optional except objectiveIds array length validation)
export const activityUpdateSchema = activityBaseSchema
  .partial()
  .extend({
    updatedBy: z.string().optional(),
  })
  // V-01: Date validation - startDate ≤ endDate (if both provided in update)
  .refine(
    (data) => {
      if (!data.startDate || !data.endDate) return true;
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return start <= end;
    },
    {
      message: "Start date must be before or equal to end date",
      path: ["endDate"],
    }
  )
  // V-01: actualStartDate ≤ actualEndDate
  .refine(
    (data) => {
      if (!data.actualStartDate || !data.actualEndDate) return true;
      const actualStart = new Date(data.actualStartDate);
      const actualEnd = new Date(data.actualEndDate);
      return actualStart <= actualEnd;
    },
    {
      message: "Actual start date must be before or equal to actual end date",
      path: ["actualEndDate"],
    }
  )
  // V-03: Multiple objectives validation
  .refine(
    (data) => {
      if (!data.objectiveIds) return true;
      return data.objectiveIds.length >= 1;
    },
    {
      message: "Activity must be linked to at least one strategic objective",
      path: ["objectiveIds"],
    }
  );

export type ActivityCreateData = z.infer<typeof activityCreateSchema>;
export type ActivityUpdateData = z.infer<typeof activityUpdateSchema>;
