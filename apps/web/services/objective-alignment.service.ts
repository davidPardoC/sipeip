import { ObjectiveAlignmentRepository } from "@/repositories/objective-alignment.repository";
import { ObjectiveAlignment } from "@/types/domain/objective-alignment.entity";

export class ObjectiveAlignmentService {
  private readonly repository: ObjectiveAlignmentRepository;

  constructor() {
    this.repository = new ObjectiveAlignmentRepository();
  }

  async createAlignment(
    strategicObjectiveId: number,
    pndObjectiveId: number,
    odsGoalId: number,
    weight: number,
    createdBy?: string
  ): Promise<ObjectiveAlignment> {
    // Validate weight is within range
    if (weight <= 0 || weight > 100) {
      throw new Error("El peso debe estar entre 0.1% y 100%");
    }

    return await this.repository.create(
      strategicObjectiveId,
      pndObjectiveId,
      odsGoalId,
      weight,
      createdBy
    );
  }

  async getAlignmentsByStrategicObjective(strategicObjectiveId: number): Promise<ObjectiveAlignment[]> {
    return await this.repository.findByStrategicObjectiveId(strategicObjectiveId);
  }

  async updateAlignment(
    id: number,
    data: {
      weight?: number;
      pndObjectiveId?: number;
      odsGoalId?: number;
    },
    updatedBy?: string
  ): Promise<ObjectiveAlignment | null> {
    if (data.weight !== undefined && (data.weight <= 0 || data.weight > 100)) {
      throw new Error("El peso debe estar entre 0.1% y 100%");
    }

    return await this.repository.update(id, data, updatedBy);
  }

  async deleteAlignment(id: number, deletedBy?: string): Promise<boolean> {
    return await this.repository.delete(id, deletedBy);
  }

  async bulkCreateAlignments(
    strategicObjectiveId: number,
    alignments: Array<{
      pndObjectiveId: number;
      odsGoalId: number;
      weight: number;
    }>,
    createdBy?: string
  ): Promise<ObjectiveAlignment[]> {
    // Validate total weight equals 100%
    const totalWeight = alignments.reduce((sum, alignment) => sum + alignment.weight, 0);
    if (Math.abs(totalWeight - 100) > 0.01) {
      throw new Error("La suma total de los pesos debe ser exactamente 100%");
    }

    // Validate each weight
    for (const alignment of alignments) {
      if (alignment.weight <= 0 || alignment.weight > 100) {
        throw new Error("Cada peso debe estar entre 0.1% y 100%");
      }
    }

    // Check for duplicate combinations
    const combinations = new Set();
    for (const alignment of alignments) {
      const key = `${alignment.pndObjectiveId}-${alignment.odsGoalId}`;
      if (combinations.has(key)) {
        throw new Error("No se permiten combinaciones duplicadas de PND-ODS");
      }
      combinations.add(key);
    }

    // Delete existing alignments for this strategic objective
    await this.repository.deleteByStrategicObjectiveId(strategicObjectiveId, createdBy);

    // Create new alignments
    return await this.repository.bulkCreate(
      strategicObjectiveId,
      alignments,
      createdBy
    );
  }

  async getAlignmentById(id: number): Promise<ObjectiveAlignment | null> {
    return await this.repository.findById(id);
  }
}
