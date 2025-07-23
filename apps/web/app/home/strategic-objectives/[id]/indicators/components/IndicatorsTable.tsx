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
import { Edit, BarChart3, Target } from "lucide-react";
import { Indicator } from "@/types/domain/indicator.entity";
import IndicatorForm from "./IndicatorForm";
import DeleteIndicatorDialog from "./DeleteIndicatorDialog";
import Link from "next/link";

interface IndicatorsTableProps {
  indicators: Indicator[];
  strategicObjectiveId: number;
  onIndicatorUpdated: () => void;
}

const IndicatorsTable = ({ 
  indicators, 
  strategicObjectiveId, 
  onIndicatorUpdated 
}: IndicatorsTableProps) => {
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

  if (indicators.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="flex flex-col items-center justify-center space-y-3">
          <BarChart3 className="h-12 w-12 text-muted-foreground/50" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              No hay indicadores registrados
            </p>
            <p className="text-xs text-muted-foreground/70">
              Crea tu primer indicador para comenzar
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
            <TableHead>Nombre</TableHead>
            <TableHead>Unidad</TableHead>
            <TableHead>Línea Base</TableHead>
            <TableHead>Fórmula</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Creado</TableHead>
            <TableHead>Actualizado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {indicators.map((indicator) => (
            <TableRow key={indicator.id}>
              <TableCell className="font-medium">{indicator.id}</TableCell>
              <TableCell>
                <div className="space-y-1">
                  <p className="font-medium">{indicator.name}</p>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{indicator.unit}</Badge>
              </TableCell>
              <TableCell>
                <span className="font-mono text-sm">{indicator.baseline}</span>
              </TableCell>
              <TableCell>
                <p className="text-sm text-muted-foreground max-w-xs truncate">
                  {indicator.formula}
                </p>
              </TableCell>
              <TableCell>{getStatusBadge(indicator.status)}</TableCell>
              <TableCell>{formatDateTime(indicator.createdAt)}</TableCell>
              <TableCell>{formatDateTime(indicator.updatedAt)}</TableCell>
              <TableCell className="text-right space-x-2">
                <Link href={`/home/strategic-objectives/${strategicObjectiveId}/indicators/${indicator.id}/goals`}>
                  <Button variant="outline" size="sm">
                    <Target className="w-4 h-4 mr-1" />
                    Metas
                  </Button>
                </Link>
                <IndicatorForm 
                  indicator={indicator}
                  strategicObjectiveId={strategicObjectiveId}
                  onIndicatorSaved={onIndicatorUpdated}
                  trigger={
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                  }
                />
                <DeleteIndicatorDialog 
                  indicator={indicator}
                  strategicObjectiveId={strategicObjectiveId}
                  onIndicatorDeleted={onIndicatorUpdated} 
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default IndicatorsTable;
