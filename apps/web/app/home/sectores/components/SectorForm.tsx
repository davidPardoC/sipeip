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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { sectorCreateSchema } from "@/lib/validations/sectors.validators";
import { createSector, updateSector, getMacroSectores } from "../actions";
import { Sector } from "@/types/domain/sector.entity";
import { MacroSector } from "@/types/domain/macro-sector.entity";

type SectorFormData = z.infer<typeof sectorCreateSchema>;

interface SectorFormProps {
  sector?: Sector;
  mode?: "create" | "edit";
}

const SectorForm = ({ sector, mode = "create" }: SectorFormProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [macroSectores, setMacroSectores] = useState<MacroSector[]>([]);
  const [loadingMacroSectores, setLoadingMacroSectores] = useState(false);
  const isEditing = mode === "edit";

  const form = useForm<SectorFormData>({
    resolver: zodResolver(sectorCreateSchema),
    defaultValues: {
      name: sector?.name || "",
      code: sector?.code || "",
      macroSectorId: sector?.macroSectorId.toString() || "",
    },
  });

  // Load macro sectores when dialog opens
  useEffect(() => {
    if (open) {
      loadMacroSectores();
    }
  }, [open]);

  // Reset form when sector prop changes
  useEffect(() => {
    if (sector) {
      form.reset({
        name: sector.name,
        code: sector.code,
        macroSectorId: sector.macroSectorId.toString(),
      });
    }
  }, [sector, form]);

  const loadMacroSectores = async () => {
    setLoadingMacroSectores(true);
    try {
      const data = await getMacroSectores();
      setMacroSectores(data);
    } catch (error) {
      console.error("Error loading macro sectores:", error);
    } finally {
      setLoadingMacroSectores(false);
    }
  };

  const onSubmit = async (data: SectorFormData) => {
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("code", data.code);
      formData.append("macroSectorId", data.macroSectorId);

      const result = isEditing && sector
        ? await updateSector(sector.id, formData)
        : await createSector(formData);
      
      if (result.success) {
        form.reset();
        setOpen(false);
        // TODO: Add success notification
        console.log(`Sector ${isEditing ? 'updated' : 'created'} successfully`);
      } else {
        // TODO: Add error notification
        console.error(`Error ${isEditing ? 'updating' : 'creating'} sector:`, result.error);
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
            Nuevo Sector
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Sector" : "Crear Nuevo Sector"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifica la información del sector."
              : "Ingresa la información del nuevo sector."
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
                      placeholder="Ingresa el nombre del sector"
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
                      placeholder="Ingresa el código del sector"
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
              name="macroSectorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Macro Sector</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isLoading || loadingMacroSectores}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un macro sector" />
                      </SelectTrigger>
                      <SelectContent>
                        {macroSectores.map((macroSector) => (
                          <SelectItem key={macroSector.id} value={macroSector.id.toString()}>
                            {macroSector.name} ({macroSector.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                  {loadingMacroSectores && (
                    <p className="text-sm text-muted-foreground">
                      Cargando macro sectores...
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
              <Button type="submit" disabled={isLoading || loadingMacroSectores}>
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

export default SectorForm;
