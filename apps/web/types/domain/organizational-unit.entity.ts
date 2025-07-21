export class OrganizationalUnit {
  id: number;
  code: string;
  name: string;
  level: number;
  status: "ACTIVE" | "INACTIVE" | "ARCHIVED" | null;
  parentId: number;
  publicEntityId: number;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt?: string | null;

  constructor(
    id: number,
    code: string,
    name: string,
    level: number,
    status: "ACTIVE" | "INACTIVE" | "ARCHIVED" | null,
    parentId: number,
    publicEntityId: number,
    createdAt: string | null,
    updatedAt: string | null,
    createdBy?: string | null,
    updatedBy?: string | null,
    deletedAt?: string | null
  ) {
    this.id = id;
    this.code = code;
    this.name = name;
    this.level = level;
    this.status = status;
    this.parentId = parentId;
    this.publicEntityId = publicEntityId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.createdBy = createdBy;
    this.updatedBy = updatedBy;
    this.deletedAt = deletedAt;
  }
}
