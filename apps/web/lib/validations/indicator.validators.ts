import { z } from "zod";

// Base schema for indicator validation
const BaseIndicatorSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name must be less than 255 characters"),
  unit: z.string().min(1, "Unit is required").max(100, "Unit must be less than 100 characters"),
  formula: z.string().min(1, "Formula is required"),
  baseline: z.string().min(1, "Baseline is required"),
  status: z.enum(["ACTIVE", "INACTIVE", "ARCHIVED"]),
});

// Schema for creating indicators
export const CreateIndicatorSchema = BaseIndicatorSchema.extend({
  ownerType: z.literal("StrategicObjective"),
  ownerId: z.number().int().positive(),
});

// Schema for updating indicators
export const UpdateIndicatorSchema = BaseIndicatorSchema.partial();

// Types
export type CreateIndicatorData = z.infer<typeof CreateIndicatorSchema>;
export type UpdateIndicatorData = z.infer<typeof UpdateIndicatorSchema>;
export type IndicatorFormData = z.infer<typeof BaseIndicatorSchema>;
