import React, { Suspense } from "react";
import { dashboardService } from "@/services/dashboard.service";
import { DashboardMetrics } from "./_components/dashboard-metrics";
import { RecentProjects } from "./_components/recent-projects";
import { ProjectStatusChart } from "./_components/project-status-chart";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = "force-dynamic";

const Page = async () => {
  const metrics = await dashboardService.getMetrics();
  const recentProjects = await dashboardService.getRecentProjects();
  const statusDistribution = await dashboardService.getProjectStatusDistribution();

  // Map database status to readable names if needed, or use as is
  const chartData = statusDistribution.map((item) => ({
    name: item.name || "Desconocido",
    value: item.value,
  }));

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Tablero de Control</h2>
      </div>
      <Suspense fallback={<DashboardSkeleton />}>
        <div className="space-y-4">
          <DashboardMetrics metrics={metrics} />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <RecentProjects projects={recentProjects} />
            <div className="col-span-4 lg:col-span-4">
              {/* Re-adjusting grid cols. Recent is col-span-4 lg:col-span-3. Chart is col-span-4. 
                   Grid cols 7: 3 + 4 = 7. 
               */}
              <ProjectStatusChart data={chartData} />
            </div>
          </div>
        </div>
      </Suspense>
    </div>
  );
};

function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-[120px] rounded-xl" />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Skeleton className="col-span-4 lg:col-span-3 h-[400px] rounded-xl" />
        <Skeleton className="col-span-4 lg:col-span-4 h-[400px] rounded-xl" />
      </div>
    </div>
  );
}

export default Page;
