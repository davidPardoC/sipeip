import { NextRequest, NextResponse } from "next/server";
import { activityService } from "@/services";
import { activityCreateSchema } from "@/lib/validations/activity.validators";
import { checkAuth } from "@/lib/auth.utils";
import { ZodError } from "zod";

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    await checkAuth();
    
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    if (projectId) {
      if (isNaN(parseInt(projectId))) {
        return NextResponse.json(
          { error: "Invalid project ID" },
          { status: 400 }
        );
      }
      const activities = await activityService.getByProjectId(parseInt(projectId));
      return NextResponse.json(activities);
    }

    const activities = await activityService.getAll();
    return NextResponse.json(activities);
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json(
      { error: "Failed to fetch activities" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication and get user session
    const session = await checkAuth();
    
    if (!session.user?.id) {
      return NextResponse.json(
        { error: "User not found in session" },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    
    // Create the data object with the user ID from session
    const activityData = {
      ...body,
      createdBy: session.user.id, // Extract user ID from session
    };
    
    // Validate request body
    const validatedData = activityCreateSchema.parse(activityData);

    const activity = await activityService.create(validatedData);
    return NextResponse.json(activity[0], { status: 201 });
  } catch (error) {
    console.error("Error creating activity:", error);
    
    if (error instanceof ZodError) {
      return NextResponse.json(
        { 
          error: "Validation error", 
          details: error.errors 
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to create activity" },
      { status: 500 }
    );
  }
}
