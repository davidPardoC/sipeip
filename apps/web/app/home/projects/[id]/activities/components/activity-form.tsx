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

interface ActivityFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (activityData: Partial<Activity>) => void;
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
  });

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
      });
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
      });
    }
  }, [activity]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      projectId,
      ...(activity && { id: activity.id }),
    });
  };

  const handleChange = (field: keyof ActivityFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const formatStatusName = (status: string) => {
    return status
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {activity ? "Edit Activity" : "Create New Activity"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="responsiblePerson">Responsible Person *</Label>
              <Input
                id="responsiblePerson"
                value={formData.responsiblePerson}
                onChange={(e) => handleChange("responsiblePerson", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date *</Label>
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
              <Label htmlFor="progressPercent">Progress (%)</Label>
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
              <Label htmlFor="executedBudget">Executed Budget</Label>
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
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value: ActivityStatus) => handleChange("status", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PLANNED">{formatStatusName("PLANNED")}</SelectItem>
                  <SelectItem value="IN_PROGRESS">{formatStatusName("IN_PROGRESS")}</SelectItem>
                  <SelectItem value="COMPLETED">{formatStatusName("COMPLETED")}</SelectItem>
                  <SelectItem value="CANCELLED">{formatStatusName("CANCELLED")}</SelectItem>
                  <SelectItem value="ON_HOLD">{formatStatusName("ON_HOLD")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {activity ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ActivityForm;
