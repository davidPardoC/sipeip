import { z } from "zod";

export const institutionalPlanCreateSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  version: z.string().min(1, "La versión es requerida"),
  periodStart: z.string().min(1, "La fecha de inicio es requerida"),
  periodEnd: z.string().min(1, "La fecha de fin es requerida"),
  status: z.enum(["ACTIVE", "INACTIVE", "ARCHIVED", "DRAFT"]).optional(),
  publicEntityId: z.number().min(1, "La entidad pública es requerida"),
  createdBy: z.string().optional(),
});

export const institutionalPlanUpdateSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").optional(),
  version: z.string().min(1, "La versión es requerida").optional(),
  periodStart: z.string().min(1, "La fecha de inicio es requerida").optional(),
  periodEnd: z.string().min(1, "La fecha de fin es requerida").optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "ARCHIVED", "DRAFT"]).optional(),
  publicEntityId: z.number().min(1, "La entidad pública es requerida"),
}).refine(
  (data) => {
    // Si periodStart y periodEnd están presentes, validar que periodStart < periodEnd
    if (data.periodStart && data.periodEnd) {
      return new Date(data.periodStart) < new Date(data.periodEnd);
    }
    return true;
  },
  {
    message: "La fecha de inicio debe ser anterior a la fecha de fin",
    path: ["periodEnd"],
  }
);

export type InstitutionalPlanCreateInput = z.infer<typeof institutionalPlanCreateSchema>;
export type InstitutionalPlanUpdateInput = z.infer<typeof institutionalPlanUpdateSchema>;
