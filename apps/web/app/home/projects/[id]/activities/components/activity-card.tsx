import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, User, Calendar, DollarSign, TrendingUp } from "lucide-react";
import { Activity } from "@/types/domain/activity.entity";
import { Session } from "next-auth";
import RBACComponent from "@/components/rbac";
import { ROLES } from "@/constants/role.constants";

interface ActivityCardProps {
  activity: Activity;
  onEdit: (activity: Activity) => void;
  onDelete: (id: number) => void;
  formatCurrency: (value: string) => string;
  session: Session | null;
}

const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  onEdit,
  onDelete,
  formatCurrency,
  session,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PLANNED":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "COMPLETED":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "ON_HOLD":
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const formatStatusName = (status: string) => {
    return status
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return "bg-green-500";
    if (progress >= 75) return "bg-green-400";
    if (progress >= 50) return "bg-yellow-400";
    if (progress >= 25) return "bg-orange-400";
    return "bg-red-400";
  };

  const progressPercent = parseFloat(activity.progressPercent);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
            {activity.name}
          </CardTitle>
          <Badge className={getStatusColor(activity.status)}>
            {formatStatusName(activity.status)}
          </Badge>
        </div>
        {activity.description && (
          <p className="text-sm text-gray-600 line-clamp-2 mt-2">
            {activity.description}
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">Responsible:</span>
            <span className="font-medium">{activity.responsiblePerson}</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">Progress:</span>
            <span className="font-medium">{progressPercent.toFixed(1)}%</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">Start:</span>
            <span className="font-medium">{formatDate(activity.startDate)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">End:</span>
            <span className="font-medium">{formatDate(activity.endDate)}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-sm">
          <DollarSign className="h-4 w-4 text-gray-500" />
          <span className="text-gray-600">Executed Budget:</span>
          <span className="font-medium">{formatCurrency(activity.executedBudget)}</span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-600">
            <span>Progress</span>
            <span>{progressPercent.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(progressPercent)}`}
              style={{ width: `${Math.min(progressPercent, 100)}%` }}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-2">
          <RBACComponent 
            roles={[ROLES.SYS_ADMIN, ROLES.PLANIFICATION_TECHNICIAN]} 
            session={session}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(activity)}
              className="flex items-center space-x-1"
            >
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(activity.id)}
              className="flex items-center space-x-1 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete</span>
            </Button>
          </RBACComponent>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityCard;
