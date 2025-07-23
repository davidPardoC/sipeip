import { NextRequest, NextResponse } from "next/server";
import { pndObjectiveService } from "@/services";
import { pndObjectiveUpdateSchema } from "@/lib/validations/pnd-objective.validators";
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
    const id = parseInt((await params).id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid ID format" },
        { status: 400 }
      );
    }

    const pndObjective = await pndObjectiveService.getById(id);
    
    if (!pndObjective) {
      return NextResponse.json(
        { error: "PND objective not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(pndObjective);
  } catch (error) {
    console.error("Error fetching PND objective:", error);
    return NextResponse.json(
      { error: "Failed to fetch PND objective" },
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
        { error: "Invalid ID format" },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    // Validate request body
    const validatedData = pndObjectiveUpdateSchema.parse(body);

    const updatedPndObjective = await pndObjectiveService.update(id, validatedData);
    return NextResponse.json(updatedPndObjective[0]);
  } catch (error) {
    console.error("Error updating PND objective:", error);
    
    if (error instanceof ZodError) {
      return NextResponse.json(
        { 
          error: "Validation error", 
          details: error.errors 
        },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      if (error.message.includes("not found")) {
        return NextResponse.json(
          { error: error.message },
          { status: 404 }
        );
      }
      
      if (error.message.includes("already exists")) {
        return NextResponse.json(
          { error: error.message },
          { status: 409 }
        );
      }
    }
    
    return NextResponse.json(
      { error: "Failed to update PND objective" },
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
        { error: "Invalid ID format" },
        { status: 400 }
      );
    }

    await pndObjectiveService.delete(id);
    return NextResponse.json({ message: "PND objective deleted successfully" });
  } catch (error) {
    console.error("Error deleting PND objective:", error);
    
    if (error instanceof Error && error.message.includes("not found")) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to delete PND objective" },
      { status: 500 }
    );
  }
}
