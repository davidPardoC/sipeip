export class MacroSector {
  id: number;
  name: string;
  code: string;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt?: string | null;

  constructor(
    id: number,
    name: string,
    code: string,
    createdAt: string | null,
    updatedAt: string | null,
    deletedAt?: string | null
  ) {
    this.id = id;
    this.name = name;
    this.code = code;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }
}
