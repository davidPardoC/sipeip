import { db } from "@/infraestructure/database/connection";
import {
    project,
    institutionalPlan,
    program,
} from "@/infraestructure/database/schemas";
import { count, desc, eq, isNull, sql } from "drizzle-orm";
import { ProjectStatusEnum } from "@/infraestructure/database/schemas/status-enum";

export class DashboardService {
    async getMetrics() {
        const [projectCount] = await db
            .select({ count: count() })
            .from(project)
            .where(isNull(project.deletedAt));

        const [activeProjectCount] = await db
            .select({ count: count() })
            .from(project)
            .where(
                sql`${project.status} = ${"ACTIVE"} AND ${project.deletedAt} IS NULL`
            );

        const [planCount] = await db
            .select({ count: count() })
            .from(institutionalPlan)
            .where(isNull(institutionalPlan.deletedAt));

        const [totalBudget] = await db
            .select({ sum: sql<number>`sum(${project.budget})` })
            .from(project)
            .where(isNull(project.deletedAt));

        return {
            totalProjects: projectCount?.count || 0,
            activeProjects: activeProjectCount?.count || 0,
            totalPlans: planCount?.count || 0,
            totalBudget: totalBudget?.sum || 0,
        };
    }

    async getRecentProjects() {
        return await db
            .select({
                id: project.id,
                code: project.code,
                name: program.name, // Using program name as project name proxy if project doesn't have a name field, checking schema... project has code, cup, budget. Program has name.
                updatedAt: project.updatedAt,
                status: project.status,
            })
            .from(project)
            .leftJoin(program, eq(project.programId, program.id))
            .where(isNull(project.deletedAt))
            .orderBy(desc(project.updatedAt))
            .limit(5);
    }

    async getProjectStatusDistribution() {
        const statusCounts = await db
            .select({
                status: project.status,
                count: count(),
            })
            .from(project)
            .where(isNull(project.deletedAt))
            .groupBy(project.status);

        // Normalize to ensure we return a convenient format
        return statusCounts.map(item => ({
            name: item.status || 'Unknown',
            value: item.count
        }));
    }
}

export const dashboardService = new DashboardService();
