import { NextRequest, NextResponse } from "next/server";
import { activityService } from "@/services";
import { activityUpdateSchema } from "@/lib/validations/activity.validators";
import { checkAuth } from "@/lib/auth.utils";
import { ZodError } from "zod";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Check authentication
    await checkAuth();
    
    const id = parseInt((await params).id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid activity ID" },
        { status: 400 }
      );
    }

    const activity = await activityService.getById(id);
    
    if (!activity) {
      return NextResponse.json(
        { error: "Activity not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(activity);
  } catch (error) {
    console.error("Error fetching activity:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Check authentication and get user session
    const session = await checkAuth();
    
    if (!session.user?.id) {
      return NextResponse.json(
        { error: "User not found in session" },
        { status: 401 }
      );
    }
    
    const id = parseInt((await params).id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid activity ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    // Add the updatedBy field with the user ID from session
    const activityData = {
      ...body,
      updatedBy: session.user.id,
    };
    
    // Validate request body
    const validatedData = activityUpdateSchema.parse(activityData);

    const activity = await activityService.update(id, validatedData);
    return NextResponse.json(activity[0]);
  } catch (error) {
    console.error("Error updating activity:", error);
    
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
      { error: "Failed to update activity" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Check authentication
    await checkAuth();
    
    const id = parseInt((await params).id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid activity ID" },
        { status: 400 }
      );
    }

    await activityService.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting activity:", error);
    return NextResponse.json(
      { error: "Failed to delete activity" },
      { status: 500 }
    );
  }
}
