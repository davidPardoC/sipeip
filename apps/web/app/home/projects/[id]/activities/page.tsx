"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, ArrowLeft } from "lucide-react";
import { Activity } from "@/types/domain/activity.entity";
import { Project } from "@/types/domain/project.entity";
import ActivityCard from "./components/activity-card";
import ActivityForm from "./components/activity-form";
import { useRouter } from "next/navigation";
import RBACComponent from "@/components/rbac";
import { ROLES } from "@/constants/role.constants";

const ProjectActivitiesPage = () => {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const projectId = parseInt(params.id as string);

  const [activities, setActivities] = useState<Activity[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch activities
  const fetchActivities = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/activities?projectId=${projectId}`);
      if (response.ok) {
        const activitiesData = await response.json();
        setActivities(activitiesData);
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      const fetchData = async () => {
        try {
          // Fetch project details
          const projectResponse = await fetch(`/api/projects/${projectId}`);
          if (projectResponse.ok) {
            const projectData = await projectResponse.json();
            setProject(projectData);
          }

          // Fetch activities
          setIsLoading(true);
          const activitiesResponse = await fetch(`/api/activities?projectId=${projectId}`);
          if (activitiesResponse.ok) {
            const activitiesData = await activitiesResponse.json();
            setActivities(activitiesData);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [projectId]);

  // Filter activities based on search term
  const filteredActivities = activities.filter(
    (activity) =>
      activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.responsiblePerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (activity.description && activity.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Handle save (create/update)
  const handleSave = async (activityData: Partial<Activity>) => {
    try {
      let response;
      
      if (editingActivity) {
        // Update existing activity
        response = await fetch(`/api/activities/${editingActivity.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(activityData),
        });
      } else {
        // Create new activity
        response = await fetch("/api/activities", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...activityData,
            projectId,
          }),
        });
      }

      if (response.ok) {
        await fetchActivities();
        setIsDialogOpen(false);
        setEditingActivity(null);
        setSuccessMessage(
          editingActivity 
            ? "Activity updated successfully!" 
            : "Activity created successfully!"
        );
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      }
    } catch (error) {
      console.error("Error saving activity:", error);
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this activity?")) {
      try {
        const response = await fetch(`/api/activities/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          await fetchActivities();
          setSuccessMessage("Activity deleted successfully!");
          
          // Clear success message after 3 seconds
          setTimeout(() => {
            setSuccessMessage(null);
          }, 3000);
        }
      } catch (error) {
        console.error("Error deleting activity:", error);
      }
    }
  };

  // Handle edit
  const handleEdit = (activity: Activity) => {
    setEditingActivity(activity);
    setIsDialogOpen(true);
  };

  // Handle new activity
  const handleNew = () => {
    setEditingActivity(null);
    setIsDialogOpen(true);
  };

  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Number(value));
  };

  const getStatusStats = () => {
    const stats = {
      total: activities.length,
      planned: activities.filter(a => a.status === "PLANNED").length,
      inProgress: activities.filter(a => a.status === "IN_PROGRESS").length,
      completed: activities.filter(a => a.status === "COMPLETED").length,
      cancelled: activities.filter(a => a.status === "CANCELLED").length,
      onHold: activities.filter(a => a.status === "ON_HOLD").length,
    };
    return stats;
  };

  const stats = getStatusStats();

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Button
            variant="outline"
            onClick={() => router.push("/home/projects")}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Projects</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Project Activities</h1>
            {project && (
              <p className="text-lg text-gray-600 mt-1">
                {project.code} - Activities Management
              </p>
            )}
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-blue-500">Total</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-gray-600">{stats.planned}</div>
            <div className="text-sm text-gray-500">Planned</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div>
            <div className="text-sm text-yellow-500">In Progress</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-sm text-green-500">Completed</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
            <div className="text-sm text-red-500">Cancelled</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.onHold}</div>
            <div className="text-sm text-purple-500">On Hold</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <RBACComponent roles={[ROLES.SYS_ADMIN, ROLES.PLANIFICATION_TECHNICIAN]} session={session}>
            <Button onClick={handleNew} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>New Activity</span>
            </Button>
          </RBACComponent>
        </div>
      </div>

      {/* Activities Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-500">Loading activities...</div>
        </div>
      ) : filteredActivities.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">
            {searchTerm ? "No activities found matching your search." : "No activities found for this project."}
          </div>
          <RBACComponent roles={[ROLES.SYS_ADMIN, ROLES.PLANIFICATION_TECHNICIAN]} session={session}>
            <Button onClick={handleNew} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Create First Activity</span>
            </Button>
          </RBACComponent>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onEdit={handleEdit}
              onDelete={handleDelete}
              formatCurrency={formatCurrency}
              session={session}
            />
          ))}
        </div>
      )}

      {/* Activity Form Dialog */}
      <ActivityForm
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingActivity(null);
        }}
        onSave={handleSave}
        activity={editingActivity}
        projectId={projectId}
      />
    </div>
  );
};

export default ProjectActivitiesPage;