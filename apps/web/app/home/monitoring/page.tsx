"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import ScenarioView from "./components/scenario-view";
import IndicatorChart from "./components/indicator-chart";

interface DashboardData {
  summary: {
    activities: {
      total: number;
      completed: number;
      atRisk: number;
      notStarted: number;
      overdue: number;
      completionRate: number;
      averageProgress: number;
    };
    objectives: {
      total: number;
      fulfilled: number;
      inProgress: number;
      notFulfilled: number;
    };
  };
  charts: {
    activitiesByStatus: Record<string, number>;
    activitiesByPriority: Record<number, number>;
    objectivesByRule: { AND: number; OR: number };
    objectivesByFulfillment: Record<string, number>;
  };
  alerts: {
    highPriorityAtRisk: Array<{
      id: number;
      activityCode: string;
      name: string;
      priority: number;
      endDate: string;
    }>;
  };
  scenarios: {
    scenario1_AND_fulfilled: {
      description: string;
      objectives: Array<{
        id: number;
        code: string;
        name: string;
        fulfillmentStatus: string;
      }>;
    };
    scenario2_OR_fulfilled: {
      description: string;
      objectives: Array<{
        id: number;
        code: string;
        name: string;
        fulfillmentStatus: string;
      }>;
    };
    scenario3_none_fulfilled: {
      description: string;
      objectives: Array<{
        id: number;
        code: string;
        name: string;
        fulfillmentStatus: string;
      }>;
    };
  };
  timestamp: string;
}

export default function MonitoringPage() {
  const [dashboardData, setDashboardData] = React.useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/monitoring/dashboard");
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }
      const data = await response.json();
      setDashboardData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando panel de monitoreo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="max-w-md">
          <CardContent className="p-6">
            <p className="text-red-500">Error: {error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Panel de Monitoreo</h1>
        <Badge variant="outline">
          Actualizado: {new Date(dashboardData.timestamp).toLocaleString()}
        </Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Actividades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {dashboardData.summary.activities.total}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {dashboardData.summary.activities.completionRate.toFixed(1)}% completadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Actividades en Riesgo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">
              {dashboardData.summary.activities.atRisk}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Requieren atención inmediata
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Objetivos Cumplidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">
              {dashboardData.summary.objectives.fulfilled}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              De {dashboardData.summary.objectives.total} totales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Progreso Promedio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {dashboardData.summary.activities.averageProgress.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Avance general del sistema
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <IndicatorChart
          title="Actividades por Estado"
          data={dashboardData.charts.activitiesByStatus}
          type="pie"
        />
        <IndicatorChart
          title="Actividades por Prioridad"
          data={dashboardData.charts.activitiesByPriority}
          type="bar"
        />
      </div>

      {/* High Priority Alerts */}
      {dashboardData.alerts.highPriorityAtRisk.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-700">
              Alertas de Alta Prioridad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {dashboardData.alerts.highPriorityAtRisk.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-3 bg-white rounded-lg"
                >
                  <div>
                    <p className="font-medium">
                      {alert.activityCode} - {alert.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Vence: {new Date(alert.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="destructive">Prioridad {alert.priority}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scenario Views */}
      <Tabs defaultValue="scenario1" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="scenario1">
            Escenario 1: Regla AND (Cumplido)
          </TabsTrigger>
          <TabsTrigger value="scenario2">
            Escenario 2: Regla OR (Al menos uno)
          </TabsTrigger>
          <TabsTrigger value="scenario3">
            Escenario 3: No Cumplido
          </TabsTrigger>
        </TabsList>
        <TabsContent value="scenario1">
          <ScenarioView
            title={dashboardData.scenarios.scenario1_AND_fulfilled.description}
            objectives={dashboardData.scenarios.scenario1_AND_fulfilled.objectives}
            scenarioType="AND"
          />
        </TabsContent>
        <TabsContent value="scenario2">
          <ScenarioView
            title={dashboardData.scenarios.scenario2_OR_fulfilled.description}
            objectives={dashboardData.scenarios.scenario2_OR_fulfilled.objectives}
            scenarioType="OR"
          />
        </TabsContent>
        <TabsContent value="scenario3">
          <ScenarioView
            title={dashboardData.scenarios.scenario3_none_fulfilled.description}
            objectives={dashboardData.scenarios.scenario3_none_fulfilled.objectives}
            scenarioType="NONE"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
