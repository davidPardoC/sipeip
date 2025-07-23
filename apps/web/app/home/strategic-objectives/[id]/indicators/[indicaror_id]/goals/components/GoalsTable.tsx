"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Target } from "lucide-react";
import { Goal } from "@/types/domain/goal.entity";
import GoalForm from "./GoalForm";
import DeleteGoalDialog from "./DeleteGoalDialog";

interface GoalsTableProps {
  goals: Goal[];
  indicatorId: number;
  onGoalUpdated: () => void;
}

const GoalsTable = ({ goals, indicatorId, onGoalUpdated }: GoalsTableProps) => {
  const formatDateTime = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string | null) => {
    if (!status) return <Badge variant="secondary">N/A</Badge>;

    const variants = {
      ACTIVE: "default",
      INACTIVE: "secondary",
      ARCHIVED: "destructive",
    } as const;

    const labels = {
      ACTIVE: "Activo",
      INACTIVE: "Inactivo",
      ARCHIVED: "Archivado",
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const calculateProgress = (targetValue: string, actualValue?: string | null) => {
    if (!actualValue || !targetValue) return null;
    
    const target = parseFloat(targetValue);
    const actual = parseFloat(actualValue);
    
    if (target === 0) return null;
    
    const percentage = (actual / target) * 100;
    return Math.round(percentage * 100) / 100; // Round to 2 decimal places
  };

  const getProgressBadge = (progress: number | null) => {
    if (progress === null) return <Badge variant="outline">Sin progreso</Badge>;

    if (progress >= 100) {
      return <Badge variant="default">Completado ({progress}%)</Badge>;
    } else if (progress >= 75) {
      return <Badge variant="default">En progreso ({progress}%)</Badge>;
    } else if (progress >= 50) {
      return <Badge variant="secondary">En progreso ({progress}%)</Badge>;
    } else {
      return <Badge variant="destructive">Bajo progreso ({progress}%)</Badge>;
    }
  };

  if (goals.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="flex flex-col items-center justify-center space-y-3">
          <Target className="h-12 w-12 text-muted-foreground/50" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              No hay metas registradas
            </p>
            <p className="text-xs text-muted-foreground/70">
              Crea tu primera meta para comenzar
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">ID</TableHead>
            <TableHead>Año</TableHead>
            <TableHead>Valor Meta</TableHead>
            <TableHead>Valor Actual</TableHead>
            <TableHead>Progreso</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Creado</TableHead>
            <TableHead>Actualizado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {goals.map((goal) => {
            const progress = calculateProgress(goal.targetValue, goal.actualValue);
            return (
              <TableRow key={goal.id}>
                <TableCell className="font-medium">{goal.id}</TableCell>
                <TableCell>
                  <Badge variant="outline">{goal.year}</Badge>
                </TableCell>
                <TableCell>
                  <span className="font-mono text-sm">{goal.targetValue}</span>
                </TableCell>
                <TableCell>
                  <span className="font-mono text-sm">
                    {goal.actualValue || "Sin registrar"}
                  </span>
                </TableCell>
                <TableCell>{getProgressBadge(progress)}</TableCell>
                <TableCell>{getStatusBadge(goal.status)}</TableCell>
                <TableCell>{formatDateTime(goal.createdAt)}</TableCell>
                <TableCell>{formatDateTime(goal.updatedAt)}</TableCell>
                <TableCell className="text-right space-x-2">
                  <GoalForm 
                    goal={goal}
                    indicatorId={indicatorId}
                    onGoalSaved={onGoalUpdated}
                    trigger={
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                    }
                  />
                  <DeleteGoalDialog 
                    goal={goal}
                    indicatorId={indicatorId}
                    onGoalDeleted={onGoalUpdated} 
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default GoalsTable;
