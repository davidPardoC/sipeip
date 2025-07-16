import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import MacroSectorForm from "./MacroSectorForm";
import DeleteMacroSectorDialog from "./DeleteMacroSectorDialog";
import { getMacroSectores } from "../actions";
import { MacroSector } from "@/types/domain/macro-sector.entity";

// Tipo basado en el schema de Drizzle

const MacroSectoresTable = async () => {
  // Obtener los macro sectores usando la server action
  const macroSectores = await getMacroSectores();

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Macro Sectores</h1>
          <p className="text-muted-foreground">
            Gestiona los macro sectores del sistema
          </p>
        </div>
        <MacroSectorForm />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Código</TableHead>
              <TableHead>Fecha de Creación</TableHead>
              <TableHead>Última Actualización</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {macroSectores && macroSectores.length > 0 ? (
              macroSectores.map((macroSector: MacroSector) => (
                <TableRow key={macroSector.id}>
                  <TableCell className="font-medium">
                    {macroSector.id}
                  </TableCell>
                  <TableCell>{macroSector.name}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                      {macroSector.code}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(macroSector.createdAt)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(macroSector.updatedAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <MacroSectorForm 
                        macroSector={macroSector} 
                        mode="edit" 
                      />
                      <DeleteMacroSectorDialog 
                        macroSector={macroSector} 
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-muted-foreground">
                      No hay macro sectores registrados
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Crea tu primer macro sector para comenzar
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {macroSectores && macroSectores.length > 0 && (
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="text-sm text-muted-foreground">
            Mostrando {macroSectores.length} macro sector(es)
          </div>
        </div>
      )}
    </div>
  );
};

export default MacroSectoresTable;
