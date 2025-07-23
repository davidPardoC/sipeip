"use server";

import { indicatorService } from "@/services";
import { CreateIndicatorData, UpdateIndicatorData } from "@/lib/validations/indicator.validators";
import { revalidatePath } from "next/cache";

export async function createIndicator(data: CreateIndicatorData) {
  try {
    const indicator = await indicatorService.create(data);
    revalidatePath(`/home/strategic-objectives/${data.ownerId}/indicators`);
    return { success: true, data: indicator[0] };
  } catch (error) {
    console.error("Error creating indicator:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to create indicator" 
    };
  }
}

export async function getIndicatorsByStrategicObjective(strategicObjectiveId: number) {
  try {
    const indicators = await indicatorService.getByStrategicObjective(strategicObjectiveId);
    return indicators;
  } catch (error) {
    console.error("Error fetching indicators:", error);
    throw new Error("Failed to fetch indicators");
  }
}

export async function getIndicatorById(id: number) {
  try {
    const indicator = await indicatorService.getById(id);
    if (!indicator) {
      throw new Error("Indicator not found");
    }
    return indicator;
  } catch (error) {
    console.error("Error fetching indicator:", error);
    throw new Error("Failed to fetch indicator");
  }
}

export async function updateIndicator(id: number, data: UpdateIndicatorData) {
  try {
    const updatedIndicator = await indicatorService.update(id, data);
    revalidatePath(`/home/strategic-objectives/*/indicators`);
    return { success: true, data: updatedIndicator[0] };
  } catch (error) {
    console.error("Error updating indicator:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to update indicator" 
    };
  }
}

export async function deleteIndicator(id: number, strategicObjectiveId: number) {
  try {
    await indicatorService.delete(id);
    revalidatePath(`/home/strategic-objectives/${strategicObjectiveId}/indicators`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting indicator:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to delete indicator" 
    };
  }
}
