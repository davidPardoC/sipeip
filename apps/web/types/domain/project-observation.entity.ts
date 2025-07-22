export interface ProjectObservation {
  id: number;
  observation: string;
  projectId: number;
  createdBy: string;
  updatedBy?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
}

export interface ProjectObservationCreate {
  observation: string;
  projectId: number;
  createdBy: string;
}

export interface ProjectObservationUpdate {
  observation?: string;
  updatedBy?: string;
}

export interface ProjectObservationWithRelations extends ProjectObservation {
  user: {
    userName: string;
    keycloakId: string;
  } | null;
}
