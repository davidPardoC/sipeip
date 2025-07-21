import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import OrganizationalUnitForm from "./OrganizationalUnitForm";
import DeleteOrganizationalUnitDialog from "./DeleteOrganizationalUnitDialog";
import { getOrganizationalUnitsByPublicEntity } from "../actions";
import { getPublicEntityById } from "../../entidades/actions";

interface OrganizationalUnitsTableProps {
  publicEntityId?: string;
}

const OrganizationalUnitsTable = async ({
  publicEntityId,
}: OrganizationalUnitsTableProps) => {
  // Obtener las unidades organizacionales usando la server action
  const organizationalUnits = publicEntityId
    ? await getOrganizationalUnitsByPublicEntity(parseInt(publicEntityId))
    : [];

  // Obtener la información de la entidad pública
  const publicEntity = publicEntityId 
    ? await getPublicEntityById(parseInt(publicEntityId))
    : null;

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

  const getStatusBadge = (status: string | null) => {
    if (!status) return <Badge variant="secondary">N/A</Badge>;

    const variants = {
      ACTIVE: "default",
      INACTIVE: "secondary",
      ARCHIVED: "destructive",
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Unidades Organizacionales
          </h1>
          <p className="text-muted-foreground">
            Gestiona las unidades organizacionales del sistema
          </p>
          {publicEntity && (
            <div className="mt-2 p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                Entidad Pública:
              </p>
              <p className="font-semibold">{publicEntity.name}</p>
              <p className="text-sm text-muted-foreground">
                Código: {publicEntity.code}
              </p>
            </div>
          )}
        </div>
        {publicEntityId && (
          <OrganizationalUnitForm publicEntityId={parseInt(publicEntityId)} />
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Código</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Nivel</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Unidad Padre</TableHead>
              <TableHead>Creado</TableHead>
              <TableHead>Actualizado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {organizationalUnits.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  {publicEntityId
                    ? "No hay unidades organizacionales registradas para esta entidad"
                    : "Selecciona una entidad pública para ver sus unidades organizacionales"}
                </TableCell>
              </TableRow>
            ) : (
              organizationalUnits.map((unit) => (
                <TableRow key={unit.id}>
                  <TableCell className="font-medium">{unit.id}</TableCell>
                  <TableCell>{unit.code}</TableCell>
                  <TableCell>{unit.name}</TableCell>
                  <TableCell>{unit.level}</TableCell>
                  <TableCell>{getStatusBadge(unit.status)}</TableCell>
                  <TableCell>{unit.parentId}</TableCell>
                  <TableCell>{formatDate(unit.createdAt)}</TableCell>
                  <TableCell>{formatDate(unit.updatedAt)}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <OrganizationalUnitForm
                      editingUnit={unit}
                      publicEntityId={parseInt(publicEntityId!)}
                    />
                    <DeleteOrganizationalUnitDialog
                      unitId={unit.id}
                      unitName={unit.name}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default OrganizationalUnitsTable;
