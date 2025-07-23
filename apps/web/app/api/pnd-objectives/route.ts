import { NextRequest, NextResponse } from "next/server";
import { pndObjectiveService } from "@/services";
import { pndObjectiveCreateSchema } from "@/lib/validations/pnd-objective.validators";
import { ZodError } from "zod";

export async function GET() {
  try {
    const pndObjectives = await pndObjectiveService.getAll();
    return NextResponse.json(pndObjectives);
  } catch (error) {
    console.error("Error fetching PND objectives:", error);
    return NextResponse.json(
      { error: "Failed to fetch PND objectives" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = pndObjectiveCreateSchema.parse(body);

    const pndObjective = await pndObjectiveService.create(validatedData);
    return NextResponse.json(pndObjective[0], { status: 201 });
  } catch (error) {
    console.error("Error creating PND objective:", error);
    
    if (error instanceof ZodError) {
      return NextResponse.json(
        { 
          error: "Validation error", 
          details: error.errors 
        },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message.includes("already exists")) {
      return NextResponse.json(
        { error: error.message },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to create PND objective" },
      { status: 500 }
    );
  }
}
