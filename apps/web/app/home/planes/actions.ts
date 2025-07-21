"use server";

import { institutionalPlanService, publicEntityService } from "@/services";
import { InstitutionalPlanCreateInput, InstitutionalPlanUpdateInput } from "@/lib/validations/institutional-plan.validators";
import { revalidatePath } from "next/cache";
import { InstitutionalPlanWithEntity } from "@/types/domain/institutional-plan.entity";

export async function getInstitutionalPlans() {
  try {
    return await institutionalPlanService.getAll();
  } catch (error) {
    console.error("Error fetching institutional plans:", error);
    throw new Error("Failed to fetch institutional plans");
  }
}

export async function getInstitutionalPlanById(id: number) {
  try {
    return await institutionalPlanService.getById(id);
  } catch (error) {
    console.error("Error fetching institutional plan:", error);
    throw new Error("Failed to fetch institutional plan");
  }
}

export async function getInstitutionalPlansByPublicEntity(publicEntityId: number) {
  try {
    return await institutionalPlanService.getByPublicEntity(publicEntityId);
  } catch (error) {
    console.error("Error fetching institutional plans by public entity:", error);
    throw new Error("Failed to fetch institutional plans");
  }
}

export async function getPublicEntitiesForPlans() {
  try {
    return await publicEntityService.getAll();
  } catch (error) {
    console.error("Error fetching public entities:", error);
    throw new Error("Failed to fetch public entities");
  }
}

export async function createInstitutionalPlan(data: InstitutionalPlanCreateInput) {
  try {
    const result = await institutionalPlanService.create(data);
    revalidatePath("/home/planes");
    return { success: true, data: result[0] };
  } catch (error) {
    console.error("Error creating institutional plan:", error);
    return { success: false, error: "Failed to create institutional plan" };
  }
}

export async function updateInstitutionalPlan(id: number, data: InstitutionalPlanUpdateInput) {
  try {
    const result = await institutionalPlanService.update(id, data);
    revalidatePath("/home/planes");
    return { success: true, data: result[0] };
  } catch (error) {
    console.error("Error updating institutional plan:", error);
    return { success: false, error: "Failed to update institutional plan" };
  }
}

export async function deleteInstitutionalPlan(id: number) {
  try {
    await institutionalPlanService.delete(id);
    revalidatePath("/home/planes");
    return { success: true };
  } catch (error) {
    console.error("Error deleting institutional plan:", error);
    return { success: false, error: "Failed to delete institutional plan" };
  }
}
