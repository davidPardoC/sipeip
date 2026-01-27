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
// I'll use input type="checkbox" if Checkbox component doesn't exist, OR check if I missed it.
// List in step 209 didn't show checkbox.tsx. I'll use native input.

interface ActivityFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (activityData: Partial<Activity> & { objectiveIds?: number[] }) => void;
  activity?: Activity | null;
  projectId: number;
}

interface ActivityFormData {
  name: string;
  description: string;
  responsiblePerson: string;
  startDate: string;
  endDate: string;
  progressPercent: string;
  executedBudget: string;
  status: ActivityStatus;
  priority: string; // Store as string for Input match, convert to number
  isActive: boolean;
}

interface StrategicObjective {
  id: number;
  name: string;
  description: string;
}

const ActivityForm: React.FC<ActivityFormProps> = ({
  isOpen,
  onClose,
  onSave,
  activity,
  projectId,
}) => {
  const [formData, setFormData] = React.useState<ActivityFormData>({
    name: "",
    description: "",
    responsiblePerson: "",
    startDate: "",
    endDate: "",
    progressPercent: "0.00",
    executedBudget: "0.00",
    status: "PLANNED",
    priority: "1",
    isActive: true,
  });
  const [selectedObjectives, setSelectedObjectives] = React.useState<number[]>([]);
  const [availableObjectives, setAvailableObjectives] = React.useState<StrategicObjective[]>([]);
  const [error, setError] = React.useState<string>("");

  // Fetch Objectives
  React.useEffect(() => {
    const fetchObjectives = async () => {
      try {
        const res = await fetch("/api/strategic-objectives");
        if (res.ok) {
          const data = await res.json();
          setAvailableObjectives(data);
        }
      } catch (e) {
        console.error("Error fetching objectives", e);
      }
    };
    if (isOpen) {
      fetchObjectives();
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (activity) {
      setFormData({
        name: activity.name,
        description: activity.description || "",
        responsiblePerson: activity.responsiblePerson,
        startDate: activity.startDate,
        endDate: activity.endDate,
        progressPercent: activity.progressPercent,
        executedBudget: activity.executedBudget,
        status: activity.status,
        priority: activity.priority ? activity.priority.toString() : "1",
        isActive: activity.isActive !== undefined ? activity.isActive : true,
      });
      // Set selected objectives if available in activity (need to populate them in backend or fetch separately)
      // Currently backend getAll/getById might not return joined objectives by default unless relations are set deeply.
      // For now, assume empty or handle if provided.
      if (activity.objectiveIds) {
        setSelectedObjectives(activity.objectiveIds);
      } else {
        setSelectedObjectives([]);
      }
    } else {
      setFormData({
        name: "",
        description: "",
        responsiblePerson: "",
        startDate: "",
        endDate: "",
        progressPercent: "0.00",
        executedBudget: "0.00",
        status: "PLANNED",
        priority: "1",
        isActive: true,
      });
      setSelectedObjectives([]);
    }
    setError("");
  }, [activity, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      setError("La fecha de fin no puede ser anterior a la fecha de inicio");
      return;
    }

    // Validate V-03: At least one objective
    if (selectedObjectives.length === 0) {
      setError("Debe asociar la actividad a al menos un objetivo (V-03)");
      return;
    }

    onSave({
      ...formData,
      priority: parseInt(formData.priority, 10),
      objectiveIds: selectedObjectives,
      projectId,
      ...(activity && { id: activity.id }),
    });
  };

  const handleChange = (field: keyof ActivityFormData, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (error) setError("");
  };

  const toggleObjective = (id: number) => {
    setSelectedObjectives(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {activity ? "Editar Actividad" : "Crear Nueva Actividad"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
                onChange={(e) => handleChange("responsiblePerson", e.target.value)}
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

          <div className="grid grid-cols-2 gap-4">
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
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="progressPercent">Progreso (%)</Label>
              <Input
                id="progressPercent"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={formData.progressPercent}
                onChange={(e) => handleChange("progressPercent", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="executedBudget">Pres. Ejecutado</Label>
              <Input
                id="executedBudget"
                type="number"
                step="0.01"
                min="0"
                value={formData.executedBudget}
                onChange={(e) => handleChange("executedBudget", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Select value={formData.status} onValueChange={(value: ActivityStatus) => handleChange("status", value)}>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Prioridad (1-5)</Label>
              <Select value={formData.priority} onValueChange={(value: string) => handleChange("priority", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((p) => (
                    <SelectItem key={p} value={p.toString()}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => handleChange("isActive", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Activa
                </span>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Objetivos Estratégicos Asociados *</Label>
            <div className="border rounded-md p-2 h-32 overflow-y-auto space-y-2">
              {availableObjectives.length > 0 ? availableObjectives.map(obj => (
                <label key={obj.id} className="flex items-start space-x-2 cursor-pointer p-1 hover:bg-gray-50 rounded">
                  <input
                    type="checkbox"
                    checked={selectedObjectives.includes(obj.id)}
                    onChange={() => toggleObjective(obj.id)}
                    className="mt-1 h-4 w-4 rounded border-gray-300"
                  />
                  <div className="text-sm">
                    <p className="font-medium">{obj.name}</p>
                    <p className="text-xs text-gray-500 truncate">{obj.description}</p>
                  </div>
                </label>
              )) : <p className="text-sm text-gray-500 p-2">Cargando objetivos...</p>}
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-500">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
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
