"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Objective {
  id: number;
  code: string;
  name: string;
  fulfillmentStatus: string;
}

interface ScenarioViewProps {
  title: string;
  objectives: Objective[];
  scenarioType: "AND" | "OR" | "NONE";
}

const ScenarioView: React.FC<ScenarioViewProps> = ({
  title,
  objectives,
  scenarioType,
}) => {
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "CUMPLIDO":
        return "bg-green-100 text-green-800 border-green-300";
      case "EN_PROGRESO":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "NO_CUMPLIDO":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case "CUMPLIDO":
        return "Cumplido";
      case "EN_PROGRESO":
        return "En Progreso";
      case "NO_CUMPLIDO":
        return "No Cumplido";
      default:
        return status;
    }
  };

  const getScenarioDescription = (): string => {
    switch (scenarioType) {
      case "AND":
        return "Estos objetivos requieren que TODAS las actividades vinculadas estén completadas para considerarse cumplidos.";
      case "OR":
        return "Estos objetivos se consideran cumplidos cuando AL MENOS UNA actividad vinculada está completada.";
      case "NONE":
        return "Estos objetivos aún no han cumplido con sus indicadores o actividades vinculadas.";
    }
  };

  const getScenarioIcon = (): string => {
    switch (scenarioType) {
      case "AND":
        return "✓";
      case "OR":
        return "≥1";
      case "NONE":
        return "○";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold ${
              scenarioType === "AND"
                ? "bg-green-100 text-green-700"
                : scenarioType === "OR"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {getScenarioIcon()}
          </div>
          <div className="flex-1">
            <CardTitle className="mb-1">{title}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {getScenarioDescription()}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {objectives.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No hay objetivos que coincidan con este escenario
          </div>
        ) : (
          <div className="space-y-3">
            {objectives.map((objective) => (
              <div
                key={objective.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="font-mono">
                      {objective.code}
                    </Badge>
                    <Badge
                      className={getStatusColor(objective.fulfillmentStatus)}
                    >
                      {getStatusLabel(objective.fulfillmentStatus)}
                    </Badge>
                  </div>
                  <p className="font-medium">{objective.name}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Scenario Rules Explanation */}
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="font-semibold mb-2">Regla de Cumplimiento</h4>
          {scenarioType === "AND" && (
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Regla: AND (Conjunción)</li>
              <li>• Todas las actividades deben estar completadas</li>
              <li>• Estado: CUMPLIDO cuando 100% de actividades = COMPLETADA</li>
            </ul>
          )}
          {scenarioType === "OR" && (
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Regla: OR (Disyunción)</li>
              <li>• Al menos una actividad debe estar completada</li>
              <li>• Estado: CUMPLIDO cuando ≥1 actividad = COMPLETADA</li>
            </ul>
          )}
          {scenarioType === "NONE" && (
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Sin cumplimiento de indicadores</li>
              <li>• Ninguna actividad completada aún</li>
              <li>• Estado: NO_CUMPLIDO</li>
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScenarioView;
