import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SectorForm from "./SectorForm";
import DeleteSectorDialog from "./DeleteSectorDialog";
import { getSectores, getMacroSectores } from "../actions";
import { Sector } from "@/types/domain/sector.entity";
import { MacroSector } from "@/types/domain/macro-sector.entity";

const SectoresTable = async () => {
  // Obtener los sectores y macro sectores usando las server actions
  const [sectores, macroSectores] = await Promise.all([
    getSectores(),
    getMacroSectores(),
  ]);

  // Crear un mapa para buscar macro sectores por ID
  const macroSectorMap = new Map<number, MacroSector>();
  macroSectores.forEach((macroSector) => {
    macroSectorMap.set(macroSector.id, macroSector);
  });

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
          <h1 className="text-2xl font-bold tracking-tight">Sectores</h1>
          <p className="text-muted-foreground">
            Gestiona los sectores del sistema
          </p>
        </div>
        <SectorForm />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Código</TableHead>
              <TableHead>Macro Sector</TableHead>
              <TableHead>Fecha de Creación</TableHead>
              <TableHead>Última Actualización</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sectores && sectores.length > 0 ? (
              sectores.map((sector: Sector) => {
                const macroSector = macroSectorMap.get(sector.macroSectorId);
                return (
                  <TableRow key={sector.id}>
                    <TableCell className="font-medium">{sector.id}</TableCell>
                    <TableCell>{sector.name}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-700/10">
                        {sector.code}
                      </span>
                    </TableCell>
                    <TableCell>
                      {macroSector ? (
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {macroSector.name}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {macroSector.code}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">
                          Macro sector no encontrado
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(sector.createdAt)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(sector.updatedAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <SectorForm sector={sector} mode="edit" />
                        <DeleteSectorDialog sector={sector} />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-muted-foreground">
                      No hay sectores registrados
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Crea tu primer sector para comenzar
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {sectores && sectores.length > 0 && (
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="text-sm text-muted-foreground">
            Mostrando {sectores.length} sector(es)
          </div>
        </div>
      )}
    </div>
  );
};

export default SectoresTable;
