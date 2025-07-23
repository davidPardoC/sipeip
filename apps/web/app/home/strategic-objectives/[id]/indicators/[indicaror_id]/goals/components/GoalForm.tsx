"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateGoalSchema, GoalFormData } from "@/lib/validations/goal.validators";
import { Goal } from "@/types/domain/goal.entity";
import { createGoal, updateGoal } from "../actions";

interface GoalFormProps {
  goal?: Goal;
  indicatorId: number;
  onGoalSaved: () => void;
  trigger: React.ReactNode;
}

const GoalForm = ({ goal, indicatorId, onGoalSaved, trigger }: GoalFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<GoalFormData>({
    resolver: zodResolver(CreateGoalSchema.omit({ indicatorId: true })),
    defaultValues: {
      year: goal?.year || new Date().getFullYear(),
      targetValue: goal?.targetValue || "",
      actualValue: goal?.actualValue || "",
      status: goal?.status || "ACTIVE",
    },
  });

  const onSubmit = async (data: GoalFormData) => {
    setIsLoading(true);
    try {
      let result;
      
      if (goal) {
        result = await updateGoal(goal.id, data);
      } else {
        result = await createGoal({ ...data, indicatorId });
      }

      if (result.success) {
        form.reset();
        setIsOpen(false);
        onGoalSaved();
      } else {
        console.error("Error saving goal:", result.error);
      }
    } catch (error) {
      console.error("Error submitting goal:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {goal ? "Editar Meta" : "Crear Nueva Meta"}
          </DialogTitle>
          <DialogDescription>
            {goal
              ? "Actualiza la información de la meta"
              : "Completa la información para crear una nueva meta"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Año</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="2000"
                      max="2099"
                      placeholder="2024"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="targetValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor Meta</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="100.00"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="actualValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor Actual (Opcional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="75.00"
                      {...field}
                    />
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
                  <Select 
                    value={field.value} 
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un estado" />
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

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "Procesando..."
                  : goal
                  ? "Actualizar Meta"
                  : "Crear Meta"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default GoalForm;
