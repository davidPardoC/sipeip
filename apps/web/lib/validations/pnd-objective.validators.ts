import { z } from "zod";

const basePndObjectiveSchema = z.object({
  code: z.string().min(1, "El código es requerido"),
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().min(1, "La descripción es requerida"),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
});

export const pndObjectiveCreateSchema = basePndObjectiveSchema;

export const pndObjectiveUpdateSchema = basePndObjectiveSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "Al menos un campo debe ser proporcionado para la actualización",
  }
);
