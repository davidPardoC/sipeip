import { z } from "zod";

export const projectCreateSchema = z.object({
  code: z
    .string()
    .min(1, "Code is required")
    .max(50, "Code must be less than 50 characters"),
  cup: z
    .string()
    .min(1, "CUP is required")
    .max(50, "CUP must be less than 50 characters"),
  budget: z
    .string()
    .min(1, "Budget is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Budget must be a positive number",
    }),
  startDate: z
    .string()
    .min(1, "Start date is required")
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Start date must be a valid date",
    }),
  endDate: z
    .string()
    .min(1, "End date is required")
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "End date must be a valid date",
    }),
  status: z.enum([
    "ACTIVE", 
    "SEND_FOR_APPROVAL", 
    "INACTIVE", 
    "COMPLETED", 
    "CANCELLED", 
    "ON_HOLD", 
    "REJECTED", 
    "APPROVED"
  ]).default("ACTIVE"),
  programId: z
    .number()
    .int()
    .positive("Program ID must be a positive integer"),
  strategicObjectiveId: z
    .number()
    .int()
    .positive("Strategic Objective ID must be a positive integer"),
  typologyId: z
    .number()
    .int()
    .positive("Typology ID must be a positive integer"),
}).refine(
  (data) => {
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    return startDate < endDate;
  },
  {
    message: "End date must be after start date",
    path: ["endDate"],
  }
);

export const projectUpdateSchema = z.object({
  code: z
    .string()
    .min(1, "Code is required")
    .max(50, "Code must be less than 50 characters")
    .optional(),
  cup: z
    .string()
    .min(1, "CUP is required")
    .max(50, "CUP must be less than 50 characters")
    .optional(),
  budget: z
    .string()
    .min(1, "Budget is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Budget must be a positive number",
    })
    .optional(),
  startDate: z
    .string()
    .min(1, "Start date is required")
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Start date must be a valid date",
    })
    .optional(),
  endDate: z
    .string()
    .min(1, "End date is required")
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "End date must be a valid date",
    })
    .optional(),
  status: z.enum([
    "ACTIVE", 
    "SEND_FOR_APPROVAL", 
    "INACTIVE", 
    "COMPLETED", 
    "CANCELLED", 
    "ON_HOLD", 
    "REJECTED", 
    "APPROVED"
  ]).optional(),
  programId: z
    .number()
    .int()
    .positive("Program ID must be a positive integer")
    .optional(),
  strategicObjectiveId: z
    .number()
    .int()
    .positive("Strategic Objective ID must be a positive integer")
    .optional(),
  typologyId: z
    .number()
    .int()
    .positive("Typology ID must be a positive integer")
    .optional(),
}).refine(
  (data) => {
    if (data.startDate && data.endDate) {
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);
      return startDate < endDate;
    }
    return true;
  },
  {
    message: "End date must be after start date",
    path: ["endDate"],
  }
);

export type ProjectCreateInput = z.infer<typeof projectCreateSchema>;
export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>;
