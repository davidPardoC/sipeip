import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import MicroSectorForm from "./MicroSectorForm";
import DeleteMicroSectorDialog from "./DeleteMicroSectorDialog";
import { getMicroSectores, getSectores, getMacroSectores } from "../actions";
import { MicroSector } from "@/types/domain/micro-sector.entity";
import { Sector } from "@/types/domain/sector.entity";
import { MacroSector } from "@/types/domain/macro-sector.entity";

const MicroSectoresTable = async () => {
  // Obtener todos los datos necesarios usando las server actions
  const [microSectores, sectores, macroSectores] = await Promise.all([
    getMicroSectores(),
    getSectores(),
    getMacroSectores(),
  ]);

  // Crear mapas para buscar sectores y macro sectores por ID
  const sectorMap = new Map<number, Sector>();
  const macroSectorMap = new Map<number, MacroSector>();

  sectores.forEach((sector) => {
    sectorMap.set(sector.id, sector);
  });

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
          <h1 className="text-2xl font-bold tracking-tight">Micro Sectores</h1>
          <p className="text-muted-foreground">
            Gestiona los micro sectores del sistema
          </p>
        </div>
        <MicroSectorForm />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Código</TableHead>
              <TableHead>Sector</TableHead>
              <TableHead>Macro Sector</TableHead>
              <TableHead>Fecha de Creación</TableHead>
              <TableHead>Última Actualización</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {microSectores && microSectores.length > 0 ? (
              microSectores.map((microSector: MicroSector) => {
                const sector = sectorMap.get(microSector.sectorId);
                const macroSector = sector ? macroSectorMap.get(sector.macroSectorId) : null;
                
                return (
                  <TableRow key={microSector.id}>
                    <TableCell className="font-medium">{microSector.id}</TableCell>
                    <TableCell>{microSector.name}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
                        {microSector.code}
                      </span>
                    </TableCell>
                    <TableCell>
                      {sector ? (
                        <div className="flex flex-col">
                          <span className="font-medium">{sector.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {sector.code}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">
                          Sector no encontrado
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {macroSector ? (
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{macroSector.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {macroSector.code}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          N/A
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(microSector.createdAt)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(microSector.updatedAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <MicroSectorForm microSector={microSector} mode="edit" />
                        <DeleteMicroSectorDialog microSector={microSector} />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-muted-foreground">
                      No hay micro sectores registrados
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Crea tu primer micro sector para comenzar
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {microSectores && microSectores.length > 0 && (
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="text-sm text-muted-foreground">
            Mostrando {microSectores.length} micro sector(es)
          </div>
        </div>
      )}
    </div>
  );
};

export default MicroSectoresTable;
