"use client";

import React, { useState, useTransition } from "react";
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
import { Select, SelectOption } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Loader2 } from "lucide-react";
import {
  institutionalPlanCreateSchema,
  institutionalPlanUpdateSchema,
  InstitutionalPlanCreateInput,
  InstitutionalPlanUpdateInput,
} from "@/lib/validations/institutional-plan.validators";
import {
  createInstitutionalPlan,
  updateInstitutionalPlan,
  getPublicEntitiesForPlans,
} from "../actions";
import { InstitutionalPlan } from "@/types/domain/institutional-plan.entity";
import { PublicEntity } from "@/types/domain/public-entity.entity";

interface InstitutionalPlanFormProps {
  plan?: InstitutionalPlan;
}

const InstitutionalPlanForm: React.FC<InstitutionalPlanFormProps> = ({
  plan,
}) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [publicEntities, setPublicEntities] = useState<PublicEntity[]>([]);
  const [isLoadingEntities, setIsLoadingEntities] = useState(false);

  const isEditing = !!plan;

  const form = useForm<
    InstitutionalPlanCreateInput | InstitutionalPlanUpdateInput
  >({
    resolver: zodResolver(
      isEditing ? institutionalPlanUpdateSchema : institutionalPlanCreateSchema
    ),
    defaultValues: isEditing
      ? {
          name: plan.name,
          version: plan.version,
          periodStart: plan.periodStart?.split("T")[0] || "",
          periodEnd: plan.periodEnd?.split("T")[0] || "",
          status: plan.status || undefined,
          publicEntityId: plan.publicEntityId,
        }
      : {
          name: "",
          version: "",
          periodStart: "",
          periodEnd: "",
          status: "ACTIVE",
          publicEntityId: undefined,
        },
  });

  const loadPublicEntities = async () => {
    if (publicEntities.length > 0) return;

    setIsLoadingEntities(true);
    try {
      const entities = await getPublicEntitiesForPlans();
      setPublicEntities(entities);
    } catch {
      console.error("Error al cargar las entidades públicas");
    } finally {
      setIsLoadingEntities(false);
    }
  };

  const onSubmit = (
    data: InstitutionalPlanCreateInput | InstitutionalPlanUpdateInput
  ) => {
    startTransition(async () => {
      try {
        let result;

        if (isEditing && plan) {
          result = await updateInstitutionalPlan(
            plan.id,
            data as InstitutionalPlanUpdateInput
          );
        } else {
          result = await createInstitutionalPlan(
            data as InstitutionalPlanCreateInput
          );
        }

        if (result.success) {
          console.log(
            isEditing
              ? "Plan institucional actualizado exitosamente"
              : "Plan institucional creado exitosamente"
          );
          setOpen(false);
          form.reset();
        } else {
          console.error(result.error || "Error al procesar la solicitud");
        }
      } catch {
        console.error("Error inesperado");
      }
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      loadPublicEntities();
    } else {
      // Reset form when closing if not editing
      if (!isEditing) {
        form.reset({
          name: "",
          version: "",
          periodStart: "",
          periodEnd: "",
          status: "ACTIVE",
          publicEntityId: undefined,
        });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {isEditing ? (
          <Button variant="outline" size="sm">
            <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Plan
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? "Editar Plan Institucional"
              : "Crear Nuevo Plan Institucional"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Plan</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: Plan Institucional 2024-2028"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="version"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Versión</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: 1.0, 2.1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="publicEntityId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entidad Pública</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value?.toString() || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value ? parseInt(value, 10) : undefined);
                      }}
                      disabled={isLoadingEntities}
                    >
                      <SelectOption value="" disabled>
                        {isLoadingEntities
                          ? "Cargando entidades..."
                          : "Selecciona una entidad pública"}
                      </SelectOption>
                      {publicEntities.map((entity) => (
                        <SelectOption
                          key={entity.id}
                          value={entity.id.toString()}
                        >
                          {entity.name} ({entity.code})
                        </SelectOption>
                      ))}
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="periodStart"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Inicio</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="periodEnd"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Fin</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                    >
                      <SelectOption value="" disabled>
                        Selecciona un estado
                      </SelectOption>
                      <SelectOption value="ACTIVE">Activo</SelectOption>
                      <SelectOption value="INACTIVE">Inactivo</SelectOption>
                      <SelectOption value="ARCHIVED">Archivado</SelectOption>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {isEditing ? "Actualizar" : "Crear"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default InstitutionalPlanForm;
