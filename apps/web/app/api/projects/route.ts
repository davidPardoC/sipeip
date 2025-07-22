import { NextRequest, NextResponse } from "next/server";
import { projectService } from "@/services";
import { projectCreateSchema } from "@/lib/validations/project.validators";
import { ZodError } from "zod";
import { Project } from "@/types/domain/project.entity";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const programId = searchParams.get('programId');

    if (programId) {
      const projects = await projectService.getByProgramId(parseInt(programId));
      return NextResponse.json(projects);
    }

    const projects = await projectService.getAll();
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = projectCreateSchema.parse(body);

    const project = await projectService.create(validatedData as Partial<Project>);
    return NextResponse.json(project[0], { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    
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
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
