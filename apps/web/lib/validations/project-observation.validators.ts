import { z } from "zod";

export const projectObservationCreateSchema = z.object({
  observation: z
    .string()
    .min(1, "Observation is required")
    .max(1000, "Observation must be less than 1000 characters"),
  projectId: z
    .number()
    .int()
    .positive("Project ID must be a positive integer"),
  createdBy: z
    .string()
    .min(1, "Created by is required")
    .max(100, "Created by must be less than 100 characters"),
});

export const projectObservationUpdateSchema = z.object({
  observation: z
    .string()
    .min(1, "Observation is required")
    .max(1000, "Observation must be less than 1000 characters")
    .optional(),
  updatedBy: z
    .string()
    .min(1, "Updated by is required")
    .max(100, "Updated by must be less than 100 characters")
    .optional(),
});

export type ProjectObservationCreateInput = z.infer<typeof projectObservationCreateSchema>;
export type ProjectObservationUpdateInput = z.infer<typeof projectObservationUpdateSchema>;
