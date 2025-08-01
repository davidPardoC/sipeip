export class PublicEntity {
  id: number;
  code: string;
  name: string;
  shortName: string;
  govermentLevel: string;
  status: "ACTIVE" | "INACTIVE" | "ARCHIVED" | null;
  subSectorId: number;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt?: string | null;

  constructor(
    id: number,
    code: string,
    name: string,
    shortName: string,
    govermentLevel: string,
    status: "ACTIVE" | "INACTIVE" | "ARCHIVED" | null,
    subSectorId: number,
    createdAt: string | null,
    updatedAt: string | null,
    createdBy?: string | null,
    updatedBy?: string | null,
    deletedAt?: string | null
  ) {
    this.id = id;
    this.code = code;
    this.name = name;
    this.shortName = shortName;
    this.govermentLevel = govermentLevel;
    this.status = status;
    this.subSectorId = subSectorId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.createdBy = createdBy;
    this.updatedBy = updatedBy;
    this.deletedAt = deletedAt;
  }
}
