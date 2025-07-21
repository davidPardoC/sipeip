import React from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";
import PublicEntityForm from "./PublicEntityForm";
import DeletePublicEntityDialog from "./DeletePublicEntityDialog";
import { getPublicEntities } from "../actions";

const PublicEntitiesTable = async () => {
  // Obtener las entidades públicas usando la server action
  const publicEntities = await getPublicEntities();

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
            Entidades Públicas
          </h1>
          <p className="text-muted-foreground">
            Gestiona las entidades públicas del sistema
          </p>
        </div>
        <PublicEntityForm />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Código</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Nombre Corto</TableHead>
              <TableHead>Nivel de Gobierno</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Subsector</TableHead>
              <TableHead>Creado</TableHead>
              <TableHead>Actualizado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {publicEntities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8">
                  No hay entidades públicas registradas
                </TableCell>
              </TableRow>
            ) : (
              publicEntities.map((entity) => (
                <TableRow key={entity.id}>
                  <TableCell className="font-medium">{entity.id}</TableCell>
                  <TableCell>{entity.code}</TableCell>
                  <TableCell>{entity.name}</TableCell>
                  <TableCell>{entity.shortName}</TableCell>
                  <TableCell>{entity.govermentLevel}</TableCell>
                  <TableCell>{getStatusBadge(entity.status)}</TableCell>
                  <TableCell>{entity.subSectorId}</TableCell>
                  <TableCell>{formatDate(entity.createdAt)}</TableCell>
                  <TableCell>{formatDate(entity.updatedAt)}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Link href={`/home/unit-organizations?publicEntity=${entity.id}`}>
                      <Button variant="outline" size="sm">
                        <Building2 className="h-4 w-4 mr-2" />
                        Unidades
                      </Button>
                    </Link>
                    <PublicEntityForm editingEntity={entity} />
                    <DeletePublicEntityDialog
                      entityId={entity.id}
                      entityName={entity.name}
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

export default PublicEntitiesTable;
