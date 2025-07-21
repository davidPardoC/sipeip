import { z } from "zod";

export const strategicObjectiveCreateSchema = z.object({
  code: z.string().min(1, "El código es requerido"),
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().min(1, "La descripción es requerida"),
  status: z.enum(["ACTIVE", "INACTIVE", "ARCHIVED"]).optional(),
  startTime: z.string().min(1, "La fecha de inicio es requerida"),
  endTime: z.string().min(1, "La fecha de fin es requerida"),
  institutionalPlanId: z.number().min(1, "El plan institucional es requerido"),
  createdBy: z.string().optional(),
}).refine(
  (data) => {
    // Validar que startTime < endTime
    return new Date(data.startTime) < new Date(data.endTime);
  },
  {
    message: "La fecha de inicio debe ser anterior a la fecha de fin",
    path: ["endTime"],
  }
);

export const strategicObjectiveUpdateSchema = z.object({
  code: z.string().min(1, "El código es requerido").optional(),
  name: z.string().min(1, "El nombre es requerido").optional(),
  description: z.string().min(1, "La descripción es requerida").optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "ARCHIVED"]).optional(),
  startTime: z.string().min(1, "La fecha de inicio es requerida").optional(),
  endTime: z.string().min(1, "La fecha de fin es requerida").optional(),
  institutionalPlanId: z.number().min(1, "El plan institucional es requerido").optional(),
}).refine(
  (data) => {
    // Si startTime y endTime están presentes, validar que startTime < endTime
    if (data.startTime && data.endTime) {
      return new Date(data.startTime) < new Date(data.endTime);
    }
    return true;
  },
  {
    message: "La fecha de inicio debe ser anterior a la fecha de fin",
    path: ["endTime"],
  }
);

export type StrategicObjectiveCreateInput = z.infer<typeof strategicObjectiveCreateSchema>;
export type StrategicObjectiveUpdateInput = z.infer<typeof strategicObjectiveUpdateSchema>;
