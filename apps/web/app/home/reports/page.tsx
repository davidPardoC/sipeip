"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, FileText, Loader2, AlertCircle } from 'lucide-react';

// Type definition for log entries based on the example data
interface LogEntry {
  _id: string;
  event: string;
  userId: string;
  timestamp: string;
  resourceId?: number;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  message?: string;
  __v: number;
}

const ReportsPage = () => {
  const [userId, setUserId] = useState('');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    if (!userId.trim()) {
      setError('Por favor ingrese un ID de usuario');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:5500/api/logger/by-created-by/${userId.trim()}`);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      setLogs(data);
    } catch (error) {
      console.error('Error fetching logs:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido al cargar los logs');
      setLogs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      fetchLogs();
    }
  };

  const formatDateTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getEventBadge = (event: string) => {
    const eventTypes = {
      sign_in: { variant: 'default' as const, label: 'Inicio de Sesión' },
      project_update: { variant: 'secondary' as const, label: 'Actualización de Proyecto' },
      project_create: { variant: 'default' as const, label: 'Creación de Proyecto' },
      project_delete: { variant: 'destructive' as const, label: 'Eliminación de Proyecto' },
    };

    const eventInfo = eventTypes[event as keyof typeof eventTypes] || { 
      variant: 'outline' as const, 
      label: event 
    };

    return (
      <Badge variant={eventInfo.variant}>
        {eventInfo.label}
      </Badge>
    );
  };

  const renderChangeDetails = (before: Record<string, unknown> | undefined, after: Record<string, unknown> | undefined) => {
    if (!before && !after) return null;
    
    if (before && after) {
      // Find the differences
      const changes: string[] = [];
      Object.keys(after).forEach(key => {
        if (before[key] !== after[key] && key !== 'updatedAt') {
          const beforeValue = typeof before[key] === 'object' ? JSON.stringify(before[key]) : String(before[key] || '');
          const afterValue = typeof after[key] === 'object' ? JSON.stringify(after[key]) : String(after[key] || '');
          changes.push(`${key}: ${beforeValue} → ${afterValue}`);
        }
      });
      
      return changes.length > 0 ? (
        <div className="text-xs text-muted-foreground max-w-xs">
          <div className="font-medium mb-1">Cambios:</div>
          {changes.slice(0, 3).map((change, index) => (
            <div key={index} className="truncate">{change}</div>
          ))}
          {changes.length > 3 && <div>+{changes.length - 3} más...</div>}
        </div>
      ) : null;
    }
    
    return null;
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reportes de Logs</h1>
          <p className="text-muted-foreground">
            Consulta los logs de actividad por usuario
          </p>
        </div>

        {/* Search Form */}
        <div className="flex items-end space-x-4 p-4 border rounded-lg bg-card">
          <div className="flex-1">
            <Label htmlFor="userId">ID de Usuario</Label>
            <Input
              id="userId"
              type="text"
              placeholder="Ej: 5b3bf409-f6f4-469f-b7c4-dc1ff93c8440"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              onKeyPress={handleKeyPress}
              className="mt-1"
            />
          </div>
          <Button 
            onClick={fetchLogs} 
            disabled={isLoading}
            className="flex items-center space-x-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            <span>{isLoading ? 'Cargando...' : 'Buscar Logs'}</span>
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center space-x-2 p-4 border border-destructive/50 rounded-lg bg-destructive/10">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <span className="text-destructive">{error}</span>
          </div>
        )}

        {/* Results Table */}
        {logs.length > 0 && (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha y Hora</TableHead>
                  <TableHead>Evento</TableHead>
                  <TableHead>Recurso ID</TableHead>
                  <TableHead>Detalles</TableHead>
                  <TableHead>Mensaje</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log._id}>
                    <TableCell className="font-mono text-sm">
                      {formatDateTime(log.timestamp)}
                    </TableCell>
                    <TableCell>
                      {getEventBadge(log.event)}
                    </TableCell>
                    <TableCell>
                      {log.resourceId ? (
                        <Badge variant="outline">#{log.resourceId}</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {renderChangeDetails(log.before, log.after)}
                    </TableCell>
                    <TableCell className="max-w-md">
                      {log.message ? (
                        <span className="text-sm">{log.message}</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && logs.length === 0 && userId && !error && (
          <div className="text-center py-8">
            <div className="flex flex-col items-center justify-center space-y-3">
              <FileText className="h-12 w-12 text-muted-foreground/50" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  No se encontraron logs
                </p>
                <p className="text-xs text-muted-foreground/70">
                  No hay registros para el usuario especificado
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Results Summary */}
        {logs.length > 0 && (
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              Mostrando {logs.length} registro(s) para el usuario: <code className="bg-muted px-1 rounded">{userId}</code>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;