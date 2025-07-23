import { NextRequest, NextResponse } from "next/server";
import { projectService } from "@/services";
import { projectUpdateSchema } from "@/lib/validations/project.validators";
import { ZodError } from "zod";
import { z } from "zod";
import { Project } from "@/types/domain/project.entity";

// Schema for status-only updates
const statusUpdateSchema = z.object({
  status: z.enum([
    "ACTIVE", 
    "SEND_FOR_APPROVAL", 
    "INACTIVE", 
    "COMPLETED", 
    "CANCELLED", 
    "ON_HOLD", 
    "REJECTED", 
    "APPROVED"
  ])
});

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
    const id = parseInt((await params).id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid project ID" },
        { status: 400 }
      );
    }

    const project = await projectService.getById(id);
    
    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const id = parseInt((await params).id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid project ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    // Validate request body
    const validatedData = projectUpdateSchema.parse(body);

    const project = await projectService.update(id, validatedData  as Project);
    return NextResponse.json(project[0]);
  } catch (error) {
    console.error("Error updating project:", error);
    
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
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const id = parseInt((await params).id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid project ID" },
        { status: 400 }
      );
    }

    await projectService.delete(id);
    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const id = parseInt((await params).id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid project ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    // Validate request body for status update
    const validatedData = statusUpdateSchema.parse(body);

    const project = await projectService.update(id, validatedData as Project);
    return NextResponse.json(project[0]);
  } catch (error) {
    console.error("Error updating project status:", error);
    
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
      { error: "Failed to update project status" },
      { status: 500 }
    );
  }
}
