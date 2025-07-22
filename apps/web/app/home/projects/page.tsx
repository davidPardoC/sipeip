"use client"
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProjectWithRelations } from "@/types/domain/project.entity";
import { Program } from "@/types/domain/program.entity";
import { StrategicObjective } from "@/types/domain/strategic-objective.entity";
import { Typology } from "@/types/domain/typology.entity";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProjectFilesModal from "@/app/home/projects/components/project-files-modal";
import ProjectObservationsModal from "@/app/home/projects/components/project-observations-modal";
import ProjectCard from "@/app/home/projects/components/project-card";
import { ProjectStatusEnum } from "@/types/project.status.enum";
import { useSession } from "next-auth/react";

const ProjectsPage = () => {
  const searchParams = useSearchParams();
  const programId = searchParams.get("programId");
  const {data: session} = useSession();
  const [projects, setProjects] = useState<ProjectWithRelations[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [strategicObjectives, setStrategicObjectives] = useState<
    StrategicObjective[]
  >([]);
  const [typologies, setTypologies] = useState<Typology[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatusProjectId, setUpdatingStatusProjectId] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isFilesDialogOpen, setIsFilesDialogOpen] = useState(false);
  const [isObservationsDialogOpen, setIsObservationsDialogOpen] =
    useState(false);
  const [selectedProject, setSelectedProject] =
    useState<ProjectWithRelations | null>(null);
  const [selectedProjectForObservations, setSelectedProjectForObservations] =
    useState<ProjectWithRelations | null>(null);
  const [editingProject, setEditingProject] =
    useState<ProjectWithRelations | null>(null);
  const [formData, setFormData] = useState({
    code: "",
    cup: "",
    budget: "",
    startDate: "",
    endDate: "",
    status: "ACTIVE" as ProjectStatusEnum,
    programId: programId ? parseInt(programId) : 0,
    strategicObjectiveId: 0,
    typologyId: 0,
  });

  // Fetch projects
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const url = programId
        ? `/api/projects?programId=${programId}`
        : "/api/projects";
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Fetch projects
        const projectUrl = programId
          ? `/api/projects?programId=${programId}`
          : "/api/projects";
        const projectResponse = await fetch(projectUrl);
        if (projectResponse.ok) {
          const projectData = await projectResponse.json();
          setProjects(projectData);
        }

        // Fetch programs
        const programResponse = await fetch("/api/programs");
        if (programResponse.ok) {
          const programData = await programResponse.json();
          setPrograms(programData);
        }

        // Fetch strategic objectives
        const objectiveResponse = await fetch("/api/strategic-objectives");
        if (objectiveResponse.ok) {
          const objectiveData = await objectiveResponse.json();
          setStrategicObjectives(objectiveData);
        }

        // Fetch typologies
        const typologyResponse = await fetch("/api/typologies");
        if (typologyResponse.ok) {
          const typologyData = await typologyResponse.json();
          console.log("Typologies:", typologyData);
          setTypologies(typologyData);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [programId]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingProject
        ? `/api/projects/${editingProject.id}`
        : "/api/projects";

      const method = editingProject ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchProjects();
        setIsDialogOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        const response = await fetch(`/api/projects/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          await fetchProjects();
        }
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
  };

  // Handle status update
  const handleStatusUpdate = async (projectId: number, newStatus: ProjectStatusEnum) => {
    try {
      setUpdatingStatusProjectId(projectId); // Set loading state for this specific project
      
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        await fetchProjects(); // Refresh the projects list
        setSuccessMessage(`Project status updated successfully to ${formatStatusName(newStatus)}`);
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } else {
        console.error("Failed to update project status");
      }
    } catch (error) {
      console.error("Error updating project status:", error);
    } finally {
      setUpdatingStatusProjectId(null); // Clear loading state
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      code: "",
      cup: "",
      budget: "",
      startDate: "",
      endDate: "",
      status: ProjectStatusEnum.ACTIVE,
      programId: programId ? parseInt(programId) : 0,
      strategicObjectiveId: 0,
      typologyId: 0,
    });
    setEditingProject(null);
  };

  // Handle edit
  const handleEdit = (project: ProjectWithRelations) => {
    setEditingProject(project);
    setFormData({
      code: project.code,
      cup: project.cup,
      budget: project.budget,
      startDate: project.startDate,
      endDate: project.endDate,
      status: (project.status || "ACTIVE") as ProjectStatusEnum,
      programId: project.programId,
      strategicObjectiveId: project.strategicObjectiveId,
      typologyId: project.typologyId,
    });
    setIsDialogOpen(true);
  };

  // Handle new project
  const handleNew = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Number(value));
  };

  const formatStatusName = (status: string) => {
    return status
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Handle files modal
  const handleOpenFilesModal = (project: ProjectWithRelations) => {
    setSelectedProject(project);
    setIsFilesDialogOpen(true);
  };

  const handleCloseFilesModal = () => {
    setIsFilesDialogOpen(false);
    setSelectedProject(null);
  };

  const handleFilesUpdated = () => {
    // Callback cuando los archivos se actualizan
    // Podríamos refrescar los proyectos o mostrar una notificación
    console.log("Files updated for project:", selectedProject?.id);
  };

  // Handle observations modal
  const handleOpenObservationsModal = (project: ProjectWithRelations) => {
    setSelectedProjectForObservations(project);
    setIsObservationsDialogOpen(true);
  };

  const handleCloseObservationsModal = () => {
    setIsObservationsDialogOpen(false);
    setSelectedProjectForObservations(null);
  };

  const handleObservationsUpdated = () => {
    // Callback cuando las observaciones se actualizan
    // Podríamos refrescar los proyectos o mostrar una notificación
    console.log(
      "Observations updated for project:",
      selectedProjectForObservations?.id
    );
  };

  const currentProgram = programs.find(
    (p) => p.id === parseInt(programId || "0")
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        {programId && (
          <Link href="/home/program">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Programs
            </Button>
          </Link>
        )}
        <div className="flex-1">
          <h1 className="text-3xl font-bold">
            Projects
            {currentProgram && (
              <span className="text-lg font-normal text-gray-600 ml-2">
                - {currentProgram.name}
              </span>
            )}
          </h1>
        </div>
        <Button onClick={handleNew}>Add New Project</Button>
      </div>

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">No projects found</div>
          ) : (
            projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onOpenFilesModal={handleOpenFilesModal}
                onOpenObservationsModal={handleOpenObservationsModal}
                onStatusUpdate={handleStatusUpdate}
                formatCurrency={formatCurrency}
                isUpdatingStatus={updatingStatusProjectId === project.id}
                session={session}
              />
            ))
          )}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingProject ? "Edit Project" : "Add New Project"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="code">Code</Label>
                <Input
                  id="code"
                  type="text"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="cup">CUP</Label>
                <Input
                  id="cup"
                  type="text"
                  value={formData.cup}
                  onChange={(e) =>
                    setFormData({ ...formData, cup: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="budget">Budget</Label>
              <Input
                id="budget"
                type="number"
                step="0.01"
                value={formData.budget}
                onChange={(e) =>
                  setFormData({ ...formData, budget: e.target.value })
                }
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: string) =>
                  setFormData({
                    ...formData,
                    status: value as ProjectStatusEnum,
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="SEND_FOR_APPROVAL">Send for Approval</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  <SelectItem value="ON_HOLD">On Hold</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                </SelectContent>
              </Select>
            </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="programId">Program</Label>
                <Select
                  value={formData.programId.toString()}
                  onValueChange={(value: string) =>
                    setFormData({
                      ...formData,
                      programId: parseInt(value),
                    })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select program" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Select program</SelectItem>
                    {programs.map((program) => (
                      <SelectItem key={program.id} value={program.id.toString()}>
                        {program.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="strategicObjectiveId">
                  Strategic Objective
                </Label>
                <Select
                  value={formData.strategicObjectiveId.toString()}
                  onValueChange={(value: string) =>
                    setFormData({
                      ...formData,
                      strategicObjectiveId: parseInt(value),
                    })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select strategic objective" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Select strategic objective</SelectItem>
                    {strategicObjectives.map((objective) => (
                      <SelectItem key={objective.id} value={objective.id.toString()}>
                        {objective.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="typologyId">Typology</Label>
                <Select
                  value={formData.typologyId.toString()}
                  onValueChange={(value: string) =>
                    setFormData({
                      ...formData,
                      typologyId: parseInt(value),
                    })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select typology" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Select typology</SelectItem>
                    {typologies.map((typology) => (
                      <SelectItem key={typology.id} value={typology.id.toString()}>
                        {typology.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingProject ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Files Modal */}
      <ProjectFilesModal
        isOpen={isFilesDialogOpen}
        onClose={handleCloseFilesModal}
        project={selectedProject}
        onFilesUpdated={handleFilesUpdated}
      />

      {/* Observations Modal */}
      <ProjectObservationsModal
        isOpen={isObservationsDialogOpen}
        onClose={handleCloseObservationsModal}
        project={selectedProjectForObservations}
        onObservationsUpdated={handleObservationsUpdated}
      />
    </div>
  );
};

export default ProjectsPage;
