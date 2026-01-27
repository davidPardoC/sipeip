import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CircleDollarSign, Files, Layers } from "lucide-react";

interface DashboardMetricsProps {
    metrics: {
        totalProjects: number;
        activeProjects: number;
        totalPlans: number;
        totalBudget: number;
    };
}

export function DashboardMetrics({ metrics }: DashboardMetricsProps) {
    // Fallback formatter if utils not found
    const formatMoney = (amount: number) => {
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Proyectos</CardTitle>
                    <Files className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{metrics.totalProjects}</div>
                    <p className="text-xs text-muted-foreground">
                        Todos los proyectos en el sistema
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Proyectos Activos</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{metrics.activeProjects}</div>
                    <p className="text-xs text-muted-foreground">
                        Proyectos activos actualmente
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Planes Institucionales
                    </CardTitle>
                    <Layers className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{metrics.totalPlans}</div>
                    <p className="text-xs text-muted-foreground">
                        Planes registrados
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Presupuesto Total</CardTitle>
                    <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {formatMoney(metrics.totalBudget)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Presupuesto asignado a proyectos
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
