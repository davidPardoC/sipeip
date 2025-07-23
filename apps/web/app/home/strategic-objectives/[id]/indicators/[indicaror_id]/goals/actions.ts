"use server";

import { goalService } from "@/services";
import { CreateGoalData, UpdateGoalData } from "@/lib/validations/goal.validators";
import { revalidatePath } from "next/cache";

export async function createGoal(data: CreateGoalData) {
  try {
    const goal = await goalService.create(data);
    revalidatePath(`/home/strategic-objectives/*/indicators/${data.indicatorId}/goals`);
    return { success: true, data: goal[0] };
  } catch (error) {
    console.error("Error creating goal:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to create goal" 
    };
  }
}

export async function getGoalsByIndicator(indicatorId: number) {
  try {
    const goals = await goalService.getByIndicator(indicatorId);
    return goals;
  } catch (error) {
    console.error("Error fetching goals:", error);
    throw new Error("Failed to fetch goals");
  }
}

export async function getGoalById(id: number) {
  try {
    const goal = await goalService.getById(id);
    if (!goal) {
      throw new Error("Goal not found");
    }
    return goal;
  } catch (error) {
    console.error("Error fetching goal:", error);
    throw new Error("Failed to fetch goal");
  }
}

export async function updateGoal(id: number, data: UpdateGoalData) {
  try {
    const updatedGoal = await goalService.update(id, data);
    revalidatePath(`/home/strategic-objectives/*/indicators/*/goals`);
    return { success: true, data: updatedGoal[0] };
  } catch (error) {
    console.error("Error updating goal:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to update goal" 
    };
  }
}

export async function deleteGoal(id: number, indicatorId: number) {
  try {
    await goalService.delete(id);
    revalidatePath(`/home/strategic-objectives/*/indicators/${indicatorId}/goals`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting goal:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to delete goal" 
    };
  }
}
