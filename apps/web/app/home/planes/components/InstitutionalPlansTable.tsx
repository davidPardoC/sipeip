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
import { Button } from "@/components/ui/button";
import { FileText, Target } from "lucide-react";
import Link from "next/link";
// import InstitutionalPlanForm from "./InstitutionalPlanForm";
// import DeleteInstitutionalPlanDialog from "./DeleteInstitutionalPlanDialog";
import { getInstitutionalPlans } from "../actions";
import InstitutionalPlanForm from "./InstitutionalPlanForm";

const InstitutionalPlansTable = async () => {
  // Obtener los planes institucionales usando la server action
  const institutionalPlans = await getInstitutionalPlans();

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string | null) => {
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

    const labels = {
      ACTIVE: "Activo",
      INACTIVE: "Inactivo",
      ARCHIVED: "Archivado",
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Planes Institucionales
          </h1>
          <p className="text-muted-foreground">
            Gestiona los planes institucionales del sistema
          </p>
        </div>
        <InstitutionalPlanForm />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Versión</TableHead>
              <TableHead>Entidad Pública</TableHead>
              <TableHead>Período</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Creado</TableHead>
              <TableHead>Actualizado</TableHead>
              <TableHead>Objetivos</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {institutionalPlans.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <FileText className="h-12 w-12 text-muted-foreground/50" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        No hay planes institucionales registrados
                      </p>
                      <p className="text-xs text-muted-foreground/70">
                        Crea tu primer plan institucional para comenzar
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              institutionalPlans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell className="font-medium">{plan.id}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium">{plan.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Versión {plan.version}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{plan.version}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {plan.publicEntity?.name || "N/A"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {plan.publicEntity?.code || "N/A"}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm">
                        {formatDate(plan.periodStart)} - {formatDate(plan.periodEnd)}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(plan.status)}</TableCell>
                  <TableCell>{formatDateTime(plan.createdAt)}</TableCell>
                  <TableCell>{formatDateTime(plan.updatedAt)}</TableCell>
                  <TableCell>
                    <Link href={`/home/strategic-objectives?institutionalPlanId=${plan.id}`}>
                      <Button variant="outline" size="sm">
                        <Target className="w-4 h-4 mr-2" />
                        Ver Objetivos
                      </Button>
                    </Link>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                    <Button variant="outline" size="sm">
                      Eliminar
                    </Button>
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

export default InstitutionalPlansTable;
