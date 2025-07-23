import { institutionalPlanService } from "@/services";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = parseInt((await params).id);
    const plan = await institutionalPlanService.getById(id);

    if (!plan) {
      return NextResponse.json(
        { error: "Institutional plan not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(plan);
  } catch (error) {
    console.error("Error fetching institutional plan:", error);
    return NextResponse.json(
      { error: "Failed to fetch institutional plan" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = parseInt((await params).id);
    const body = await request.json();
    const updatedPlan = await institutionalPlanService.update(id, body);
    return NextResponse.json(updatedPlan[0]);
  } catch (error) {
    console.error("Error updating institutional plan:", error);
    return NextResponse.json(
      { error: "Failed to update institutional plan" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = parseInt((await params).id);
    await institutionalPlanService.delete(id);
    return NextResponse.json({
      message: "Institutional plan deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting institutional plan:", error);
    return NextResponse.json(
      { error: "Failed to delete institutional plan" },
      { status: 500 }
    );
  }
}
