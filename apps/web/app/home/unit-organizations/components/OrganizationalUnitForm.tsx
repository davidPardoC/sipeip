"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Loader2, Edit } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { organizationalUnitCreateSchema } from "@/lib/validations/sectors.validators";
import {
  createOrganizationalUnit,
  updateOrganizationalUnit,
  getOrganizationalUnitsByPublicEntity,
} from "../actions";
import { OrganizationalUnit } from "@/types/domain/organizational-unit.entity";

type OrganizationalUnitFormData = z.infer<
  typeof organizationalUnitCreateSchema
>;

interface OrganizationalUnitFormProps {
  editingUnit?: OrganizationalUnit;
  publicEntityId: number;
}

const OrganizationalUnitForm = ({
  editingUnit,
  publicEntityId,
}: OrganizationalUnitFormProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [parentUnits, setParentUnits] = useState<OrganizationalUnit[]>([]);
  const isEditing = !!editingUnit;

  const form = useForm<OrganizationalUnitFormData>({
    resolver: zodResolver(organizationalUnitCreateSchema),
    defaultValues: {
      code: editingUnit?.code || "",
      name: editingUnit?.name || "",
      level: editingUnit?.level || 0,
      status:
        (editingUnit?.status as "ACTIVE" | "INACTIVE" | "ARCHIVED") || "ACTIVE",
      parentId: editingUnit?.parentId || 1,
      publicEntityId: publicEntityId,
    },
  });

  // Load parent units on component mount
  useEffect(() => {
    const loadParentUnits = async () => {
      try {
        const units =
          await getOrganizationalUnitsByPublicEntity(publicEntityId);
        setParentUnits(units);
      } catch (error) {
        console.error("Error loading parent units:", error);
      }
    };

    if (open) {
      loadParentUnits();
    }
  }, [open, publicEntityId]);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      form.reset({
        code: editingUnit?.code || "",
        name: editingUnit?.name || "",
        level: editingUnit?.level || 0,
        status:
          (editingUnit?.status as "ACTIVE" | "INACTIVE" | "ARCHIVED") ||
          "ACTIVE",
        parentId: editingUnit?.parentId || 1,
        publicEntityId: publicEntityId,
      });
    }
  }, [open, editingUnit, form, publicEntityId]);

  const onSubmit = async (data: OrganizationalUnitFormData) => {
    setIsLoading(true);
    try {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      const result = isEditing
        ? await updateOrganizationalUnit(editingUnit.id, formData)
        : await createOrganizationalUnit(formData);

      if (result.success) {
        setOpen(false);
        form.reset();
      } else {
        console.error("Error:", result.error);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEditing ? (
          <Button variant="ghost" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
        ) : (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Unidad
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? "Editar Unidad Organizacional"
              : "Nueva Unidad Organizacional"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifica los datos de la unidad organizacional."
              : "Completa la información para crear una nueva unidad organizacional."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: UO001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nivel</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                      />
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
                      placeholder="Ej: Dirección General de Planificación"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <FormControl>
                      <Select {...field} placeholder="Selecciona el estado">
                        <option value="ACTIVE">Activo</option>
                        <option value="INACTIVE">Inactivo</option>
                        <option value="ARCHIVED">Archivado</option>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="parentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unidad Padre</FormLabel>
                    <FormControl>
                      <Select
                        {...field}
                        value={field.value?.toString()}
                        onChange={(e: { target: { value: string } }) =>
                          field.onChange(parseInt(e.target.value))
                        }
                        placeholder="Selecciona la unidad padre"
                      >
                        <option value="1">Raíz</option>
                        {parentUnits.map((unit) => (
                          <option key={unit.id} value={unit.id.toString()}>
                            {unit.name} (Nivel {unit.level})
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? "Actualizar" : "Crear"} Unidad
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default OrganizationalUnitForm;
