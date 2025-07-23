import { NextRequest, NextResponse } from "next/server";
import { odsGoalService } from "@/services";
import { odsGoalUpdateSchema } from "@/lib/validations/ods-goal.validators";
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

    const odsGoal = await odsGoalService.getById(id);
    
    if (!odsGoal) {
      return NextResponse.json(
        { error: "ODS goal not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(odsGoal);
  } catch (error) {
    console.error("Error fetching ODS goal:", error);
    return NextResponse.json(
      { error: "Failed to fetch ODS goal" },
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
    const validatedData = odsGoalUpdateSchema.parse(body);

    const updatedOdsGoal = await odsGoalService.update(id, validatedData);
    return NextResponse.json(updatedOdsGoal[0]);
  } catch (error) {
    console.error("Error updating ODS goal:", error);
    
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
      { error: "Failed to update ODS goal" },
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

    await odsGoalService.delete(id);
    return NextResponse.json({ message: "ODS goal deleted successfully" });
  } catch (error) {
    console.error("Error deleting ODS goal:", error);
    
    if (error instanceof Error && error.message.includes("not found")) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to delete ODS goal" },
      { status: 500 }
    );
  }
}
