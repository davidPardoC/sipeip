"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Edit } from "lucide-react";
// import { toast } from "sonner";
import {
  strategicObjectiveCreateSchema,
  StrategicObjectiveCreateInput,
} from "@/lib/validations/strategic-objective.validators";
import { createStrategicObjective, updateStrategicObjective } from "../actions";
import { StrategicObjective } from "@/types/domain/strategic-objective.entity";

interface StrategicObjectiveFormProps {
  objective?: StrategicObjective;
  institutionalPlanId: number;
  onObjectiveCreated?: () => void;
  onObjectiveUpdated?: () => void;
  trigger?: React.ReactNode;
}

const StrategicObjectiveForm = ({
  objective,
  institutionalPlanId,
  onObjectiveCreated,
  onObjectiveUpdated,
  trigger,
}: StrategicObjectiveFormProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<StrategicObjectiveCreateInput>({
    resolver: zodResolver(strategicObjectiveCreateSchema),
    defaultValues: {
      code: objective?.code || "",
      name: objective?.name || "",
      description: objective?.description || "",
      status: objective?.status || "ACTIVE",
      startTime: objective?.startTime || "",
      endTime: objective?.endTime || "",
      institutionalPlanId: institutionalPlanId,
    },
  });

  const onSubmit = async (data: StrategicObjectiveCreateInput) => {
    setIsLoading(true);
    try {
      let result;
      if (objective) {
        result = await updateStrategicObjective(objective.id, data);
      } else {
        result = await createStrategicObjective(data);
      }

      if (result.success) {
        console.log(
          objective
            ? "Objetivo estratégico actualizado exitosamente"
            : "Objetivo estratégico creado exitosamente"
        );
        setOpen(false);
        form.reset();
        
        // Call appropriate callback
        if (objective && onObjectiveUpdated) {
          onObjectiveUpdated();
        } else if (!objective && onObjectiveCreated) {
          onObjectiveCreated();
        }
      } else {
        console.error(result.error || "Error al procesar la solicitud");
      }
    } catch (error) {
      console.error("Error:", error);
      console.error("Error al procesar la solicitud");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (objective ? (
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4" />
          </Button>
        ) : (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Objetivo
          </Button>
        ))}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {objective
              ? "Editar Objetivo Estratégico"
              : "Crear Objetivo Estratégico"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: OE-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <FormControl>
                      <select className="border rounded-md p-2" {...field}>
                        <option value="">Selecciona un estado</option>
                        <option value="ACTIVE">Activo</option>
                        <option value="INACTIVE">Inactivo</option>
                        <option value="ARCHIVED">Archivado</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nombre del objetivo estratégico"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      placeholder="Descripción del objetivo estratégico"
                      className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Inicio</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Fin</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "Procesando..."
                  : objective
                    ? "Actualizar"
                    : "Crear"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default StrategicObjectiveForm;
