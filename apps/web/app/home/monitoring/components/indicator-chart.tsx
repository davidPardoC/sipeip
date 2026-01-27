"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface IndicatorChartProps {
  title: string;
  data: Record<string | number, number>;
  type: "pie" | "bar";
}

const IndicatorChart: React.FC<IndicatorChartProps> = ({ title, data, type }) => {
  const entries = Object.entries(data);
  const total = entries.reduce((sum, [_, value]) => sum + value, 0);

  const colors: Record<string, string> = {
    NO_INICIADA: "#94a3b8",
    EN_RIESGO: "#ef4444",
    COMPLETADA: "#22c55e",
    "1": "#94a3b8",
    "2": "#cbd5e1",
    "3": "#fbbf24",
    "4": "#fb923c",
    "5": "#ef4444",
  };

  const labels: Record<string, string> = {
    NO_INICIADA: "No Iniciada",
    EN_RIESGO: "En Riesgo",
    COMPLETADA: "Completada",
    "1": "Prioridad 1 (Muy Baja)",
    "2": "Prioridad 2 (Baja)",
    "3": "Prioridad 3 (Media)",
    "4": "Prioridad 4 (Alta)",
    "5": "Prioridad 5 (Muy Alta)",
  };

  if (type === "pie") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Simple pie chart representation */}
            <div className="flex items-center justify-center">
              <div className="relative w-48 h-48">
                <svg viewBox="0 0 100 100" className="transform -rotate-90">
                  {entries.reduce<{ element: JSX.Element[]; offset: number }>(
                    (acc, [key, value], index) => {
                      const percentage = (value / total) * 100;
                      const circumference = 2 * Math.PI * 40;
                      const strokeDasharray = `${
                        (percentage / 100) * circumference
                      } ${circumference}`;
                      const strokeDashoffset = -acc.offset;

                      acc.element.push(
                        <circle
                          key={key}
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke={colors[key] || "#64748b"}
                          strokeWidth="20"
                          strokeDasharray={strokeDasharray}
                          strokeDashoffset={strokeDashoffset}
                        />
                      );

                      acc.offset +=
                        (percentage / 100) * circumference;

                      return acc;
                    },
                    { element: [], offset: 0 }
                  ).element}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{total}</div>
                    <div className="text-xs text-muted-foreground">Total</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-2">
              {entries.map(([key, value]) => {
                const percentage = ((value / total) * 100).toFixed(1);
                return (
                  <div
                    key={key}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: colors[key] || "#64748b" }}
                      />
                      <span className="text-sm">
                        {labels[key] || key}
                      </span>
                    </div>
                    <span className="text-sm font-medium">
                      {value} ({percentage}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Bar chart
  const maxValue = Math.max(...entries.map(([_, v]) => v));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {entries.map(([key, value]) => {
            const percentage = ((value / maxValue) * 100).toFixed(1);
            return (
              <div key={key} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span>{labels[key] || key}</span>
                  <span className="font-medium">{value}</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-3">
                  <div
                    className="h-3 rounded-full transition-all"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: colors[key] || "#64748b",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default IndicatorChart;
