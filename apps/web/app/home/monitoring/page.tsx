"use client";

import React, { useEffect, useState } from "react";
import { Activity } from "@/types/domain/activity.entity";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, AlertTriangle, CheckCircle, Clock } from "lucide-react";

export default function MonitoringPage() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [projectId, setProjectId] = useState<string>(""); // Optional filter

    useEffect(() => {
        fetchActivities();
    }, [projectId]);

    const fetchActivities = async () => {
        setLoading(true);
        try {
            const url = projectId
                ? `/api/activities?projectId=${projectId}`
                : `/api/activities`;
            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                setActivities(data);
            }
        } catch (error) {
            console.error("Failed to fetch activities", error);
        } finally {
            setLoading(false);
        }
    };

    const calculateTimeVariation = (activity: Activity) => {
        if (!activity.realEndDate || !activity.endDate) return "-";
        const real = new Date(activity.realEndDate).getTime();
        const planned = new Date(activity.endDate).getTime();
        const diffDays = Math.ceil((real - planned) / (1000 * 60 * 60 * 24));

        if (diffDays > 0) return `+${diffDays} días`;
        if (diffDays < 0) return `${diffDays} días`;
        return "0 días";
    };

    const getStatusBadge = (status: string | undefined) => {
        if (!status) return <span className="text-gray-500">Sin estado</span>;

        switch (status) {
            case "COMPLETADA":
                return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center gap-1"><CheckCircle size={14} /> Completada</span>;
            case "EN_RIESGO":
                return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full flex items-center gap-1"><AlertTriangle size={14} /> En Riesgo</span>;
            case "NO_INICIADA":
            default:
                return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full flex items-center gap-1"><Clock size={14} /> {status}</span>;
        }
    };

    const handleExport = (format: 'pdf' | 'csv') => {
        // Logic to trigger download
        window.open(`/api/monitoring/report?format=${format}&projectId=${projectId || 1}`, '_blank');
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Monitoreo de Actividades e Indicadores</h1>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => handleExport('csv')}>Exportar CSV</Button>
                    <Button onClick={() => handleExport('pdf')}>Exportar PDF</Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Tablero de Control</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center p-4">
                            <Loader2 className="animate-spin" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Código</TableHead>
                                    <TableHead>Actividad</TableHead>
                                    <TableHead>Prioridad</TableHead>
                                    <TableHead>Progreso (%)</TableHead>
                                    <TableHead>Variación de Tiempo</TableHead>
                                    <TableHead>Estado Cumplimiento</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {activities.map((activity) => (
                                    <TableRow key={activity.id}>
                                        <TableCell>{activity.code || "-"}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{activity.name}</span>
                                                <span className="text-xs text-gray-500">{activity.responsiblePerson}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{activity.priority}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 max-w-[100px]">
                                                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${activity.progressPercent || 0}%` }}></div>
                                                </div>
                                                <span>{activity.progressPercent}%</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{calculateTimeVariation(activity)}</TableCell>
                                        <TableCell>{getStatusBadge(activity.reportedStatus)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
