import { NextRequest, NextResponse } from "next/server";
import { strategicObjectiveService } from "@/services";
import { checkAuth } from "@/lib/auth.utils";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET: Calculate and return objective fulfillment status
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await checkAuth();

    const id = parseInt((await params).id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid objective ID" },
        { status: 400 }
      );
    }

    // Get objective details
    const objective = await strategicObjectiveService.getById(id);

    if (!objective) {
      return NextResponse.json(
        { error: "Objective not found" },
        { status: 404 }
      );
    }

    // Get linked activities
    const linkedActivities =
      await strategicObjectiveService.getLinkedActivities(id);

    // Calculate fulfillment status
    const calculatedStatus =
      await strategicObjectiveService.calculateFulfillmentStatus(id);

    // Calculate activity counts
    const completedCount = linkedActivities.filter(
      (activity) => activity.reportedStatus === "COMPLETADA"
    ).length;

    const inProgressCount = linkedActivities.filter(
      (activity) =>
        activity.reportedStatus === "NO_INICIADA" ||
        activity.reportedStatus === "EN_RIESGO"
    ).length;

    const notStartedCount = linkedActivities.filter(
      (activity) => activity.reportedStatus === "NO_INICIADA"
    ).length;

    const atRiskCount = linkedActivities.filter(
      (activity) => activity.reportedStatus === "EN_RIESGO"
    ).length;

    const completionRate =
      linkedActivities.length > 0
        ? ((completedCount / linkedActivities.length) * 100).toFixed(2)
        : "0.00";

    return NextResponse.json({
      objective: {
        id: objective.id,
        code: objective.code,
        name: objective.name,
        description: objective.description,
        fulfillmentRule: objective.fulfillmentRule || "AND",
        fulfillmentStatus: objective.fulfillmentStatus,
        calculatedStatus,
      },
      linkedActivities: linkedActivities.map((activity) => ({
        id: activity.id,
        activityCode: activity.activityCode,
        name: activity.name,
        status: activity.status,
        reportedStatus: activity.reportedStatus,
        actualProgress: activity.actualProgress,
        plannedProgress: activity.plannedProgress,
      })),
      summary: {
        totalActivities: linkedActivities.length,
        completedCount,
        inProgressCount,
        notStartedCount,
        atRiskCount,
        completionRate: parseFloat(completionRate),
      },
      fulfillmentAnalysis: {
        rule: objective.fulfillmentRule || "AND",
        currentStatus: calculatedStatus,
        requiresAllActivities: objective.fulfillmentRule === "AND",
        requiresAtLeastOne: objective.fulfillmentRule === "OR",
        isFulfilled: calculatedStatus === "CUMPLIDO",
      },
    });
  } catch (error) {
    console.error("Error calculating objective fulfillment:", error);

    if (error instanceof Error && error.message.includes("not found")) {
      return NextResponse.json(
        { error: "Objective not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to calculate objective fulfillment" },
      { status: 500 }
    );
  }
}

// PUT: Update objective fulfillment status
export async function PUT(request: NextRequest, { params }: RouteParams) {
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
        { error: "Invalid objective ID" },
        { status: 400 }
      );
    }

    // Recalculate and update fulfillment status
    const updatedObjective =
      await strategicObjectiveService.updateFulfillmentStatus(id);

    return NextResponse.json({
      success: true,
      objective: updatedObjective[0],
      message: "Fulfillment status updated successfully",
    });
  } catch (error) {
    console.error("Error updating objective fulfillment:", error);

    if (error instanceof Error && error.message.includes("not found")) {
      return NextResponse.json(
        { error: "Objective not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update objective fulfillment" },
      { status: 500 }
    );
  }
}
