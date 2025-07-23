"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Target, Plus, Trash2, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { StrategicObjective } from "@/types/domain/strategic-objective.entity";
import { PndObjective } from "@/types/domain/pnd-objective.entity";
import { OdsGoal } from "@/types/domain/ods-goal.entity";

interface AlignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedObjective: StrategicObjective | null;
}

// Validation schema for alignment
const alignmentSchema = z.object({
  pndObjectiveId: z.number().min(1, "Seleccione un objetivo PND"),
  odsGoalId: z.number().min(1, "Seleccione un objetivo ODS"),
  weight: z.number().min(0.1, "El peso debe ser mayor a 0").max(100, "El peso no puede exceder 100%"),
});

type AlignmentFormData = z.infer<typeof alignmentSchema>;

interface AlignmentItem {
  id?: number;
  pndObjectiveId: number;
  odsGoalId: number;
  weight: number;
  pndObjective?: PndObjective;
  odsGoal?: OdsGoal;
}

const AlignmentModal = ({ isOpen, onClose, selectedObjective }: AlignmentModalProps) => {
  const [alignments, setAlignments] = useState<AlignmentItem[]>([]);
  const [pndObjectives, setPndObjectives] = useState<PndObjective[]>([]);
  const [odsGoals, setOdsGoals] = useState<OdsGoal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<AlignmentFormData>({
    resolver: zodResolver(alignmentSchema),
    defaultValues: {
      pndObjectiveId: 0,
      odsGoalId: 0,
      weight: 0,
    },
  });

  // Load PND and ODS catalogs
  useEffect(() => {
    if (isOpen) {
      loadCatalogs();
    }
  }, [isOpen]);

  // Load existing alignments when modal opens and catalogs are loaded
  useEffect(() => {
    const loadExistingAlignments = async () => {
      if (!selectedObjective || !isOpen || pndObjectives.length === 0 || odsGoals.length === 0) return;
      
      try {
        const response = await fetch(`/api/objective-alignments?strategicObjectiveId=${selectedObjective.id}`);
        
        if (response.ok) {
          const existingAlignments = await response.json();
          
          // Convert ObjectiveAlignment entities to AlignmentItem format
          const alignmentItems = existingAlignments.map((alignment: {
            id: number;
            pndObjectiveId: number;
            odsGoalId: number;
            weight: string;
          }) => {
            const pndObjective = pndObjectives.find(p => p.id === alignment.pndObjectiveId);
            const odsGoal = odsGoals.find(o => o.id === alignment.odsGoalId);
            
            return {
              id: alignment.id,
              pndObjectiveId: alignment.pndObjectiveId,
              odsGoalId: alignment.odsGoalId,
              weight: parseFloat(alignment.weight), // Convert string to number
              pndObjective,
              odsGoal,
            };
          });
          
          setAlignments(alignmentItems);
        } else {
          console.warn("No existing alignments found or error loading them");
          setAlignments([]);
        }
      } catch (error) {
        console.error("Error loading existing alignments:", error);
        setAlignments([]);
      }
    };

    loadExistingAlignments();
  }, [selectedObjective, isOpen, pndObjectives, odsGoals]);

  const loadCatalogs = async () => {
    setIsLoading(true);
    try {
      // Load PND objectives and ODS goals from APIs
      const [pndResponse, odsResponse] = await Promise.all([
        fetch('/api/pnd-objectives'),
        fetch('/api/ods-goals')
      ]);

      if (!pndResponse.ok) {
        throw new Error('Failed to fetch PND objectives');
      }
      
      if (!odsResponse.ok) {
        throw new Error('Failed to fetch ODS goals');
      }

      const pndData = await pndResponse.json();
      const odsData = await odsResponse.json();
      
      setPndObjectives(pndData);
      setOdsGoals(odsData);
    } catch (error) {
      console.error("Error loading catalogs:", error);
      
      // Fallback to mock data if API fails
      setPndObjectives([
        { id: 1, code: "PND01", name: "Desarrollo Económico Sostenible", description: "Promover el crecimiento económico..." },
        { id: 2, code: "PND02", name: "Inclusión Social", description: "Garantizar la inclusión social..." },
      ] as PndObjective[]);
      
      setOdsGoals([
        { id: 1, code: "ODS01", name: "Fin de la Pobreza", description: "Poner fin a la pobreza en todas sus formas..." },
        { id: 2, code: "ODS03", name: "Salud y Bienestar", description: "Garantizar una vida sana..." },
      ] as OdsGoal[]);
    } finally {
      setIsLoading(false);
    }
  };

  const getTotalWeight = () => {
    return alignments.reduce((total, alignment) => total + alignment.weight, 0);
  };

  const getRemainingWeight = () => {
    return 100 - getTotalWeight();
  };

  const addAlignment = (data: AlignmentFormData) => {
    const remainingWeight = getRemainingWeight();
    
    if (data.weight > remainingWeight) {
      form.setError("weight", {
        message: `El peso no puede exceder ${remainingWeight}% (peso restante)`,
      });
      return;
    }

    // Check if combination already exists
    const exists = alignments.some(
      (alignment) =>
        alignment.pndObjectiveId === data.pndObjectiveId &&
        alignment.odsGoalId === data.odsGoalId
    );

    if (exists) {
      form.setError("pndObjectiveId", {
        message: "Esta combinación PND-ODS ya existe",
      });
      return;
    }

    const pndObjective = pndObjectives.find(p => p.id === data.pndObjectiveId);
    const odsGoal = odsGoals.find(o => o.id === data.odsGoalId);

    const newAlignment: AlignmentItem = {
      pndObjectiveId: data.pndObjectiveId,
      odsGoalId: data.odsGoalId,
      weight: data.weight,
      pndObjective,
      odsGoal,
    };

    setAlignments([...alignments, newAlignment]);
    form.reset();
  };

  const removeAlignment = (index: number) => {
    const newAlignments = alignments.filter((_, i) => i !== index);
    setAlignments(newAlignments);
  };

  const saveAlignments = async () => {
    const totalWeight = getTotalWeight();
    
    if (totalWeight !== 100) {
      alert(`La suma de los pesos debe ser exactamente 100%. Actualmente es ${totalWeight}%`);
      return;
    }

    if (alignments.length === 0) {
      alert("Debe agregar al menos una alineación.");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/objective-alignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          strategicObjectiveId: selectedObjective?.id,
          alignments: alignments.map(alignment => ({
            pndObjectiveId: alignment.pndObjectiveId,
            odsGoalId: alignment.odsGoalId,
            weight: alignment.weight,
          })),
          createdBy: "current_user", // TODO: Get from auth context
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al guardar las alineaciones');
      }

      const result = await response.json();
      console.log("Alignments saved successfully:", result);
      alert("Alineaciones guardadas exitosamente");
      onClose();
    } catch (error) {
      console.error("Error saving alignments:", error);
      alert(`Error al guardar las alineaciones: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setAlignments([]);
    setPndObjectives([]);
    setOdsGoals([]);
    setIsLoading(false);
    setIsSaving(false);
    form.reset();
    onClose();
  };
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Alineación del Objetivo Estratégico</DialogTitle>
          <DialogDescription>
            Configurar alineación PND/ODS para: {selectedObjective?.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Objective Information */}
          {selectedObjective && (
            <div className="border rounded-lg p-4 bg-muted/50">
              <h4 className="font-semibold mb-2">Objetivo Seleccionado:</h4>
              <p className="text-sm"><strong>Código:</strong> {selectedObjective.code}</p>
              <p className="text-sm"><strong>Nombre:</strong> {selectedObjective.name}</p>
              <p className="text-sm"><strong>Descripción:</strong> {selectedObjective.description}</p>
            </div>
          )}

          {/* Weight Summary */}
          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold">Resumen de Pesos</h4>
              <div className="flex items-center gap-2">
                <Badge variant={getTotalWeight() === 100 ? "default" : "destructive"}>
                  Total: {getTotalWeight()}%
                </Badge>
                <Badge variant="outline">
                  Restante: {getRemainingWeight()}%
                </Badge>
              </div>
            </div>
            {getTotalWeight() !== 100 && (
              <div className="flex items-center gap-2 text-sm text-orange-600">
                <AlertCircle className="h-4 w-4" />
                La suma de los pesos debe ser exactamente 100%
              </div>
            )}
          </div>

          {/* Add New Alignment Form */}
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-4">Agregar Nueva Alineación</h4>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(addAlignment)} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="pndObjectiveId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Objetivo PND</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(value: string) => field.onChange(parseInt(value))}
                            value={field.value?.toString()}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar PND" />
                            </SelectTrigger>
                            <SelectContent>
                              {pndObjectives.map((objective) => (
                                <SelectItem key={objective.id} value={objective.id.toString()}>
                                  {objective.code} - {objective.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="odsGoalId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Objetivo ODS</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(value: string) => field.onChange(parseInt(value))}
                            value={field.value?.toString()}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar ODS" />
                            </SelectTrigger>
                            <SelectContent>
                              {odsGoals.map((goal) => (
                                <SelectItem key={goal.id} value={goal.id.toString()}>
                                  {goal.code} - {goal.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Peso (%)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.1"
                            min="0"
                            max="100"
                            placeholder="0.0"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={getRemainingWeight() <= 0}>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Alineación
                </Button>
              </form>
            </Form>
          </div>

          {/* Existing Alignments List */}
          {alignments.length > 0 && (
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-4">Alineaciones Configuradas</h4>
              <div className="space-y-3">
                {alignments.map((alignment, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-background">
                    <div className="flex-1">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                        <div>
                          <span className="font-medium">PND:</span> {alignment.pndObjective?.code} - {alignment.pndObjective?.name}
                        </div>
                        <div>
                          <span className="font-medium">ODS:</span> {alignment.odsGoal?.code} - {alignment.odsGoal?.name}
                        </div>
                        <div>
                          <span className="font-medium">Peso:</span> {alignment.weight}%
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeAlignment(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {alignments.length === 0 && !isLoading && (
            <div className="text-center py-8 text-muted-foreground">
              <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-lg font-medium">No hay alineaciones configuradas</p>
              <p className="text-sm">Agregue alineaciones PND y ODS para el objetivo estratégico</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button 
            type="button" 
            onClick={saveAlignments}
            disabled={isSaving || getTotalWeight() !== 100 || alignments.length === 0}
          >
            {isSaving ? "Guardando..." : "Guardar Alineaciones"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AlignmentModal;
