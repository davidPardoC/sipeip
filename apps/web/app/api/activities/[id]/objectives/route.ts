import { NextRequest, NextResponse } from "next/server";
import { activityService } from "@/services";
import { checkAuth } from "@/lib/auth.utils";
import { z } from "zod";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET: Retrieve objectives linked to an activity
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

    const objectives = await activityService.getObjectives(id);
    return NextResponse.json(objectives);
  } catch (error) {
    console.error("Error fetching activity objectives:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity objectives" },
      { status: 500 }
    );
  }
}

// POST: Link objectives to an activity
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await checkAuth();

    if (!session.user?.id) {
      return NextResponse.json(
        { error: "User not found in session" },
        { status: 401 }
      );
    }

    const id = parseInt((await params).id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid activity ID" },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Validate objectiveIds array
    const schema = z.object({
      objectiveIds: z
        .array(z.number().int().positive())
        .min(1, "At least one objective required"),
    });

    const { objectiveIds } = schema.parse(body);

    await activityService.linkObjectives(id, objectiveIds, session.user.id);

    return NextResponse.json({ success: true, objectiveIds });
  } catch (error) {
    console.error("Error linking objectives:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to link objectives" },
      { status: 500 }
    );
  }
}
