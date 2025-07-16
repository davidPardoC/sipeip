import { PublicEntityRepository } from "@/repositories";

export class PublicEntityService {
  constructor(
    private readonly publicEntityRepository: PublicEntityRepository
  ) {}
}
