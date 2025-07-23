export class ObjectiveAlignment {
  id: number;
  weight: string; // decimal as string
  strategicObjectiveId: number;
  pndObjectiveId: number;
  odsGoalId: number;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;

  constructor(
    id: number,
    weight: string,
    strategicObjectiveId: number,
    pndObjectiveId: number,
    odsGoalId: number,
    createdBy?: string | null,
    updatedBy?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    deletedAt?: string | null
  ) {
    this.id = id;
    this.weight = weight;
    this.strategicObjectiveId = strategicObjectiveId;
    this.pndObjectiveId = pndObjectiveId;
    this.odsGoalId = odsGoalId;
    this.createdBy = createdBy;
    this.updatedBy = updatedBy;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }
}
