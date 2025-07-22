export interface Typology {
  id: number;
  code: string;
  name: string;
  description: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
}
