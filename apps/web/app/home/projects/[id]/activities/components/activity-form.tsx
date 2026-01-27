import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Activity, ActivityStatus } from "@/types/domain/activity.entity";
import { StrategicObjective } from "@/types/domain/strategic-objective.entity";
import { Checkbox } from "@/components/ui/checkbox";

interface ActivityFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (activityData: Partial<Activity>) => void;
  activity?: Activity | null;
  projectId: number;
  strategicObjectives?: StrategicObjective[];
}

interface ActivityFormData {
  activityCode: string;
  name: string;
  description: string;
  responsiblePerson: string;
  startDate: string;
  endDate: string;
  actualStartDate: string;
  actualEndDate: string;
  plannedDuration: string;
  progressPercent: string;
  plannedProgress: string;
  actualProgress: string;
  executedBudget: string;
  priority: string;
  status: ActivityStatus;
  objectiveIds: number[];
}

const ActivityForm: React.FC<ActivityFormProps> = ({
  isOpen,
  onClose,
  onSave,
  activity,
  projectId,
  strategicObjectives = [],
}) => {
  const [formData, setFormData] = React.useState<ActivityFormData>({
    activityCode: "",
    name: "",
    description: "",
    responsiblePerson: "",
    startDate: "",
    endDate: "",
    actualStartDate: "",
    actualEndDate: "",
    plannedDuration: "",
    progressPercent: "0.00",
    plannedProgress: "0.00",
    actualProgress: "0.00",
    executedBudget: "0.00",
    priority: "3",
    status: "PLANNED",
    objectiveIds: [],
  });
  const [error, setError] = React.useState<string>("");

  React.useEffect(() => {
    if (activity) {
      setFormData({
        activityCode: activity.activityCode || "",
        name: activity.name,
        description: activity.description || "",
        responsiblePerson: activity.responsiblePerson,
        startDate: activity.startDate,
        endDate: activity.endDate,
        actualStartDate: activity.actualStartDate || "",
        actualEndDate: activity.actualEndDate || "",
        plannedDuration: activity.plannedDuration?.toString() || "",
        progressPercent: activity.progressPercent,
        plannedProgress: activity.plannedProgress || "0.00",
        actualProgress: activity.actualProgress || "0.00",
        executedBudget: activity.executedBudget,
        priority: activity.priority?.toString() || "3",
        status: activity.status,
        objectiveIds: [],
      });
    } else {
      setFormData({
        activityCode: "",
        name: "",
        description: "",
        responsiblePerson: "",
        startDate: "",
        endDate: "",
        actualStartDate: "",
        actualEndDate: "",
        plannedDuration: "",
        progressPercent: "0.00",
        plannedProgress: "0.00",
        actualProgress: "0.00",
        executedBudget: "0.00",
        priority: "3",
        status: "PLANNED",
        objectiveIds: [],
      });
    }
    setError("");
  }, [activity]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // V-01: Date validation
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      setError("La fecha de fin no puede ser anterior a la fecha de inicio");
      return;
    }

    if (
      formData.actualStartDate &&
      formData.actualEndDate &&
      new Date(formData.actualEndDate) < new Date(formData.actualStartDate)
    ) {
      setError(
        "La fecha real de fin no puede ser anterior a la fecha real de inicio"
      );
      return;
    }

    // V-03: Objective validation
    if (formData.objectiveIds.length === 0 && !activity) {
      setError(
        "Debe seleccionar al menos un objetivo estratégico (V-03)"
      );
      return;
    }

    onSave({
      ...formData,
      plannedDuration: formData.plannedDuration
        ? parseInt(formData.plannedDuration)
        : undefined,
      priority: parseInt(formData.priority),
      projectId,
      ...(activity && { id: activity.id }),
    });
  };

  const handleChange = (field: keyof ActivityFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (error) setError("");
  };

  const handleObjectiveToggle = (objectiveId: number) => {
    setFormData((prev) => {
      const isSelected = prev.objectiveIds.includes(objectiveId);
      return {
        ...prev,
        objectiveIds: isSelected
          ? prev.objectiveIds.filter((id) => id !== objectiveId)
          : [...prev.objectiveIds, objectiveId],
      };
    });
    if (error) setError("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {activity ? "Editar Actividad" : "Crear Nueva Actividad"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Información Básica</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="activityCode">Código de Actividad *</Label>
                <Input
                  id="activityCode"
                  placeholder="ACT001"
                  value={formData.activityCode}
                  onChange={(e) => handleChange("activityCode", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Prioridad *</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => handleChange("priority", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Muy Baja</SelectItem>
                    <SelectItem value="2">2 - Baja</SelectItem>
                    <SelectItem value="3">3 - Media</SelectItem>
                    <SelectItem value="4">4 - Alta</SelectItem>
                    <SelectItem value="5">5 - Muy Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="responsiblePerson">Responsable *</Label>
                <Input
                  id="responsiblePerson"
                  value={formData.responsiblePerson}
                  onChange={(e) =>
                    handleChange("responsiblePerson", e.target.value)
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {/* Planned Dates */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Fechas Planificadas</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Fecha de Inicio *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleChange("startDate", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Fecha de Fin *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleChange("endDate", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="plannedDuration">Duración Planificada (días)</Label>
                <Input
                  id="plannedDuration"
                  type="number"
                  min="1"
                  value={formData.plannedDuration}
                  onChange={(e) =>
                    handleChange("plannedDuration", e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          {/* Actual Dates */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Fechas Reales</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="actualStartDate">Fecha Real de Inicio</Label>
                <Input
                  id="actualStartDate"
                  type="date"
                  value={formData.actualStartDate}
                  onChange={(e) =>
                    handleChange("actualStartDate", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="actualEndDate">Fecha Real de Fin</Label>
                <Input
                  id="actualEndDate"
                  type="date"
                  value={formData.actualEndDate}
                  onChange={(e) =>
                    handleChange("actualEndDate", e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          {/* Progress & Budget */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Progreso y Presupuesto</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="plannedProgress">Avance Planificado</Label>
                <Input
                  id="plannedProgress"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={formData.plannedProgress}
                  onChange={(e) =>
                    handleChange("plannedProgress", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="actualProgress">Avance Real</Label>
                <Input
                  id="actualProgress"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={formData.actualProgress}
                  onChange={(e) =>
                    handleChange("actualProgress", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="progressPercent">Progreso General (%)</Label>
                <Input
                  id="progressPercent"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={formData.progressPercent}
                  onChange={(e) =>
                    handleChange("progressPercent", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="executedBudget">Presupuesto Ejecutado</Label>
                <Input
                  id="executedBudget"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.executedBudget}
                  onChange={(e) =>
                    handleChange("executedBudget", e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Select
                value={formData.status}
                onValueChange={(value: ActivityStatus) =>
                  handleChange("status", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PLANNED">Planeado</SelectItem>
                  <SelectItem value="IN_PROGRESS">En Progreso</SelectItem>
                  <SelectItem value="COMPLETED">Completado</SelectItem>
                  <SelectItem value="CANCELLED">Cancelado</SelectItem>
                  <SelectItem value="ON_HOLD">En Espera</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Strategic Objectives (V-03) */}
          {/* Strategic Objectives (V-03) */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              Objetivos Estratégicos * (V-03)
            </h3>
            {strategicObjectives.length > 0 ? (
              <>
                <div className="border rounded-lg p-4 max-h-60 overflow-y-auto space-y-2">
                  {strategicObjectives.map((objective) => (
                    <div
                      key={objective.id}
                      className="flex items-start space-x-2"
                    >
                      <Checkbox
                        id={`objective-${objective.id}`}
                        checked={formData.objectiveIds.includes(objective.id)}
                        onCheckedChange={() =>
                          handleObjectiveToggle(objective.id)
                        }
                      />
                      <label
                        htmlFor={`objective-${objective.id}`}
                        className="text-sm cursor-pointer leading-relaxed"
                      >
                        <span className="font-medium">{objective.code}</span> -{" "}
                        {objective.name}
                      </label>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Seleccione al menos un objetivo estratégico para esta actividad
                </p>
              </>
            ) : (
              <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded">
                No hay objetivos estratégicos disponibles. Por favor, asegúrese de
                que existan objetivos estratégicos en el sistema antes de crear
                una actividad.
              </div>
            )}
          </div>

          {error && (
            <div className="text-sm text-red-500 bg-red-50 p-3 rounded">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {activity ? "Actualizar" : "Crear"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ActivityForm;
