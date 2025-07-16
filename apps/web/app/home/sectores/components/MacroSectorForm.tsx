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
import { macroSectorCreateSchema } from "@/lib/validations/sectors.validators";
import { createMacroSector, updateMacroSector } from "../actions";
import { MacroSector } from "@/types/domain/macro-sector.entity";

type MacroSectorFormData = z.infer<typeof macroSectorCreateSchema>;

interface MacroSectorFormProps {
  macroSector?: MacroSector;
  mode?: "create" | "edit";
}

const MacroSectorForm = ({ macroSector, mode = "create" }: MacroSectorFormProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = mode === "edit";

  const form = useForm<MacroSectorFormData>({
    resolver: zodResolver(macroSectorCreateSchema),
    defaultValues: {
      name: macroSector?.name || "",
      code: macroSector?.code || "",
    },
  });

  // Reset form when macroSector prop changes
  useEffect(() => {
    if (macroSector) {
      form.reset({
        name: macroSector.name,
        code: macroSector.code,
      });
    }
  }, [macroSector, form]);

  const onSubmit = async (data: MacroSectorFormData) => {
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("code", data.code);

      const result = isEditing && macroSector
        ? await updateMacroSector(macroSector.id, formData)
        : await createMacroSector(formData);
      
      if (result.success) {
        form.reset();
        setOpen(false);
        // TODO: Add success notification
        console.log(`Macro sector ${isEditing ? 'updated' : 'created'} successfully`);
      } else {
        // TODO: Add error notification
        console.error(`Error ${isEditing ? 'updating' : 'creating'} macro sector:`, result.error);
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
            Nuevo Macro Sector
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Macro Sector" : "Crear Nuevo Macro Sector"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifica la información del macro sector."
              : "Ingresa la información del nuevo macro sector."
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
                      placeholder="Ingresa el nombre del macro sector"
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
                      placeholder="Ingresa el código del macro sector"
                      {...field}
                      disabled={isLoading}
                    />
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

export default MacroSectorForm;
