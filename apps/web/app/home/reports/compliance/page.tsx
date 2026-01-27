"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock types for UI until we fetch real data
type ObjectiveStatus = "CUMPLIDO" | "NO_CUMPLIDO" | "EN_PROGRESO" | "NO_INICIADO";

interface ObjectiveReport {
    id: number;
    name: string;
    rule: "AND" | "OR";
    status: ObjectiveStatus;
    indicators: {
        id: number;
        name: string;
        target: number;
        current: number;
        status: "CUMPLIDO" | "NO_CUMPLIDO";
    }[];
}

const ComplianceReportPage = () => {
    const [objectives, setObjectives] = useState<ObjectiveReport[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real implementation, this would fetch from an API endpoint
        // that uses MonitoringService.
        // For now we simulate or we need to create an API route.
        // Let's assume we create an API route /api/reports/compliance

        // Fallback Mock Data for UI Dev
        setObjectives([
            {
                id: 1,
                name: "Mock Objective AND",
                rule: "AND",
                status: "NO_CUMPLIDO",
                indicators: [
                    { id: 1, name: "Ind 1", target: 100, current: 100, status: "CUMPLIDO" },
                    { id: 2, name: "Ind 2", target: 100, current: 50, status: "NO_CUMPLIDO" }
                ]
            },
            {
                id: 2,
                name: "Mock Objective OR",
                rule: "OR",
                status: "EN_PROGRESO",
                indicators: [
                    { id: 3, name: "Ind 1", target: 80, current: 90, status: "CUMPLIDO" }
                ]
            }
        ]);
        setLoading(false);
    }, []);

    const getStatusColor = (status: ObjectiveStatus) => {
        switch (status) {
            case "CUMPLIDO": return "bg-green-500";
            case "EN_PROGRESO": return "bg-yellow-500";
            case "NO_CUMPLIDO": return "bg-red-500";
            default: return "bg-gray-500";
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            <h1 className="text-3xl font-bold">Reporte de Cumplimiento de Objetivos</h1>

            <Tabs defaultValue="overview">
                <TabsList>
                    <TabsTrigger value="overview">Resumen Ejecutivo</TabsTrigger>
                    <TabsTrigger value="detail">Detalle por Objetivo</TabsTrigger>
                    <TabsTrigger value="indicators">Evidencia de Indicadores</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {objectives.map(obj => (
                            <Card key={obj.id}>
                                <CardHeader>
                                    <CardTitle className="flex justify-between items-center">
                                        <span>{obj.name}</span>
                                        <Badge className={getStatusColor(obj.status)}>{obj.status}</Badge>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p>Regla de Cumplimiento: <span className="font-bold">{obj.rule}</span></p>
                                    <p>Indicadores Totales: {obj.indicators.length}</p>
                                    <p>Indicadores Cumplidos: {obj.indicators.filter(i => i.status === "CUMPLIDO").length}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="detail">
                    {objectives.map(obj => (
                        <Card key={obj.id} className="mb-6">
                            <CardHeader>
                                <CardTitle>{obj.name} ({obj.rule})</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr>
                                            <th className="border-b p-2">Indicador</th>
                                            <th className="border-b p-2">Meta</th>
                                            <th className="border-b p-2">Valor Actual</th>
                                            <th className="border-b p-2">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {obj.indicators.map(ind => (
                                            <tr key={ind.id}>
                                                <td className="p-2 border-b">{ind.name}</td>
                                                <td className="p-2 border-b">{ind.target}</td>
                                                <td className="p-2 border-b">{ind.current}</td>
                                                <td className="p-2 border-b">
                                                    <Badge variant={ind.status === "CUMPLIDO" ? "default" : "destructive"}>
                                                        {ind.status}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>

                <TabsContent value="indicators">
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Desglose de Mediciones</h3>
                        <p className="text-gray-500">Vista detallada de las mediciones registradas por periodo.</p>
                        {/* Placeholder for deeper drill-down */}
                        <div className="bg-gray-100 p-4 rounded text-center">
                            Seleccione un periodo para ver el historial de mediciones.
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default ComplianceReportPage;
