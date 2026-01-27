import { NextRequest, NextResponse } from "next/server";
import { activityService } from "@/services";
import { checkAuth } from "@/lib/auth.utils";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET: Calculate and return all three indicators for an activity
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await checkAuth();

    const id = parseInt((await params).id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid activity ID" },
        { status: 400 }
      );
    }

    const indicators = await activityService.calculateIndicators(id);

    return NextResponse.json(indicators);
  } catch (error) {
    console.error("Error calculating indicators:", error);

    if (error instanceof Error && error.message.includes("not found")) {
      return NextResponse.json({ error: "Activity not found" }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Failed to calculate indicators" },
      { status: 500 }
    );
  }
}
