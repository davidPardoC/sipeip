// Junction table entity types for activity-objective many-to-many relationship

export interface ActivityObjective {
  id: number;
  activityId: number;
  strategicObjectiveId: number;
  createdBy?: string | null;
  createdAt?: string | null;
}

export interface ActivityObjectiveCreate {
  activityId: number;
  strategicObjectiveId: number;
  createdBy?: string;
}

export interface ActivityObjectiveWithDetails extends ActivityObjective {
  strategicObjective?: {
    id: number;
    code: string;
    name: string;
    description: string;
    fulfillmentRule?: "AND" | "OR";
    fulfillmentStatus?: "CUMPLIDO" | "EN_PROGRESO" | "NO_CUMPLIDO";
  };
}
