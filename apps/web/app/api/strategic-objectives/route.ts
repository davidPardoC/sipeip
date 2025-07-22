import { NextResponse } from "next/server";
import { strategicObjectiveService } from "@/services";

export async function GET() {
  try {
    const strategicObjectives = await strategicObjectiveService.getAll();
    return NextResponse.json(strategicObjectives);
  } catch (error) {
    console.error("Error fetching strategic objectives:", error);
    return NextResponse.json(
      { error: "Failed to fetch strategic objectives" },
      { status: 500 }
    );
  }
}
