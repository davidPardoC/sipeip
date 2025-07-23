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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { odsGoalCreateSchema } from "@/lib/validations/ods-goal.validators";
import { createOdsGoal, updateOdsGoal } from "../actions";
import { OdsGoal } from "@/types/domain/ods-goal.entity";

type OdsGoalFormData = z.infer<typeof odsGoalCreateSchema>;

interface OdsGoalFormProps {
  editingOdsGoal?: OdsGoal;
}

const OdsGoalForm = ({ editingOdsGoal }: OdsGoalFormProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!editingOdsGoal;

  const form = useForm<OdsGoalFormData>({
    resolver: zodResolver(odsGoalCreateSchema),
    defaultValues: {
      code: editingOdsGoal?.code || "",
      name: editingOdsGoal?.name || "",
      description: editingOdsGoal?.description || "",
      createdBy: editingOdsGoal?.createdBy || "",
    },
  });

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      form.reset({
        code: editingOdsGoal?.code || "",
        name: editingOdsGoal?.name || "",
        description: editingOdsGoal?.description || "",
        createdBy: editingOdsGoal?.createdBy || "",
      });
    }
  }, [open, editingOdsGoal, form]);

  const onSubmit = async (data: OdsGoalFormData) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      const result = isEditing
        ? await updateOdsGoal(editingOdsGoal.id, formData)
        : await createOdsGoal(formData);

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
            Nuevo ODS
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Objetivo ODS" : "Nuevo Objetivo ODS"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifica los datos del objetivo ODS."
              : "Completa la información para crear un nuevo objetivo ODS."}
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
                      <Input placeholder="Ej: ODS01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Fin de la pobreza" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe el objetivo de desarrollo sostenible..." 
                      className="min-h-[100px]"
                      {...field} 
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
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? "Actualizar" : "Crear"} ODS
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default OdsGoalForm;
