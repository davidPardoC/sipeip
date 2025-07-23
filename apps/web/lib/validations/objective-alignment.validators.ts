import { z } from "zod";

const baseObjectiveAlignmentSchema = z.object({
  weight: z.number().min(0.1, "El peso debe ser mayor a 0").max(100, "El peso no puede exceder 100%"),
  strategicObjectiveId: z.number().min(1, "ID del objetivo estratégico es requerido"),
  pndObjectiveId: z.number().min(1, "ID del objetivo PND es requerido"),
  odsGoalId: z.number().min(1, "ID del objetivo ODS es requerido"),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
});

export const objectiveAlignmentCreateSchema = baseObjectiveAlignmentSchema;

export const objectiveAlignmentUpdateSchema = baseObjectiveAlignmentSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "Al menos un campo debe ser proporcionado para la actualización",
  }
);

export const bulkObjectiveAlignmentCreateSchema = z.object({
  strategicObjectiveId: z.number().min(1, "ID del objetivo estratégico es requerido"),
  alignments: z.array(z.object({
    weight: z.number().min(0.1, "El peso debe ser mayor a 0").max(100, "El peso no puede exceder 100%"),
    pndObjectiveId: z.number().min(1, "ID del objetivo PND es requerido"),
    odsGoalId: z.number().min(1, "ID del objetivo ODS es requerido"),
  })),
  createdBy: z.string().optional(),
}).refine(
  (data) => {
    const totalWeight = data.alignments.reduce((sum, alignment) => sum + alignment.weight, 0);
    return Math.abs(totalWeight - 100) < 0.01; // Allow small floating point differences
  },
  {
    message: "La suma total de los pesos debe ser exactamente 100%",
    path: ["alignments"],
  }
);
