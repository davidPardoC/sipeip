export class PndObjective {
  id: number;
  code: string;
  name: string;
  description: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;

  constructor(
    id: number,
    code: string,
    name: string,
    description: string,
    createdBy?: string | null,
    updatedBy?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    deletedAt?: string | null
  ) {
    this.id = id;
    this.code = code;
    this.name = name;
    this.description = description;
    this.createdBy = createdBy;
    this.updatedBy = updatedBy;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }
}
