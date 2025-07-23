"use client";

import React, { useState } from "react";
import { BarChart3, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { StrategicObjective } from "@/types/domain/strategic-objective.entity";
import { Indicator } from "@/types/domain/indicator.entity";
import { getIndicatorsByStrategicObjective } from "../actions";
import IndicatorForm from "./IndicatorForm";
import IndicatorsTable from "./IndicatorsTable";

interface IndicatorsPageClientProps {
  strategicObjective: StrategicObjective;
  initialIndicators: Indicator[];
}

const IndicatorsPageClient = ({ 
  strategicObjective, 
  initialIndicators 
}: IndicatorsPageClientProps) => {
  const router = useRouter();
  const [indicators, setIndicators] = useState<Indicator[]>(initialIndicators);
  const [isLoading, setIsLoading] = useState(false);

  const handleIndicatorsUpdate = async () => {
    setIsLoading(true);
    try {
      const updatedIndicators = await getIndicatorsByStrategicObjective(strategicObjective.id);
      setIndicators(updatedIndicators);
    } catch (error) {
      console.error("Error refreshing indicators:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
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

  return (
    <div className="container mx-auto py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Button>
        </div>
        
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <BarChart3 className="w-6 h-6" />
              Indicadores del Objetivo Estratégico
            </h1>
            <div className="space-y-1">
              <p className="text-lg font-medium text-foreground">
                {strategicObjective.name}
              </p>
              <p className="text-sm text-muted-foreground">
                Código: {strategicObjective.code}
              </p>
              <p className="text-sm text-muted-foreground max-w-2xl">
                {strategicObjective.description}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            {getStatusBadge(strategicObjective.status)}
            <div className="text-right text-sm text-muted-foreground">
              <p>Período: {formatDate(strategicObjective.startTime)} - {formatDate(strategicObjective.endTime)}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Total de indicadores:</span>
              <Badge variant="outline">{indicators.length}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Activos:</span>
              <Badge variant="default">
                {indicators.filter(i => i.status === "ACTIVE").length}
              </Badge>
            </div>
          </div>
          
          <IndicatorForm 
            strategicObjectiveId={strategicObjective.id}
            onIndicatorSaved={handleIndicatorsUpdate}
          />
        </div>
      </div>

      {/* Indicators Table */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="text-sm text-muted-foreground">Cargando indicadores...</p>
          </div>
        </div>
      ) : (
        <IndicatorsTable
          indicators={indicators}
          strategicObjectiveId={strategicObjective.id}
          onIndicatorUpdated={handleIndicatorsUpdate}
        />
      )}
    </div>
  );
};

export default IndicatorsPageClient;
