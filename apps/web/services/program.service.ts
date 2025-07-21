import { publishLogEvent } from "@/infraestructure/kafka/kafka.publisher";
import { ProgramRepository } from "@/repositories/program.repository";
import { Program } from "@/types/domain/program.entity";
import { LOG_EVENTS } from "@/types/event.types";
import { BaseService } from "./base.service";

export class ProgramService extends BaseService {
  private logEvents = LOG_EVENTS.PROGRAMS;

  constructor(private readonly programRepository: ProgramRepository) {
    super();
  }

  async create(program: Partial<Program>): Promise<Program[]> {
    const newProgram = await this.programRepository.create({
      ...program,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    publishLogEvent({
      event: this.logEvents.CREATE,
      resourceId: newProgram[0].id,
    });

    this.emitLogEvent({
      event: this.logEvents.CREATE,
      after: newProgram[0],
      resourceId: newProgram[0].id,
      message: `Program ${newProgram[0].name} created successfully.`,
    });

    return newProgram;
  }

  getAll(): Promise<Program[]> {
    return this.programRepository.getAll();
  }

  getById(id: number): Promise<Program | undefined> {
    return this.programRepository.getById(id);
  }

  async update(id: number, data: Partial<Program>): Promise<Program[]> {
    const previousProgram = await this.programRepository.getById(id);

    if (!previousProgram) {
      throw new Error(`Program with id ${id} not found`);
    }

    const updatedProgram = await this.programRepository.update(id, {
      ...data,
      updatedAt: new Date().toISOString(),
    });

    publishLogEvent({
      event: this.logEvents.UPDATE,
      resourceId: updatedProgram[0].id,
    });

    this.emitLogEvent({
      event: this.logEvents.UPDATE,
      before: previousProgram,
      after: updatedProgram[0],
      resourceId: updatedProgram[0].id,
      message: `Program ${updatedProgram[0].name} updated successfully.`,
    });

    return updatedProgram;
  }

  async delete(id: number) {
    const deleted = await this.programRepository.delete(id);
    
    if (deleted) {
      publishLogEvent({
        event: this.logEvents.DELETE,
        resourceId: id,
      });

      this.emitLogEvent({
        event: this.logEvents.DELETE,
        resourceId: id,
        message: `Program with id ${id} deleted successfully.`,
      });
    }
    
    return deleted;
  }
}
