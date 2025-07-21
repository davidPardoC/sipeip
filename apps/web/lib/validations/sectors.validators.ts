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

export const publicEntityCreateSchema = z.object({
  code: z.string().min(1, "El código es requerido"),
  name: z.string().min(1, "El nombre es requerido"),
  shortName: z.string().min(1, "El nombre corto es requerido"),
  govermentLevel: z.string().min(1, "El nivel de gobierno es requerido"),
  status: z.enum(["ACTIVE", "INACTIVE", "ARCHIVED"], {
    required_error: "El estado es requerido",
  }),
  subSectorId: z.number().min(1, "El subsector es requerido"),
});

export const publicEntityUpdateSchema = publicEntityCreateSchema;

export const organizationalUnitCreateSchema = z.object({
  code: z.string().min(1, "El código es requerido"),
  name: z.string().min(1, "El nombre es requerido"),
  level: z.number().min(0, "El nivel debe ser mayor o igual a 0"),
  status: z.enum(["ACTIVE", "INACTIVE", "ARCHIVED"], {
    required_error: "El estado es requerido",
  }),
  parentId: z.number().min(1, "La unidad padre es requerida"),
  publicEntityId: z.number().min(1, "La entidad pública es requerida"),
});

export const organizationalUnitUpdateSchema = organizationalUnitCreateSchema;
