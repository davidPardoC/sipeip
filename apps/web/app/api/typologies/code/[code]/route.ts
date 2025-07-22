import { NextRequest, NextResponse } from "next/server";
import { typologyService } from "@/services";

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const { code } = params;
    
    if (!code) {
      return NextResponse.json(
        { error: "Code parameter is required" },
        { status: 400 }
      );
    }

    const typology = await typologyService.getByCode(code);
    
    if (!typology) {
      return NextResponse.json(
        { error: "Typology not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(typology);
  } catch (error) {
    console.error("Error fetching typology by code:", error);
    return NextResponse.json(
      { error: "Failed to fetch typology" },
      { status: 500 }
    );
  }
}
