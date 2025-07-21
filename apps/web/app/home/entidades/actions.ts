"use server";

import { checkAuth } from "@/lib/auth.utils";
import { publicEntityService } from "@/services";
import { publicEntityCreateSchema } from "@/lib/validations/sectors.validators";
import { revalidatePath } from "next/cache";
import { ROLES } from "@/constants/role.constants";

// Create a new public entity
export const createPublicEntity = async (data: FormData) => {
  await checkAuth(ROLES.SYS_ADMIN);

  const rawData = {
    code: data.get("code") as string,
    name: data.get("name") as string,
    shortName: data.get("shortName") as string,
    govermentLevel: data.get("govermentLevel") as string,
    status: data.get("status") as "ACTIVE" | "INACTIVE" | "ARCHIVED",
    subSectorId: parseInt(data.get("subSectorId") as string),
  };

  try {
    const validatedData = publicEntityCreateSchema.parse(rawData);
    const publicEntity = await publicEntityService.create(validatedData);
    revalidatePath("/home/entidades");
    return { success: true, data: publicEntity };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error creating public entity",
    };
  }
};

// Get all public entities
export const getPublicEntities = async () => {
  await checkAuth(ROLES.SYS_ADMIN);
  return publicEntityService.getAll();
};

// Update a public entity
export const updatePublicEntity = async (id: number, data: FormData) => {
  await checkAuth(ROLES.SYS_ADMIN);

  const rawData = {
    code: data.get("code") as string,
    name: data.get("name") as string,
    shortName: data.get("shortName") as string,
    govermentLevel: data.get("govermentLevel") as string,
    status: data.get("status") as "ACTIVE" | "INACTIVE" | "ARCHIVED",
    subSectorId: parseInt(data.get("subSectorId") as string),
  };

  try {
    const validatedData = publicEntityCreateSchema.parse(rawData);
    const publicEntity = await publicEntityService.update(id, validatedData);
    revalidatePath("/home/entidades");
    return { success: true, data: publicEntity };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error updating public entity",
    };
  }
};

// Delete a public entity
export const deletePublicEntity = async (id: number) => {
  await checkAuth(ROLES.SYS_ADMIN);

  try {
    await publicEntityService.delete(id);
    revalidatePath("/home/entidades");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error deleting public entity",
    };
  }
};

// Get public entity by ID
export const getPublicEntityById = async (id: number) => {
  await checkAuth(ROLES.SYS_ADMIN);
  return publicEntityService.getById(id);
};
