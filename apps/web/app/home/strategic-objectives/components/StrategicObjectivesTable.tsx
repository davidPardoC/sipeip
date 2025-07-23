"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { Target, Edit, Link, BarChart3 } from "lucide-react";
import { getStrategicObjectivesByInstitutionalPlan } from "../actions";
import { StrategicObjective } from "@/types/domain/strategic-objective.entity";
import StrategicObjectiveForm from "./StrategicObjectiveForm";
import DeleteStrategicObjectiveDialog from "./DeleteStrategicObjectiveDialog";
import AlignmentModal from "./AlignmentModal";

interface StrategicObjectivesTableProps {
  institutionalPlanId: number;
  institutionalPlanName?: string;
}

const StrategicObjectivesTable = ({
  institutionalPlanId,
  institutionalPlanName,
}: StrategicObjectivesTableProps) => {
  const router = useRouter();
  const [strategicObjectives, setStrategicObjectives] = useState<StrategicObjective[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [alignmentModalOpen, setAlignmentModalOpen] = useState(false);
  const [selectedObjective, setSelectedObjective] = useState<StrategicObjective | null>(null);

  useEffect(() => {
    const fetchObjectives = async () => {
      try {
        const objectives = await getStrategicObjectivesByInstitutionalPlan(institutionalPlanId);
        setStrategicObjectives(objectives);
      } catch (error) {
        console.error("Error fetching strategic objectives:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchObjectives();
  }, [institutionalPlanId]);

  const handleObjectiveUpdated = () => {
    // Refetch data when an objective is created/updated
    const fetchObjectives = async () => {
      try {
        const objectives = await getStrategicObjectivesByInstitutionalPlan(institutionalPlanId);
        setStrategicObjectives(objectives);
      } catch (error) {
        console.error("Error refetching strategic objectives:", error);
      }
    };
    fetchObjectives();
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string | null) => {
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

  const handleAlignmentClick = (objective: StrategicObjective) => {
    setSelectedObjective(objective);
    setAlignmentModalOpen(true);
  };

  const handleIndicatorsClick = (objectiveId: number) => {
    router.push(`/home/strategic-objectives/${objectiveId}/indicators`);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Objetivos Estratégicos
          </h1>
          <p className="text-muted-foreground">
            {institutionalPlanName
              ? `Objetivos del plan: ${institutionalPlanName}`
              : "Gestiona los objetivos estratégicos"}
          </p>
        </div>
        <StrategicObjectiveForm 
          institutionalPlanId={institutionalPlanId} 
          onObjectiveCreated={handleObjectiveUpdated}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Código</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Período</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Creado</TableHead>
              <TableHead>Actualizado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    <p className="text-sm text-muted-foreground">Cargando objetivos estratégicos...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : strategicObjectives.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <Target className="h-12 w-12 text-muted-foreground/50" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        No hay objetivos estratégicos registrados
                      </p>
                      <p className="text-xs text-muted-foreground/70">
                        Crea tu primer objetivo estratégico para comenzar
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              strategicObjectives.map((objective) => (
                <TableRow key={objective.id}>
                  <TableCell className="font-medium">{objective.id}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{objective.code}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium">{objective.name}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-muted-foreground max-w-xs truncate">
                      {objective.description}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm">
                        {formatDate(objective.startTime)} -{" "}
                        {formatDate(objective.endTime)}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(objective.status)}</TableCell>
                  <TableCell>{formatDateTime(objective.createdAt)}</TableCell>
                  <TableCell>{formatDateTime(objective.updatedAt)}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleIndicatorsClick(objective.id)}
                    >
                      <BarChart3 className="w-4 h-4 mr-1" />
                      Indicadores
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleAlignmentClick(objective)}
                    >
                      <Link className="w-4 h-4 mr-1" />
                      Alineación
                    </Button>
                    <StrategicObjectiveForm 
                      objective={objective}
                      institutionalPlanId={institutionalPlanId}
                      onObjectiveUpdated={handleObjectiveUpdated}
                      trigger={
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-1" />
                          Editar
                        </Button>
                      }
                    />
                    <DeleteStrategicObjectiveDialog 
                      objective={objective} 
                      onObjectiveDeleted={handleObjectiveUpdated} 
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Alignment Modal */}
      <AlignmentModal
        isOpen={alignmentModalOpen}
        onClose={() => setAlignmentModalOpen(false)}
        selectedObjective={selectedObjective}
      />
    </div>
  );
};

export default StrategicObjectivesTable;
