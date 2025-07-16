"use server";

import { checkAuth } from "@/lib/auth.utils";
import {
  macroSectorService,
  sectorService,
  microSectorService,
} from "@/services";
import {
  macroSectorCreateSchema,
  sectorCreateSchema,
  microSectorCreateSchema,
} from "@/lib/validations/sectors.validators";
import { revalidatePath } from "next/cache";

export const createMacroSector = async (data: FormData) => {
  await checkAuth();

  const rawData = {
    name: data.get("name") as string,
    code: data.get("code") as string,
  };

  try {
    const validatedData = macroSectorCreateSchema.parse(rawData);
    // TODO: Implement the actual creation logic in the service
    const macroSector = await macroSectorService.create(validatedData);
    revalidatePath("/home/sectores");
    return { success: true, data: macroSector };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error creating macro sector",
    };
  }
};

export const getMacroSectores = async () => {
  await checkAuth();
  return macroSectorService.getAll();
};

export const updateMacroSector = async (id: number, data: FormData) => {
  await checkAuth();

  const rawData = {
    name: data.get("name") as string,
    code: data.get("code") as string,
  };

  try {
    const validatedData = macroSectorCreateSchema.parse(rawData);
    await macroSectorService.update(id, validatedData);
    revalidatePath("/home/sectores");
    return { success: true, data: validatedData };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error updating macro sector",
    };
  }
};

export const deleteMacroSector = async (id: number) => {
  await checkAuth();

  try {
    await macroSectorService.delete(id);
    revalidatePath("/home/sectores");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error deleting macro sector",
    };
  }
};

export const createSector = async (data: FormData) => {
  await checkAuth();

  const rawData = {
    name: data.get("name") as string,
    code: data.get("code") as string,
    macroSectorId: data.get("macroSectorId") as string,
  };

  try {
    const validatedData = sectorCreateSchema.parse(rawData);
    const sectorData = {
      name: validatedData.name,
      code: validatedData.code,
      macroSectorId: parseInt(validatedData.macroSectorId),
    };

    await sectorService.create(sectorData);
    revalidatePath("/home/sectores");
    return { success: true, data: sectorData };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error creating sector",
    };
  }
};

export const updateSector = async (id: number, data: FormData) => {
  await checkAuth();

  const rawData = {
    name: data.get("name") as string,
    code: data.get("code") as string,
    macroSectorId: data.get("macroSectorId") as string,
  };

  try {
    const validatedData = sectorCreateSchema.parse(rawData);
    const sectorData = {
      name: validatedData.name,
      code: validatedData.code,
      macroSectorId: parseInt(validatedData.macroSectorId),
    };

    await sectorService.update(id, sectorData);
    revalidatePath("/home/sectores");
    return { success: true, data: sectorData };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error updating sector",
    };
  }
};

export const deleteSector = async (id: number) => {
  await checkAuth();

  try {
    await sectorService.delete(id);
    revalidatePath("/home/sectores");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error deleting sector",
    };
  }
};

export const getSectores = async () => {
  await checkAuth();
  return sectorService.getAll();
};

export const createMicroSector = async (data: FormData) => {
  await checkAuth();

  const rawData = {
    name: data.get("name") as string,
    code: data.get("code") as string,
    sectorId: data.get("sectorId") as string,
  };

  try {
    const validatedData = microSectorCreateSchema.parse(rawData);
    const microSectorData = {
      name: validatedData.name,
      code: validatedData.code,
      sectorId: parseInt(validatedData.sectorId),
    };

    await microSectorService.create(microSectorData);
    revalidatePath("/home/sectores");
    return { success: true, data: microSectorData };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error creating micro sector",
    };
  }
};

export const updateMicroSector = async (id: number, data: FormData) => {
  await checkAuth();

  const rawData = {
    name: data.get("name") as string,
    code: data.get("code") as string,
    sectorId: data.get("sectorId") as string,
  };

  try {
    const validatedData = microSectorCreateSchema.parse(rawData);
    const microSectorData = {
      name: validatedData.name,
      code: validatedData.code,
      sectorId: parseInt(validatedData.sectorId),
    };

    await microSectorService.update(id, microSectorData);
    revalidatePath("/home/sectores");
    return { success: true, data: microSectorData };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error updating micro sector",
    };
  }
};

export const deleteMicroSector = async (id: number) => {
  await checkAuth();

  try {
    await microSectorService.delete(id);
    revalidatePath("/home/sectores");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error deleting micro sector",
    };
  }
};

export const getMicroSectores = async () => {
  await checkAuth();
  return microSectorService.getAll();
};
