import { z } from "zod";

export const macroSectorCreateSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  code: z.string().min(1, "El código es requerido"),
});

export const sectorCreateSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  code: z.string().min(1, "El código es requerido"),
  macroSectorId: z.string().min(1, "El macro sector es requerido"),
});

export const microSectorUpdateSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  code: z.string().min(1, "El código es requerido"),
  sectorId: z.string().min(1, "El sector es requerido"),
});

export const microSectorCreateSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  code: z.string().min(1, "El código es requerido"),
  sectorId: z.string().min(1, "El sector es requerido"),
});
