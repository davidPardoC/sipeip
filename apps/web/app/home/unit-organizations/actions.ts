"use server";

import { checkAuth } from "@/lib/auth.utils";
import { organizationalUnitService } from "@/services";
import { organizationalUnitCreateSchema } from "@/lib/validations/sectors.validators";
import { revalidatePath } from "next/cache";
import { ROLES } from "@/constants/role.constants";

// Create a new organizational unit
export const createOrganizationalUnit = async (data: FormData) => {
  await checkAuth(ROLES.SYS_ADMIN);

  const rawData = {
    code: data.get("code") as string,
    name: data.get("name") as string,
    level: parseInt(data.get("level") as string),
    status: data.get("status") as "ACTIVE" | "INACTIVE" | "ARCHIVED",
    parentId: parseInt(data.get("parentId") as string),
    publicEntityId: parseInt(data.get("publicEntityId") as string),
  };

  try {
    const validatedData = organizationalUnitCreateSchema.parse(rawData);
    const organizationalUnit = await organizationalUnitService.create(validatedData);
    revalidatePath("/home/unit-organizations");
    return { success: true, data: organizationalUnit };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error creating organizational unit",
    };
  }
};

// Get all organizational units
export const getOrganizationalUnits = async () => {
  await checkAuth(ROLES.SYS_ADMIN);
  return organizationalUnitService.getAll();
};

// Get organizational units by public entity
export const getOrganizationalUnitsByPublicEntity = async (publicEntityId: number) => {
  await checkAuth(ROLES.SYS_ADMIN);
  return organizationalUnitService.getByPublicEntity(publicEntityId);
};

// Update an organizational unit
export const updateOrganizationalUnit = async (id: number, data: FormData) => {
  await checkAuth(ROLES.SYS_ADMIN);

  const rawData = {
    code: data.get("code") as string,
    name: data.get("name") as string,
    level: parseInt(data.get("level") as string),
    status: data.get("status") as "ACTIVE" | "INACTIVE" | "ARCHIVED",
    parentId: parseInt(data.get("parentId") as string),
    publicEntityId: parseInt(data.get("publicEntityId") as string),
  };

  try {
    const validatedData = organizationalUnitCreateSchema.parse(rawData);
    const organizationalUnit = await organizationalUnitService.update(id, validatedData);
    revalidatePath("/home/unit-organizations");
    return { success: true, data: organizationalUnit };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error updating organizational unit",
    };
  }
};

// Delete an organizational unit
export const deleteOrganizationalUnit = async (id: number) => {
  await checkAuth(ROLES.SYS_ADMIN);

  try {
    await organizationalUnitService.delete(id);
    revalidatePath("/home/unit-organizations");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error deleting organizational unit",
    };
  }
};

// Get organizational unit by ID
export const getOrganizationalUnitById = async (id: number) => {
  await checkAuth(ROLES.SYS_ADMIN);
  return organizationalUnitService.getById(id);
};
