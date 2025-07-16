export class MicroSector {
  id: number;
  name: string;
  code: string;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt?: string | null;
  sectorId: number;

  constructor(
    id: number,
    name: string,
    code: string,
    createdAt: string | null,
    updatedAt: string | null,
    sectorId: number,
    deletedAt?: string | null
  ) {
    this.id = id;
    this.name = name;
    this.code = code;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.sectorId = sectorId;
    this.deletedAt = deletedAt;
  }
}
