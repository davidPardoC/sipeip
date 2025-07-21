export interface Program {
  id: number;
  name: string;
  budget: string;
  startDate: string;
  endDate: string;
  status: "ACTIVE" | "INACTIVE" | "ARCHIVED" | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
}
