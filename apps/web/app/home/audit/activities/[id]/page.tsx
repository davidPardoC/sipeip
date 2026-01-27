"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface AuditEntry {
  id: string;
  event: string;
  timestamp: string;
  userId: string;
  resourceId: number;
  before?: Record<string, any>;
  after?: Record<string, any>;
  message?: string;
}

export default function ActivityAuditPage() {
  const params = useParams();
  const activityId = params.id as string;

  const [auditTrail, setAuditTrail] = React.useState<AuditEntry[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [activity, setActivity] = React.useState<any>(null);

  React.useEffect(() => {
    fetchAuditTrail();
    fetchActivity();
  }, [activityId]);

  const fetchActivity = async () => {
    try {
      const response = await fetch(`/api/activities/${activityId}`);
      if (response.ok) {
        const data = await response.json();
        setActivity(data);
      }
    } catch (err) {
      console.error("Error fetching activity:", err);
    }
  };

  const fetchAuditTrail = async () => {
    try {
      setLoading(true);
      // Note: This endpoint would need to be created in the logger API
      // For now, we'll show a placeholder message
      setError(
        "La funcionalidad de auditoría completa requiere integración con el servicio de logs."
      );
      setAuditTrail([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (event: string): string => {
    if (event.includes("create")) return "➕";
    if (event.includes("update")) return "✏️";
    if (event.includes("delete")) return "🗑️";
    if (event.includes("link")) return "🔗";
    return "📝";
  };

  const getEventLabel = (event: string): string => {
    if (event.includes("create")) return "Creado";
    if (event.includes("update")) return "Actualizado";
    if (event.includes("delete")) return "Eliminado";
    if (event.includes("link_objectives")) return "Objetivos Vinculados";
    if (event.includes("update_objectives")) return "Objetivos Actualizados";
    return event;
  };

  const formatFieldChanges = (
    before?: Record<string, any>,
    after?: Record<string, any>
  ) => {
    if (!before || !after) return null;

    const changes: Array<{ field: string; before: any; after: any }> = [];

    Object.keys(after).forEach((key) => {
      if (before[key] !== after[key] && key !== "updatedAt") {
        changes.push({
          field: key,
          before: before[key],
          after: after[key],
        });
      }
    });

    return changes;
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Link href="/home/activities">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Historial de Auditoría</h1>
          {activity && (
            <p className="text-muted-foreground mt-1">
              Actividad: {activity.activityCode} - {activity.name}
            </p>
          )}
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">
              Cargando historial de auditoría...
            </p>
          </div>
        </div>
      )}

      {error && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-6">
            <p className="text-yellow-800">{error}</p>
            <p className="text-sm text-yellow-700 mt-2">
              Para habilitar esta funcionalidad, se requiere:
            </p>
            <ul className="list-disc list-inside text-sm text-yellow-700 mt-2">
              <li>Consultar logs desde el servicio de logger (MongoDB)</li>
              <li>
                Crear endpoint GET /api/activities/[id]/audit-trail en el logger
              </li>
              <li>Formatear eventos del stream de Kafka</li>
            </ul>
          </CardContent>
        </Card>
      )}

      {!loading && !error && auditTrail.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">
              No hay eventos de auditoría registrados para esta actividad.
            </p>
          </CardContent>
        </Card>
      )}

      {!loading && auditTrail.length > 0 && (
        <div className="space-y-4">
          {auditTrail.map((entry) => {
            const changes = formatFieldChanges(entry.before, entry.after);

            return (
              <Card key={entry.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{getEventIcon(entry.event)}</div>
                      <div>
                        <CardTitle className="text-lg">
                          {getEventLabel(entry.event)}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {new Date(entry.timestamp).toLocaleString()} por Usuario{" "}
                          {entry.userId}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">{entry.event}</Badge>
                  </div>
                </CardHeader>
                {(entry.message || changes) && (
                  <CardContent>
                    {entry.message && (
                      <p className="text-sm mb-4">{entry.message}</p>
                    )}

                    {changes && changes.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm">
                          Cambios Realizados:
                        </h4>
                        <div className="space-y-2">
                          {changes.map((change) => (
                            <div
                              key={change.field}
                              className="flex items-center gap-2 text-sm p-2 bg-muted rounded"
                            >
                              <span className="font-medium">{change.field}:</span>
                              <span className="text-red-600 line-through">
                                {JSON.stringify(change.before)}
                              </span>
                              <span>→</span>
                              <span className="text-green-600 font-medium">
                                {JSON.stringify(change.after)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
