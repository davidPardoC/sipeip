/**
 * @jest-environment node
 */
import { createMacroSector } from "@/app/home/sectores/actions";
import { MacroSectorRepository } from "@/repositories";
import { MacroSectorService } from "@/services/macro-sector.service";

jest.mock("@/repositories/", () => ({
  macroSectorRepo: {
    create: jest.fn(() => [
      { id: 1, name: "Test Macro Sector", code: "TEST-MACRO" },
    ]),
    getAll: jest.fn(),
    getById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

describe("Sector Tests", () => {
  it("should have a valid test suite", async () => {
    const mockMacroSectorRepository = {
      create: jest.fn(),
      getAll: jest.fn(),
      getById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    const sectormanager = new MacroSectorService(
      mockMacroSectorRepository as unknown as MacroSectorRepository
    );
    await sectormanager.getAll();

    expect(mockMacroSectorRepository.getAll).toHaveBeenCalled();
  });

  it("Should create a macro sector", async () => {
    const data = new FormData();
    data.append("name", "Test Macro Sector");
    data.append("code", "TEST-MACRO");

    const response = await createMacroSector(data);
    expect(response.success).toBe(true);
    expect(response.data).toEqual([
      { id: 1, name: "Test Macro Sector", code: "TEST-MACRO" },
    ]);
  });
});
