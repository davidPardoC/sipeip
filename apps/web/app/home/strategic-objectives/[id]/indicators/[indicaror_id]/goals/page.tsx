"use client";

import React, { useState, useEffect, useCallback, use, Usable } from "react";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft, Target } from "lucide-react";
import Link from "next/link";
import { getGoalsByIndicator } from "./actions";
import { getIndicatorById } from "../../actions";
import GoalsTable from "./components/GoalsTable";
import GoalForm from "./components/GoalForm";
import { Goal } from "@/types/domain/goal.entity";
import { Indicator } from "@/types/domain/indicator.entity";

interface IndicatorGoalsPageProps {
  params: Promise<{
    id: string;
    indicaror_id: string;
  }>;
}

const IndicatorGoalsPage = ({ params }: IndicatorGoalsPageProps) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [indicator, setIndicator] = useState<Indicator | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id, indicaror_id } = use<{ id: string; indicaror_id: string }>(
    params as unknown as Usable<{ id: string; indicaror_id: string }>
  );
  const strategicObjectiveId = parseInt(id);
  const indicatorId = parseInt(indicaror_id);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [goalsData, indicatorData] = await Promise.all([
        getGoalsByIndicator(indicatorId),
        getIndicatorById(indicatorId),
      ]);

      if (!indicatorData) {
        setError("Indicator not found");
        return;
      }

      setGoals(goalsData);
      setIndicator(indicatorData);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [indicatorId]);

  useEffect(() => {
    if (isNaN(strategicObjectiveId) || isNaN(indicatorId)) {
      setError("Invalid parameters");
      setLoading(false);
      return;
    }

    fetchData();
  }, [strategicObjectiveId, indicatorId, fetchData]);

  const handleGoalUpdated = () => {
    fetchData(); // Refresh data after any goal operation
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !indicator) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive">Error</h1>
          <p className="text-muted-foreground">
            {error || "Indicator not found"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href={`/home/strategic-objectives/${strategicObjectiveId}/indicators`}
            className="flex items-center"
          >
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a Indicadores
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Metas del Indicador
            </h1>
            <p className="text-sm text-muted-foreground">{indicator.name}</p>
          </div>
        </div>

        <GoalForm
          indicatorId={indicatorId}
          onGoalSaved={handleGoalUpdated}
          trigger={
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nueva Meta
            </Button>
          }
        />
      </div>

      {/* Indicator Details */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="flex items-center text-lg leading-6 font-medium text-gray-900 mb-4">
            <Target className="w-5 h-5 mr-2" />
            Información del Indicador
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Nombre
              </p>
              <p className="text-sm">{indicator.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Unidad
              </p>
              <p className="text-sm">{indicator.unit}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Línea Base
              </p>
              <p className="text-sm">{indicator.baseline}</p>
            </div>
            <div className="md:col-span-3">
              <p className="text-sm font-medium text-muted-foreground">
                Fórmula
              </p>
              <p className="text-sm">{indicator.formula}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Goals Table */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Metas ({goals.length})
          </h3>
          <GoalsTable
            goals={goals}
            indicatorId={indicatorId}
            onGoalUpdated={handleGoalUpdated}
          />
        </div>
      </div>
    </div>
  );
};

export default IndicatorGoalsPage;
