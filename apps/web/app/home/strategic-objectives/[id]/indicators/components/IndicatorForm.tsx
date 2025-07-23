"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createIndicator, updateIndicator } from "../actions";
import { Indicator } from "@/types/domain/indicator.entity";

// Base schema for the form - we'll use this consistently for both create and edit
import { z } from "zod";

const indicatorFormSchema = z.object({
  name: z.string().min(1, "Nombre es requerido").max(255, "Nombre debe tener menos de 255 caracteres"),
  unit: z.string().min(1, "Unidad es requerida").max(100, "Unidad debe tener menos de 100 caracteres"),
  formula: z.string().min(1, "Fórmula es requerida"),
  baseline: z.string().min(1, "Línea base es requerida"),
  status: z.enum(["ACTIVE", "INACTIVE", "ARCHIVED"]),
});

type IndicatorFormData = z.infer<typeof indicatorFormSchema>;

type IndicatorFormProps = {
  indicator?: Indicator;
  strategicObjectiveId: number;
  onIndicatorSaved?: () => void;
  trigger?: React.ReactNode;
};

const IndicatorForm = ({ 
  indicator, 
  strategicObjectiveId, 
  onIndicatorSaved,
  trigger 
}: IndicatorFormProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!indicator;

  const form = useForm<IndicatorFormData>({
    resolver: zodResolver(indicatorFormSchema),
    defaultValues: {
      name: indicator?.name || "",
      unit: indicator?.unit || "",
      formula: indicator?.formula || "",
      baseline: indicator?.baseline || "",
      status: (indicator?.status as "ACTIVE" | "INACTIVE" | "ARCHIVED") || "ACTIVE",
    },
  });

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      form.reset({
        name: indicator?.name || "",
        unit: indicator?.unit || "",
        formula: indicator?.formula || "",
        baseline: indicator?.baseline || "",
        status: (indicator?.status as "ACTIVE" | "INACTIVE" | "ARCHIVED") || "ACTIVE",
      });
    }
  }, [open, indicator, form]);

  const onSubmit = async (data: IndicatorFormData) => {
    setIsLoading(true);
    try {
      let result;
      
      if (isEditing && indicator) {
        result = await updateIndicator(indicator.id, data);
      } else {
        const createData = {
          ...data,
          ownerType: "StrategicObjective" as const,
          ownerId: strategicObjectiveId,
        };
        result = await createIndicator(createData);
      }

      if (result.success) {
        setOpen(false);
        form.reset();
        onIndicatorSaved?.();
      } else {
        console.error("Error saving indicator:", result.error);
      }
    } catch (error) {
      console.error("Error saving indicator:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant={isEditing ? "outline" : "default"} size="sm">
            {isEditing ? (
              <>
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Indicador
              </>
            )}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Indicador" : "Crear Nuevo Indicador"}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Modifica los datos del indicador. Haz clic en guardar cuando termines."
              : "Completa la información para crear un nuevo indicador."
            }
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4">
              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Indicador</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ej: Porcentaje de cumplimiento de metas"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Unit and Baseline Row */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unidad de Medida</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ej: %, cantidad, ratio"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="baseline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Línea Base</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ej: 0, 100, 50.5"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Formula Field */}
              <FormField
                control={form.control}
                name="formula"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fórmula de Cálculo</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe cómo se calcula este indicador..."
                        rows={3}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status Field */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ACTIVE">Activo</SelectItem>
                        <SelectItem value="INACTIVE">Inactivo</SelectItem>
                        <SelectItem value="ARCHIVED">Archivado</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="gap-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isEditing ? "Actualizar" : "Crear"} Indicador
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default IndicatorForm;
