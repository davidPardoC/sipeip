import { NextRequest, NextResponse } from "next/server";
import { odsGoalService } from "@/services";
import { odsGoalCreateSchema } from "@/lib/validations/ods-goal.validators";
import { ZodError } from "zod";

export async function GET() {
  try {
    const odsGoals = await odsGoalService.getAll();
    return NextResponse.json(odsGoals);
  } catch (error) {
    console.error("Error fetching ODS goals:", error);
    return NextResponse.json(
      { error: "Failed to fetch ODS goals" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = odsGoalCreateSchema.parse(body);

    const odsGoal = await odsGoalService.create(validatedData);
    return NextResponse.json(odsGoal[0], { status: 201 });
  } catch (error) {
    console.error("Error creating ODS goal:", error);
    
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
      { error: "Failed to create ODS goal" },
      { status: 500 }
    );
  }
}
