export class Sector {
  id: number;
  name: string;
  code: string;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt?: string | null;
  macroSectorId: number;

  constructor(
    id: number,
    name: string,
    code: string,
    createdAt: string | null,
    updatedAt: string | null,
    macroSectorId: number,
    deletedAt?: string | null
  ) {
    this.id = id;
    this.name = name;
    this.code = code;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.macroSectorId = macroSectorId;
    this.deletedAt = deletedAt;
  }
}
