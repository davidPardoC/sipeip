import { NextRequest, NextResponse } from "next/server";
import { projectObservationService } from "@/services";
import { projectObservationCreateSchema } from "@/lib/validations/project-observation.validators";
import { checkAuth } from "@/lib/auth.utils";
import { ZodError } from "zod";

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    await checkAuth();
    
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    if (!projectId || isNaN(parseInt(projectId))) {
      return NextResponse.json(
        { error: "Invalid or missing project ID" },
        { status: 400 }
      );
    }

    const observations = await projectObservationService.getByProjectId(
      parseInt(projectId)
    );
    return NextResponse.json(observations);
  } catch (error) {
    console.error("Error fetching project observations:", error);
    return NextResponse.json(
      { error: "Failed to fetch project observations" },
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
    const observationData = {
      observation: body.observation,
      projectId: body.projectId,
      createdBy: session.user.id, // Extract user ID from session
    };
    
    // Validate request body
    const validatedData = projectObservationCreateSchema.parse(observationData);

    const observation = await projectObservationService.create(validatedData);
    return NextResponse.json(observation, { status: 201 });
  } catch (error) {
    console.error("Error creating project observation:", error);
    
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
      { error: "Failed to create project observation" },
      { status: 500 }
    );
  }
}
