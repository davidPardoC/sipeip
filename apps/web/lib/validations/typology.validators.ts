import { z } from "zod";

export const typologyCreateSchema = z.object({
  code: z
    .string()
    .min(1, "Code is required")
    .max(20, "Code must be less than 20 characters")
    .regex(/^[A-Z0-9_-]+$/, "Code must contain only uppercase letters, numbers, underscores, and hyphens"),
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters"),
});

export const typologyUpdateSchema = z.object({
  code: z
    .string()
    .min(1, "Code is required")
    .max(20, "Code must be less than 20 characters")
    .regex(/^[A-Z0-9_-]+$/, "Code must contain only uppercase letters, numbers, underscores, and hyphens")
    .optional(),
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .optional(),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters")
    .optional(),
});

export type TypologyCreateInput = z.infer<typeof typologyCreateSchema>;
export type TypologyUpdateInput = z.infer<typeof typologyUpdateSchema>;
