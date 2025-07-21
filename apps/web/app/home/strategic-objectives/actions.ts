"use server";

import { strategicObjectiveService, institutionalPlanService } from "@/services";
import { StrategicObjectiveCreateInput, StrategicObjectiveUpdateInput } from "@/lib/validations/strategic-objective.validators";
import { revalidatePath } from "next/cache";

export async function getStrategicObjectives() {
  try {
    return await strategicObjectiveService.getAll();
  } catch (error) {
    console.error("Error fetching strategic objectives:", error);
    throw new Error("Failed to fetch strategic objectives");
  }
}

export async function getStrategicObjectivesByInstitutionalPlan(institutionalPlanId: number) {
  try {
    return await strategicObjectiveService.getByInstitutionalPlan(institutionalPlanId);
  } catch (error) {
    console.error("Error fetching strategic objectives by institutional plan:", error);
    throw new Error("Failed to fetch strategic objectives");
  }
}

export async function getStrategicObjectiveById(id: number) {
  try {
    return await strategicObjectiveService.getById(id);
  } catch (error) {
    console.error("Error fetching strategic objective:", error);
    throw new Error("Failed to fetch strategic objective");
  }
}

export async function getInstitutionalPlansForObjectives() {
  try {
    return await institutionalPlanService.getAll();
  } catch (error) {
    console.error("Error fetching institutional plans:", error);
    throw new Error("Failed to fetch institutional plans");
  }
}

export async function createStrategicObjective(data: StrategicObjectiveCreateInput) {
  try {
    const result = await strategicObjectiveService.create(data);
    revalidatePath("/home/strategic-objectives");
    return { success: true, data: result[0] };
  } catch (error) {
    console.error("Error creating strategic objective:", error);
    return { success: false, error: "Failed to create strategic objective" };
  }
}

export async function updateStrategicObjective(id: number, data: StrategicObjectiveUpdateInput) {
  try {
    const result = await strategicObjectiveService.update(id, data);
    revalidatePath("/home/strategic-objectives");
    return { success: true, data: result[0] };
  } catch (error) {
    console.error("Error updating strategic objective:", error);
    return { success: false, error: "Failed to update strategic objective" };
  }
}

export async function deleteStrategicObjective(id: number) {
  try {
    await strategicObjectiveService.delete(id);
    revalidatePath("/home/strategic-objectives");
    return { success: true };
  } catch (error) {
    console.error("Error deleting strategic objective:", error);
    return { success: false, error: "Failed to delete strategic objective" };
  }
}
