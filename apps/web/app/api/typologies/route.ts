import { NextRequest, NextResponse } from "next/server";
import { typologyService } from "@/services";
import { typologyCreateSchema } from "@/lib/validations/typology.validators";
import { ZodError } from "zod";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const offset = parseInt(searchParams.get('offset') || '0');
    const limit = parseInt(searchParams.get('limit') || '50');

    let typologies;
    
    if (search) {
      typologies = await typologyService.searchByName(search);
    } else if (searchParams.get('paginated') === 'true') {
      typologies = await typologyService.getPaginated(offset, limit);
    } else {
      typologies = await typologyService.getAll();
    }

    return NextResponse.json(typologies);
  } catch (error) {
    console.error("Error fetching typologies:", error);
    return NextResponse.json(
      { error: "Failed to fetch typologies" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = typologyCreateSchema.parse(body);

    // Check if code already exists
    const codeExists = await typologyService.codeExists(validatedData.code);
    if (codeExists) {
      return NextResponse.json(
        { error: "A typology with this code already exists" },
        { status: 409 }
      );
    }

    const typology = await typologyService.create(validatedData);
    return NextResponse.json(typology[0], { status: 201 });
  } catch (error) {
    console.error("Error creating typology:", error);
    
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
      { error: "Failed to create typology" },
      { status: 500 }
    );
  }
}
