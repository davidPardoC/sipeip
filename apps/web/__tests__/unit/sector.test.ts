import { MacroSectorRepository } from "@/repositories";
import { MacroSectorService } from "@/services/macro-sector.service";

jest.mock("@/auth", () => jest.fn());
jest.mock(
  "@/infraestructure/kafka/kafka.publisher",
  jest.fn(() => ({
    publishLogEvent: jest.fn(),
  }))
);
describe("Sector Tests", () => {
  it("should have a valid test suite", () => {
    const mockMacroSectorRepository = {};
    const sectormanager = new MacroSectorService(
      mockMacroSectorRepository as unknown as MacroSectorRepository
    );
    expect(sectormanager).toBeDefined();
  });
});
