import { NextRequest, NextResponse } from "next/server";
import { typologyService } from "@/services";
import { typologyUpdateSchema } from "@/lib/validations/typology.validators";
import { ZodError } from "zod";

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const id = parseInt((await params).id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid typology ID" },
        { status: 400 }
      );
    }

    const typology = await typologyService.getById(id);
    
    if (!typology) {
      return NextResponse.json(
        { error: "Typology not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(typology);
  } catch (error) {
    console.error("Error fetching typology:", error);
    return NextResponse.json(
      { error: "Failed to fetch typology" },
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
        { error: "Invalid typology ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    // Validate request body
    const validatedData = typologyUpdateSchema.parse(body);

    // Check if code already exists (excluding current typology)
    if (validatedData.code) {
      const codeExists = await typologyService.codeExists(validatedData.code, id);
      if (codeExists) {
        return NextResponse.json(
          { error: "A typology with this code already exists" },
          { status: 409 }
        );
      }
    }

    const typology = await typologyService.update(id, validatedData);
    return NextResponse.json(typology[0]);
  } catch (error) {
    console.error("Error updating typology:", error);
    
    if (error instanceof ZodError) {
      return NextResponse.json(
        { 
          error: "Validation error", 
          details: error.errors 
        },
        { status: 400 }
      );
    }
    
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json(
        { error: "Typology not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to update typology" },
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
        { error: "Invalid typology ID" },
        { status: 400 }
      );
    }

    // Check if typology exists before deleting
    const existingTypology = await typologyService.getById(id);
    if (!existingTypology) {
      return NextResponse.json(
        { error: "Typology not found" },
        { status: 404 }
      );
    }

    await typologyService.delete(id);
    return NextResponse.json({ message: "Typology deleted successfully" });
  } catch (error) {
    console.error("Error deleting typology:", error);
    return NextResponse.json(
      { error: "Failed to delete typology" },
      { status: 500 }
    );
  }
}
