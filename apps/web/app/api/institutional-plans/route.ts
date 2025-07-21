import { institutionalPlanService } from "@/services";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const plans = await institutionalPlanService.getAll();
    return NextResponse.json(plans);
  } catch (error) {
    console.error("Error fetching institutional plans:", error);
    return NextResponse.json(
      { error: "Failed to fetch institutional plans" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newPlan = await institutionalPlanService.create(body);
    return NextResponse.json(newPlan[0], { status: 201 });
  } catch (error) {
    console.error("Error creating institutional plan:", error);
    return NextResponse.json(
      { error: "Failed to create institutional plan" },
      { status: 500 }
    );
  }
}
