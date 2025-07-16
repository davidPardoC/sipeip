export class PublicEntity {
  id: number;
  name: string;
  shortName: string;
  code: string;
  status: string;
  microSectorId: number;
  createdBy: string | null;
  updatedBy: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt?: string | null;

  constructor(
    id: number,
    name: string,
    shortName: string,
    code: string,
    status: string,
    microSectorId: number,
    createdBy: string | null,
    updatedBy: string | null,
    createdAt: string | null,
    updatedAt: string | null,
    deletedAt?: string | null
  ) {
    this.id = id;
    this.name = name;
    this.shortName = shortName;
    this.code = code;
    this.status = status;
    this.microSectorId = microSectorId;
    this.createdBy = createdBy;
    this.updatedBy = updatedBy;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }
}
