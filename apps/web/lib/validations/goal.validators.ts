import { z } from "zod";

// Base schema for goal validation
const BaseGoalSchema = z.object({
  year: z.number().int().min(2000, "Year must be at least 2000").max(2099, "Year must be at most 2099"),
  targetValue: z.string().min(1, "Target value is required").refine(
    (val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0,
    "Target value must be a valid positive number"
  ),
  actualValue: z.string().optional().refine(
    (val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0),
    "Actual value must be a valid positive number"
  ),
  status: z.enum(["ACTIVE", "INACTIVE", "ARCHIVED"]),
});

// Schema for creating goals
export const CreateGoalSchema = BaseGoalSchema.extend({
  indicatorId: z.number().int().positive(),
});

// Schema for updating goals
export const UpdateGoalSchema = BaseGoalSchema.partial();

// Types
export type CreateGoalData = z.infer<typeof CreateGoalSchema>;
export type UpdateGoalData = z.infer<typeof UpdateGoalSchema>;
export type GoalFormData = z.infer<typeof BaseGoalSchema>;
