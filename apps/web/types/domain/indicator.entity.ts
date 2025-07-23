export interface Indicator {
  id: number;
  ownerType: string;
  ownerId: number;
  name: string;
  unit: string;
  formula: string;
  baseline: string;
  status: "ACTIVE" | "INACTIVE" | "ARCHIVED" | null;
  // Audit fields
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
}

export interface CreateIndicatorData {
  ownerType: string;
  ownerId: number;
  name: string;
  unit: string;
  formula: string;
  baseline: string;
  status?: "ACTIVE" | "INACTIVE" | "ARCHIVED";
  createdBy?: string;
}

export interface UpdateIndicatorData {
  name?: string;
  unit?: string;
  formula?: string;
  baseline?: string;
  status?: "ACTIVE" | "INACTIVE" | "ARCHIVED";
  updatedBy?: string;
}
