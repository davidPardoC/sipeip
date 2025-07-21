import { institutionalPlanService } from "@/services";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { publicEntityId: string } }
) {
  try {
    const publicEntityId = parseInt(params.publicEntityId);
    const plans = await institutionalPlanService.getByPublicEntity(publicEntityId);
    return NextResponse.json(plans);
  } catch (error) {
    console.error("Error fetching institutional plans by public entity:", error);
    return NextResponse.json(
      { error: "Failed to fetch institutional plans" },
      { status: 500 }
    );
  }
}
