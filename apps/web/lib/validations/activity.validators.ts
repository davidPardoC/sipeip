import { z } from "zod";

export const activityCreateSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  description: z.string().optional(),
  responsiblePerson: z.string().min(1, "El responsable es obligatorio"),
  startDate: z.string().min(1, "La fecha de inicio es obligatoria"),
  endDate: z.string().min(1, "La fecha de fin es obligatoria"),
  progressPercent: z.string().optional().default("0.00"),
  executedBudget: z.string().optional().default("0.00"),
  status: z.enum(["PLANNED", "IN_PROGRESS", "COMPLETED", "CANCELLED", "ON_HOLD"]).optional().default("PLANNED"),
  priority: z.number().min(1).max(5).optional().default(1),
  isActive: z.boolean().optional().default(true),
  objectiveIds: z.array(z.number()).min(1, "Debe seleccionar al menos un objetivo"),
  projectId: z.number().min(1, "El ID del proyecto es obligatorio"),
  createdBy: z.string().optional(),
}).refine((data) => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  return start <= end;
}, {
  message: "La fecha de inicio debe ser menor o igual a la fecha de fin",
  path: ["startDate"], // Mark error on startDate
});

export const activityUpdateSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio").optional(),
  description: z.string().optional(),
  responsiblePerson: z.string().min(1, "El responsable es obligatorio").optional(),
  startDate: z.string().min(1, "La fecha de inicio es obligatoria").optional(),
  endDate: z.string().min(1, "La fecha de fin es obligatoria").optional(),
  progressPercent: z.string().optional(),
  executedBudget: z.string().optional(),
  status: z.enum(["PLANNED", "IN_PROGRESS", "COMPLETED", "CANCELLED", "ON_HOLD"]).optional(),
  priority: z.number().min(1).max(5).optional(),
  isActive: z.boolean().optional(),
  reportedStatus: z.string().optional(),
  objectiveIds: z.array(z.number()).optional(),
  updatedBy: z.string().optional(),
}).refine((data) => {
  if (data.startDate && data.endDate) {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    return start <= end;
  }
  return true;
}, {
  message: "La fecha de inicio debe ser menor o igual a la fecha de fin",
  path: ["startDate"],
});

export type ActivityCreateData = z.infer<typeof activityCreateSchema>;
export type ActivityUpdateData = z.infer<typeof activityUpdateSchema>;
