import { NextRequest, NextResponse } from "next/server";
import { activityService, strategicObjectiveService } from "@/services";
import { checkAuth } from "@/lib/auth.utils";

export async function GET(request: NextRequest) {
  try {
    await checkAuth();

    // Fetch all activities
    const allActivities = await activityService.getAll();

    // Fetch all strategic objectives
    const allObjectives = await strategicObjectiveService.getAll();

    // Calculate activity statistics
    const totalActivities = allActivities.length;
    const completedActivities = allActivities.filter(
      (a) => a.reportedStatus === "COMPLETADA"
    ).length;
    const atRiskActivities = allActivities.filter(
      (a) => a.reportedStatus === "EN_RIESGO"
    ).length;
    const notStartedActivities = allActivities.filter(
      (a) => a.reportedStatus === "NO_INICIADA"
    ).length;

    // Calculate completion rate
    const completionRate =
      totalActivities > 0
        ? ((completedActivities / totalActivities) * 100).toFixed(2)
        : "0.00";

    // Group activities by reported status
    const activitiesByStatus = {
      NO_INICIADA: notStartedActivities,
      EN_RIESGO: atRiskActivities,
      COMPLETADA: completedActivities,
    };

    // Group activities by priority
    const activitiesByPriority: Record<number, number> = {};
    for (const activity of allActivities) {
      const priority = activity.priority || 3;
      activitiesByPriority[priority] =
        (activitiesByPriority[priority] || 0) + 1;
    }

    // Calculate objective statistics
    const totalObjectives = allObjectives.length;
    const fulfilledObjectives = allObjectives.filter(
      (o) => o.fulfillmentStatus === "CUMPLIDO"
    ).length;
    const inProgressObjectives = allObjectives.filter(
      (o) => o.fulfillmentStatus === "EN_PROGRESO"
    ).length;
    const notFulfilledObjectives = allObjectives.filter(
      (o) => o.fulfillmentStatus === "NO_CUMPLIDO"
    ).length;

    // Group objectives by fulfillment rule
    const objectivesByRule = {
      AND: allObjectives.filter((o) => o.fulfillmentRule === "AND").length,
      OR: allObjectives.filter((o) => o.fulfillmentRule === "OR").length,
    };

    // Get high priority at-risk activities
    const highPriorityAtRisk = allActivities
      .filter(
        (a) =>
          a.reportedStatus === "EN_RIESGO" &&
          a.priority &&
          a.priority >= 4
      )
      .slice(0, 10);

    // Calculate average progress
    const totalProgress = allActivities.reduce((sum, activity) => {
      const actualProgress = parseFloat(activity.actualProgress || "0");
      return sum + actualProgress;
    }, 0);

    const averageProgress =
      totalActivities > 0
        ? (totalProgress / totalActivities).toFixed(2)
        : "0.00";

    // Time-based statistics
    const now = new Date();
    const overdueActivities = allActivities.filter((activity) => {
      if (!activity.endDate) return false;
      const endDate = new Date(activity.endDate);
      return (
        endDate < now &&
        activity.status !== "COMPLETED" &&
        activity.reportedStatus !== "COMPLETADA"
      );
    }).length;

    // Scenario demonstrations
    const scenarios = {
      scenario1_AND_fulfilled: {
        description:
          "Objectives using AND rule with all indicators met (CUMPLIDO)",
        objectives: allObjectives
          .filter(
            (o) =>
              o.fulfillmentRule === "AND" &&
              o.fulfillmentStatus === "CUMPLIDO"
          )
          .slice(0, 5)
          .map((o) => ({
            id: o.id,
            code: o.code,
            name: o.name,
            fulfillmentStatus: o.fulfillmentStatus,
          })),
      },
      scenario2_OR_fulfilled: {
        description:
          "Objectives using OR rule with at least one indicator met",
        objectives: allObjectives
          .filter(
            (o) =>
              o.fulfillmentRule === "OR" &&
              (o.fulfillmentStatus === "CUMPLIDO" ||
                o.fulfillmentStatus === "EN_PROGRESO")
          )
          .slice(0, 5)
          .map((o) => ({
            id: o.id,
            code: o.code,
            name: o.name,
            fulfillmentStatus: o.fulfillmentStatus,
          })),
      },
      scenario3_none_fulfilled: {
        description: "Objectives with no indicators met (NO_CUMPLIDO)",
        objectives: allObjectives
          .filter((o) => o.fulfillmentStatus === "NO_CUMPLIDO")
          .slice(0, 5)
          .map((o) => ({
            id: o.id,
            code: o.code,
            name: o.name,
            fulfillmentStatus: o.fulfillmentStatus,
          })),
      },
    };

    return NextResponse.json({
      summary: {
        activities: {
          total: totalActivities,
          completed: completedActivities,
          atRisk: atRiskActivities,
          notStarted: notStartedActivities,
          overdue: overdueActivities,
          completionRate: parseFloat(completionRate),
          averageProgress: parseFloat(averageProgress),
        },
        objectives: {
          total: totalObjectives,
          fulfilled: fulfilledObjectives,
          inProgress: inProgressObjectives,
          notFulfilled: notFulfilledObjectives,
        },
      },
      charts: {
        activitiesByStatus,
        activitiesByPriority,
        objectivesByRule,
        objectivesByFulfillment: {
          CUMPLIDO: fulfilledObjectives,
          EN_PROGRESO: inProgressObjectives,
          NO_CUMPLIDO: notFulfilledObjectives,
        },
      },
      alerts: {
        highPriorityAtRisk: highPriorityAtRisk.map((a) => ({
          id: a.id,
          activityCode: a.activityCode,
          name: a.name,
          priority: a.priority,
          endDate: a.endDate,
        })),
      },
      scenarios,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
