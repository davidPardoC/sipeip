"use server";

import { revalidatePath } from "next/cache";
import { odsGoalCreateSchema, odsGoalUpdateSchema } from "@/lib/validations/ods-goal.validators";
import { OdsGoal } from "@/types/domain/ods-goal.entity";
import { odsGoalService } from "@/services";

export async function getOdsGoals(): Promise<OdsGoal[]> {
  try {
    const response = await odsGoalService.getAll()

    return response
  } catch (error) {
    console.error("Error fetching ODS goals:", error);
    throw error;
  }
}

export async function createOdsGoal(formData: FormData) {
  try {
    const data = {
      code: formData.get("code") as string,
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      createdBy: formData.get("createdBy") as string,
    };

    const validatedData = odsGoalCreateSchema.parse(data);

    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/ods-goals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.error || "Failed to create ODS goal",
      };
    }

    revalidatePath("/home/ods");
    return { success: true };
  } catch (error) {
    console.error("Error creating ODS goal:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create ODS goal",
    };
  }
}

export async function updateOdsGoal(id: number, formData: FormData) {
  try {
    const data = {
      code: formData.get("code") as string,
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      updatedBy: formData.get("updatedBy") as string,
    };

    const validatedData = odsGoalUpdateSchema.parse(data);

    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/ods-goals/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.error || "Failed to update ODS goal",
      };
    }

    revalidatePath("/home/ods");
    return { success: true };
  } catch (error) {
    console.error("Error updating ODS goal:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update ODS goal",
    };
  }
}

export async function deleteOdsGoal(id: number) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/ods-goals/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.error || "Failed to delete ODS goal",
      };
    }

    revalidatePath("/home/ods");
    return { success: true };
  } catch (error) {
    console.error("Error deleting ODS goal:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete ODS goal",
    };
  }
}
