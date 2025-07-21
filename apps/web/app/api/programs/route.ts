import { NextRequest, NextResponse } from "next/server";
import { programService } from "@/services";
import { programCreateSchema } from "@/lib/validations/program.validators";
import { ZodError } from "zod";

export async function GET() {
  try {
    const programs = await programService.getAll();
    return NextResponse.json(programs);
  } catch (error) {
    console.error("Error fetching programs:", error);
    return NextResponse.json(
      { error: "Failed to fetch programs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = programCreateSchema.parse(body);

    const program = await programService.create(validatedData);
    return NextResponse.json(program[0], { status: 201 });
  } catch (error) {
    console.error("Error creating program:", error);
    
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
      { error: "Failed to create program" },
      { status: 500 }
    );
  }
}
