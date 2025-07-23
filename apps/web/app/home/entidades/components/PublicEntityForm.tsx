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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { publicEntityCreateSchema } from "@/lib/validations/sectors.validators";
import { createPublicEntity, updatePublicEntity } from "../actions";
import { PublicEntity } from "@/types/domain/public-entity.entity";
import { getMicroSectores } from "../../sectores/actions";
import { MicroSector } from "@/types/domain/micro-sector.entity";

type PublicEntityFormData = z.infer<typeof publicEntityCreateSchema>;

interface PublicEntityFormProps {
  editingEntity?: PublicEntity;
}

const PublicEntityForm = ({ editingEntity }: PublicEntityFormProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [microSectors, setMicroSectors] = useState<MicroSector[]>([]);
  const isEditing = !!editingEntity;

  const form = useForm<PublicEntityFormData>({
    resolver: zodResolver(publicEntityCreateSchema),
    defaultValues: {
      code: editingEntity?.code || "",
      name: editingEntity?.name || "",
      shortName: editingEntity?.shortName || "",
      govermentLevel: editingEntity?.govermentLevel || "",
      status: (editingEntity?.status as "ACTIVE" | "INACTIVE" | "ARCHIVED") || "ACTIVE",
      subSectorId: editingEntity?.subSectorId || 0,
    },
  });

  // Load micro sectors on component mount
  useEffect(() => {
    const loadMicroSectors = async () => {
      try {
        const sectors = await getMicroSectores();
        setMicroSectors(sectors);
      } catch (error) {
        console.error("Error loading micro sectors:", error);
      }
    };

    if (open) {
      loadMicroSectors();
    }
  }, [open]);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      form.reset({
        code: editingEntity?.code || "",
        name: editingEntity?.name || "",
        shortName: editingEntity?.shortName || "",
        govermentLevel: editingEntity?.govermentLevel || "",
        status: (editingEntity?.status as "ACTIVE" | "INACTIVE" | "ARCHIVED") || "ACTIVE",
        subSectorId: editingEntity?.subSectorId || 0,
      });
    }
  }, [open, editingEntity, form]);

  const onSubmit = async (data: PublicEntityFormData) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      const result = isEditing
        ? await updatePublicEntity(editingEntity.id, formData)
        : await createPublicEntity(formData);

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
            Nueva Entidad
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Entidad Pública" : "Nueva Entidad Pública"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifica los datos de la entidad pública."
              : "Completa la información para crear una nueva entidad pública."}
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
                      <Input placeholder="Ej: ENT001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shortName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre Corto</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: MINEDU" {...field} />
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
                  <FormLabel>Nombre Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Ministerio de Educación" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="govermentLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nivel de Gobierno</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el nivel" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NACIONAL">Nacional</SelectItem>
                          <SelectItem value="REGIONAL">Regional</SelectItem>
                          <SelectItem value="LOCAL">Local</SelectItem>
                        </SelectContent>
                      </Select>
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
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ACTIVE">Activo</SelectItem>
                          <SelectItem value="INACTIVE">Inactivo</SelectItem>
                          <SelectItem value="ARCHIVED">Archivado</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="subSectorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subsector</FormLabel>
                  <FormControl>
                    <Select 
                      onValueChange={(value: string) => field.onChange(parseInt(value))}
                      value={field.value?.toString()}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el subsector" />
                      </SelectTrigger>
                      <SelectContent>
                        {microSectors.map((sector) => (
                          <SelectItem key={sector.id} value={sector.id.toString()}>
                            {sector.name} ({sector.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                {isEditing ? "Actualizar" : "Crear"} Entidad
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PublicEntityForm;
