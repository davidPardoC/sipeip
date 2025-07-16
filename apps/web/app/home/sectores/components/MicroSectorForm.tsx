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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectOption } from "@/components/ui/select";
import { microSectorCreateSchema } from "@/lib/validations/sectors.validators";
import { createMicroSector, updateMicroSector, getSectores } from "../actions";
import { MicroSector } from "@/types/domain/micro-sector.entity";
import { Sector } from "@/types/domain/sector.entity";

type MicroSectorFormData = z.infer<typeof microSectorCreateSchema>;

interface MicroSectorFormProps {
  microSector?: MicroSector;
  mode?: "create" | "edit";
}

const MicroSectorForm = ({ microSector, mode = "create" }: MicroSectorFormProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sectores, setSectores] = useState<Sector[]>([]);
  const [loadingSectores, setLoadingSectores] = useState(false);
  const isEditing = mode === "edit";

  const form = useForm<MicroSectorFormData>({
    resolver: zodResolver(microSectorCreateSchema),
    defaultValues: {
      name: microSector?.name || "",
      code: microSector?.code || "",
      sectorId: microSector?.sectorId.toString() || "",
    },
  });

  // Load sectores when dialog opens
  useEffect(() => {
    if (open) {
      loadSectores();
    }
  }, [open]);

  // Reset form when microSector prop changes
  useEffect(() => {
    if (microSector) {
      form.reset({
        name: microSector.name,
        code: microSector.code,
        sectorId: microSector.sectorId.toString(),
      });
    }
  }, [microSector, form]);

  const loadSectores = async () => {
    setLoadingSectores(true);
    try {
      const data = await getSectores();
      setSectores(data);
    } catch (error) {
      console.error("Error loading sectores:", error);
    } finally {
      setLoadingSectores(false);
    }
  };

  const onSubmit = async (data: MicroSectorFormData) => {
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("code", data.code);
      formData.append("sectorId", data.sectorId);

      const result = isEditing && microSector
        ? await updateMicroSector(microSector.id, formData)
        : await createMicroSector(formData);
      
      if (result.success) {
        form.reset();
        setOpen(false);
        // TODO: Add success notification
        console.log(`Micro sector ${isEditing ? 'updated' : 'created'} successfully`);
      } else {
        // TODO: Add error notification
        console.error(`Error ${isEditing ? 'updating' : 'creating'} micro sector:`, result.error);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEditing ? (
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            title="Editar"
          >
            <Edit className="h-4 w-4" />
          </Button>
        ) : (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Micro Sector
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Micro Sector" : "Crear Nuevo Micro Sector"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifica la información del micro sector."
              : "Ingresa la información del nuevo micro sector."
            } Haz clic en guardar cuando hayas terminado.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ingresa el nombre del micro sector"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ingresa el código del micro sector"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sectorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sector</FormLabel>
                  <FormControl>
                    <Select
                      {...field}
                      disabled={isLoading || loadingSectores}
                      placeholder="Selecciona un sector"
                    >
                      {sectores.map((sector) => (
                        <SelectOption key={sector.id} value={sector.id.toString()}>
                          {sector.name} ({sector.code})
                        </SelectOption>
                      ))}
                    </Select>
                  </FormControl>
                  <FormMessage />
                  {loadingSectores && (
                    <p className="text-sm text-muted-foreground">
                      Cargando sectores...
                    </p>
                  )}
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
              <Button type="submit" disabled={isLoading || loadingSectores}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {isEditing ? "Actualizando..." : "Guardando..."}
                  </>
                ) : (
                  isEditing ? "Actualizar" : "Guardar"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MicroSectorForm;
