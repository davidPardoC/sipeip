"use client";

import React, { useState } from "react";
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
import { Trash2 } from "lucide-react";
import { deleteStrategicObjective } from "../actions";
import { StrategicObjective } from "@/types/domain/strategic-objective.entity";

interface DeleteStrategicObjectiveDialogProps {
  objective: StrategicObjective;
  onObjectiveDeleted?: () => void;
}

const DeleteStrategicObjectiveDialog = ({ objective, onObjectiveDeleted }: DeleteStrategicObjectiveDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteStrategicObjective(objective.id);
      if (result.success) {
        console.log("Objetivo estratégico eliminado exitosamente");
        if (onObjectiveDeleted) {
          onObjectiveDeleted();
        }
      } else {
        console.error(result.error || "Error al eliminar el objetivo estratégico");
      }
    } catch (error) {
      console.error("Error:", error);
      console.error("Error al eliminar el objetivo estratégico");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Trash2 className="w-4 h-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción eliminará permanentemente el objetivo estratégico &quot;{objective.name}&quot;.
            Esta acción no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isDeleting ? "Eliminando..." : "Eliminar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteStrategicObjectiveDialog;
