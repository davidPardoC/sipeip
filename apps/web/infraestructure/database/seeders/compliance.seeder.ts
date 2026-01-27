
import { db } from "../connection.ts";
import { strategicObjective } from "../schemas/strategic-objectives.ts";
import { indicator } from "../schemas/indicator.ts";
import { goal } from "../schemas/goal.ts";
import { ComplianceRuleEnum } from "../schemas/status-enum.ts";

export async function seedComplianceData() {
    console.log("Starting Compliance Data Seeding...");

    const timestamp = new Date().toISOString();
    // Use a unique suffix to avoid collision if run multiple times
    const suffix = Math.floor(Math.random() * 10000);

    // 1. Create Strategic Objectives (AND / OR)
    const objAnd = await db.insert(strategicObjective).values({
        code: `SO-AND-${suffix}`,
        name: `Strategic Objective (AND Rule) - ${suffix}`,
        description: "Requires ALL indicators to be met.",
        status: "ACTIVE",
        complianceRule: "AND",
        startTime: timestamp,
        endTime: timestamp,
        createdBy: "seeder"
    }).returning();

    const objOr = await db.insert(strategicObjective).values({
        code: `SO-OR-${suffix}`,
        name: `Strategic Objective (OR Rule) - ${suffix}`,
        description: "Requires AT LEAST ONE indicator to be met.",
        status: "ACTIVE",
        complianceRule: "OR",
        startTime: timestamp,
        endTime: timestamp,
        createdBy: "seeder"
    }).returning();

    console.log("Created Objectives:", objAnd[0].id, objOr[0].id);

    // 2. Create Indicators for AND Objective (Ind 1 & Ind 2)
    const indAnd1 = await db.insert(indicator).values({
        ownerType: "StrategicObjective",
        ownerId: objAnd[0].id,
        name: `Indicator 1 for AND - ${suffix}`,
        unit: "Percent",
        formula: "X",
        baseline: "0",
        status: "ACTIVE",
        createdBy: "seeder"
    }).returning();

    const indAnd2 = await db.insert(indicator).values({
        ownerType: "StrategicObjective",
        ownerId: objAnd[0].id,
        name: `Indicator 2 for AND - ${suffix}`,
        unit: "Number",
        formula: "Y",
        baseline: "0",
        status: "ACTIVE",
        createdBy: "seeder"
    }).returning();

    // 3. Create Indicators for OR Objective
    const indOr1 = await db.insert(indicator).values({
        ownerType: "StrategicObjective",
        ownerId: objOr[0].id,
        name: `Indicator 1 for OR - ${suffix}`,
        unit: "Percent",
        formula: "Z",
        baseline: "0",
        status: "ACTIVE",
        createdBy: "seeder"
    }).returning();

    // 4. Create Measurements (Scenario: AND fails, OR succeeds)
    const currentYear = new Date().getFullYear();

    // AND Rule: Ind1 Met, Ind2 Not Met -> Objective Fails
    await db.insert(goal).values({
        indicatorId: indAnd1[0].id,
        period: "2024-Q1",
        year: currentYear,
        targetValue: "100",
        actualValue: "100",
        status: "ACTIVE",
        createdBy: "seeder"
    });

    await db.insert(goal).values({
        indicatorId: indAnd2[0].id,
        period: "2024-Q1",
        year: currentYear,
        targetValue: "100",
        actualValue: "50",
        status: "ACTIVE",
        createdBy: "seeder"
    });

    // OR Rule: Ind1 Met -> Objective In Progress/Met
    await db.insert(goal).values({
        indicatorId: indOr1[0].id,
        period: "2024-Q1",
        year: currentYear,
        targetValue: "80",
        actualValue: "90",
        status: "ACTIVE",
        createdBy: "seeder"
    });

    console.log("Compliance seeding completed.");
}
