import { NextRequest, NextResponse } from "next/server";
import { projectObservationService } from "@/services";
import { projectObservationUpdateSchema } from "@/lib/validations/project-observation.validators";
import { checkAuth } from "@/lib/auth.utils";
import { ZodError } from "zod";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    await checkAuth();
    
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid observation ID" },
        { status: 400 }
      );
    }

    const observation = await projectObservationService.getById(id);
    
    if (!observation) {
      return NextResponse.json(
        { error: "Observation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(observation);
  } catch (error) {
    console.error("Error fetching project observation:", error);
    return NextResponse.json(
      { error: "Failed to fetch project observation" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
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
    
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid observation ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    // Add updatedBy from session
    const updateData = {
      ...body,
      updatedBy: session.user.id,
    };
    
    // Validate request body
    const validatedData = projectObservationUpdateSchema.parse(updateData);

    const observation = await projectObservationService.update(id, validatedData);
    
    if (!observation) {
      return NextResponse.json(
        { error: "Observation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(observation);
  } catch (error) {
    console.error("Error updating project observation:", error);
    
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
      { error: "Failed to update project observation" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    await checkAuth();
    
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid observation ID" },
        { status: 400 }
      );
    }

    await projectObservationService.delete(id);
    return NextResponse.json({ message: "Observation deleted successfully" });
  } catch (error) {
    console.error("Error deleting project observation:", error);
    return NextResponse.json(
      { error: "Failed to delete project observation" },
      { status: 500 }
    );
  }
}
