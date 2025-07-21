"use client";

import React, { useState, useTransition } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { deleteInstitutionalPlan } from "../actions";
import { InstitutionalPlan } from "@/types/domain/institutional-plan.entity";

interface DeleteInstitutionalPlanDialogProps {
  plan: InstitutionalPlan;
}

const DeleteInstitutionalPlanDialog: React.FC<DeleteInstitutionalPlanDialogProps> = ({ plan }) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const result = await deleteInstitutionalPlan(plan.id);
        
        if (result.success) {
          console.log("Plan institucional eliminado exitosamente");
          setOpen(false);
        } else {
          console.error(result.error || "Error al eliminar el plan institucional");
        }
      } catch {
        console.error("Error inesperado al eliminar el plan institucional");
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción eliminará permanentemente el plan institucional{" "}
            <span className="font-semibold">&ldquo;{plan.name}&rdquo;</span> versión{" "}
            <span className="font-semibold">{plan.version}</span>.
            Esta acción no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteInstitutionalPlanDialog;
