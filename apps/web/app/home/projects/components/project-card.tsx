import React from "react";
import { Button } from "@/components/ui/button";
import { Paperclip, MessageSquare, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProjectWithRelations } from "@/types/domain/project.entity";
import { ProjectStatusEnum } from "@/types/project.status.enum";
import { Session } from "next-auth";
import { ROLES } from "@/constants/role.constants";
import RBACComponent from "@/components/rbac";

interface ProjectCardProps {
  project: ProjectWithRelations;
  onEdit: (project: ProjectWithRelations) => void;
  onDelete: (id: number) => void;
  onOpenFilesModal: (project: ProjectWithRelations) => void;
  onOpenObservationsModal: (project: ProjectWithRelations) => void;
  onStatusUpdate: (projectId: number, newStatus: ProjectStatusEnum) => void;
  formatCurrency: (value: string) => string;
  isUpdatingStatus?: boolean;
  session: Session | null;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onEdit,
  onDelete,
  onOpenFilesModal,
  onOpenObservationsModal,
  onStatusUpdate,
  formatCurrency,
  isUpdatingStatus = false,
  session,
}) => {
  return (
    <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-3">
            <h3 className="text-xl font-semibold text-gray-900">
              {project.code}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-500">Status:</span>
              <Select
                value={project.status || "ACTIVE"}
                onValueChange={(value: string) =>
                  onStatusUpdate(project.id, value as ProjectStatusEnum)
                }
                disabled={isUpdatingStatus}
              >
                <SelectTrigger
                  className={`w-fit min-w-[140px] ${isUpdatingStatus ? "opacity-70" : ""}`}
                >
                  {isUpdatingStatus ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span className="text-xs">Updating...</span>
                    </div>
                  ) : (
                    <SelectValue />
                  )}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="SEND_FOR_APPROVAL">
                    Send for Approval
                  </SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  <SelectItem value="ON_HOLD">On Hold</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REQUEST_CHANGES">
                    Request Changes
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-600">
                <span className="font-medium text-gray-700">CUP:</span>{" "}
                {project.cup}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium text-gray-700">Budget:</span>{" "}
                {formatCurrency(project.budget)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">
                <span className="font-medium text-gray-700">Start:</span>{" "}
                {project.startDate}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium text-gray-700">End:</span>{" "}
                {project.endDate}
              </p>
            </div>
          </div>

          {(project.program ||
            project.strategicObjective ||
            project.typology) && (
            <div className="border-t pt-3">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
                {project.program && (
                  <div className="bg-blue-50 rounded-md px-3 py-2">
                    <p className="text-xs font-medium text-blue-700 uppercase tracking-wide">
                      Program
                    </p>
                    <p
                      className="text-sm text-blue-900 mt-1 truncate"
                      title={project.program.name}
                    >
                      {project.program.name}
                    </p>
                  </div>
                )}
                {project.strategicObjective && (
                  <div className="bg-green-50 rounded-md px-3 py-2">
                    <p className="text-xs font-medium text-green-700 uppercase tracking-wide">
                      Strategic Objective
                    </p>
                    <p
                      className="text-sm text-green-900 mt-1 truncate"
                      title={project.strategicObjective.name}
                    >
                      {project.strategicObjective.name}
                    </p>
                  </div>
                )}
                {project.typology && (
                  <div className="bg-purple-50 rounded-md px-3 py-2">
                    <p className="text-xs font-medium text-purple-700 uppercase tracking-wide">
                      Typology
                    </p>
                    <p
                      className="text-sm text-purple-900 mt-1 truncate"
                      title={project.typology.name}
                    >
                      {project.typology.name}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 ml-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenFilesModal(project)}
            title="Attach Files"
            className="w-full"
          >
            <Paperclip className="h-4 w-4 mr-2" />
            Files
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenObservationsModal(project)}
            title="View Observations"
            className="w-full"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Notes
          </Button>
          <RBACComponent
            roles={[ROLES.PLANIFICATION_TECHNICIAN]}
            session={session}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(project)}
              className="w-full"
            >
              Edit
            </Button>
          </RBACComponent>

          <RBACComponent
            roles={[ROLES.PLANIFICATION_TECHNICIAN]}
            session={session}
          >
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(project.id)}
              className="w-full"
            >
              Delete
            </Button>
          </RBACComponent>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
