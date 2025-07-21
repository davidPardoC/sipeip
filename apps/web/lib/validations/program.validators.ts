import { z } from "zod";

const baseProgramSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  budget: z.string().min(1, "El presupuesto es requerido"),
  startDate: z.string().min(1, "La fecha de inicio es requerida"),
  endDate: z.string().min(1, "La fecha de fin es requerida"),
  status: z.enum(["ACTIVE", "INACTIVE", "ARCHIVED"]).optional(),
  createdBy: z.string().optional(),
});

export const programCreateSchema = baseProgramSchema.refine(
  (data) => {
    // Validar que startDate < endDate
    return new Date(data.startDate) < new Date(data.endDate);
  },
  {
    message: "La fecha de inicio debe ser anterior a la fecha de fin",
    path: ["endDate"],
  }
).refine(
  (data) => {
    // Validar que el presupuesto sea un número válido
    return !isNaN(parseFloat(data.budget)) && parseFloat(data.budget) > 0;
  },
  {
    message: "El presupuesto debe ser un número válido mayor a 0",
    path: ["budget"],
  }
);

export const programUpdateSchema = baseProgramSchema.partial().extend({
  id: z.number().optional(),
});

export type ProgramCreateInput = z.infer<typeof programCreateSchema>;
export type ProgramUpdateInput = z.infer<typeof programUpdateSchema>;
