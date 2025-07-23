import { z } from "zod";

export const activityCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  responsiblePerson: z.string().min(1, "Responsible person is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  progressPercent: z.string().optional().default("0.00"),
  executedBudget: z.string().optional().default("0.00"),
  status: z.enum(["PLANNED", "IN_PROGRESS", "COMPLETED", "CANCELLED", "ON_HOLD"]).optional().default("PLANNED"),
  projectId: z.number().min(1, "Project ID is required"),
  createdBy: z.string().optional(),
});

export const activityUpdateSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  description: z.string().optional(),
  responsiblePerson: z.string().min(1, "Responsible person is required").optional(),
  startDate: z.string().min(1, "Start date is required").optional(),
  endDate: z.string().min(1, "End date is required").optional(),
  progressPercent: z.string().optional(),
  executedBudget: z.string().optional(),
  status: z.enum(["PLANNED", "IN_PROGRESS", "COMPLETED", "CANCELLED", "ON_HOLD"]).optional(),
  updatedBy: z.string().optional(),
});

export type ActivityCreateData = z.infer<typeof activityCreateSchema>;
export type ActivityUpdateData = z.infer<typeof activityUpdateSchema>;
