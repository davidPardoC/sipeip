import { db } from "../connection.ts";
import { macroSector } from "../schemas/macro-sector.ts";
import { sector } from "../schemas/sector.ts";
import { microSector } from "../schemas/micro-sector.ts";

const macroSectorsData = [
  {
    code: "A",
    name: "SOCIAL",
    sectors: [
      {
        code: "A01",
        name: "Salud",
        subsectors: [
          { code: "A0101", name: "Administración Salud" },
          { code: "A0102", name: "Primer Nivel de Atención" },
          { code: "A0103", name: "Segundo Nivel de Atención" },
          { code: "A0104", name: "Tercer Nivel de Atención" },
          { code: "A0105", name: "Productos Farmacéuticos y Químicos" },
          { code: "A0121", name: "Intersubsectorial Salud" },
        ],
      },
      {
        code: "A03",
        name: "Cultura",
        subsectors: [
          { code: "A0301", name: "Administración Arte y Cultura" },
          { code: "A0302", name: "Arte y Cultura" },
          { code: "A0321", name: "Intersubsectorial Cultura" },
        ],
      },
      {
        code: "A06",
        name: "Equipamiento Urbano y Vivienda",
        subsectors: [
          {
            code: "A0601",
            name: "Administración Equipamiento Urbano y Vivienda",
          },
          { code: "A0602", name: "Agua Potable" },
          { code: "A0603", name: "Alcantarillado" },
          { code: "A0604", name: "Vivienda" },
          { code: "A0605", name: "Reasentamientos Humanos" },
          { code: "A0606", name: "Desechos Sólidos" },
          {
            code: "A0621",
            name: "Intersubsectorial Equipamiento Urbano y Vivienda",
          },
        ],
      },
      {
        code: "A07",
        name: "Protección Social y Familiar",
        subsectors: [
          {
            code: "A0701",
            name: "Administración Protección Social y Familiar",
          },
          { code: "A0702", name: "Atención a Víctimas" },
          { code: "A0703", name: "Atención Primera Infancia" },
          { code: "A0704", name: "Atención Adolescentes/Jóvenes" },
          { code: "A0705", name: "Atención Adultos Mayores" },
          { code: "A0706", name: "Atención Discapacitados" },
          { code: "A0707", name: "Equidad de Género" },
          { code: "A0708", name: "Inclusión Social" },
          { code: "A0709", name: "Desarrollo Rural" },
          {
            code: "A0721",
            name: "Intersubsectorial Protección Social y Familiar",
          },
        ],
      },
      {
        code: "A09",
        name: "Deporte",
        subsectors: [
          { code: "A0901", name: "Administración Deporte" },
          { code: "A0902", name: "Deporte Competitivo" },
          { code: "A0903", name: "Deporte Formativo" },
          { code: "A0904", name: "Deporte Recreativo" },
          { code: "A0921", name: "Intersubsectorial Deporte" },
        ],
      },
    ],
  },
  {
    code: "C",
    name: "FOMENTO A LA PRODUCCIÓN",
    sectors: [
      {
        code: "C15",
        name: "Agricultura, Ganadería y Pesca",
        subsectors: [
          {
            code: "C1501",
            name: "Administración Agricultura, Ganadería y Pesca",
          },
          { code: "C1502", name: "Agricultura, Agroindustria y Alimentos" },
          { code: "C1503", name: "Recuperación de Cultivos" },
          { code: "C1504", name: "Ganadería" },
          { code: "C1505", name: "Pesca" },
          { code: "C1506", name: "Riego" },
          {
            code: "C1521",
            name: "Intersubsectorial Agricultura, Ganadería y Pesca",
          },
        ],
      },
      {
        code: "C16",
        name: "Fomento a la Producción",
        subsectors: [
          { code: "C1601", name: "Administración Fomento a la Producción" },
          { code: "C1602", name: "Comercio" },
          { code: "C1603", name: "Financiamiento" },
          { code: "C1604", name: "Otras Industrias" },
          { code: "C1605", name: "Turismo" },
          { code: "C1606", name: "Confecciones y Calzado" },
          { code: "C1607", name: "Metalmecánica y Vehículos" },
          { code: "C1608", name: "Siderurgia" },
        ],
      },
      {
        code: "C13",
        name: "Vialidad y Transporte",
        subsectors: [
          { code: "C1301", name: "Administración Vialidad y Transporte" },
          { code: "C1302", name: "Terminales Marítimos y Puertos" },
          { code: "C1303", name: "Terminales Terrestres" },
          { code: "C1304", name: "Transporte Aéreo" },
          { code: "C1305", name: "Transporte Terrestre" },
          { code: "C1306", name: "Transporte Ferroviario" },
          { code: "C1307", name: "Transporte Marítimo, Fluvial y Lacustre" },
          {
            code: "C1308",
            name: "Vialidad Especial: Ciclovías, Senderos Peatonales, etc.",
          },
          { code: "C1321", name: "Intersubsectorial Vialidad y Transporte" },
        ],
      },
    ],
  },
  {
    code: "D",
    name: "MULTISECTORIAL",
    sectors: [
      {
        code: "D18",
        name: "Planificación y Regulación",
        subsectors: [
          { code: "D1801", name: "Administración Planificación y Regulación" },
        ],
      },
      {
        code: "D19",
        name: "Manejo Fiscal",
        subsectors: [{ code: "D1901", name: "Administración Fiscal" }],
      },
      {
        code: "D20",
        name: "Legislativo",
        subsectors: [{ code: "D2001", name: "Administración Legislativa" }],
      },
      {
        code: "D22",
        name: "Información",
        subsectors: [
          { code: "D2201", name: "Administración Información" },
          { code: "D2202", name: "Generación de Información" },
        ],
      },
    ],
  },
  {
    code: "F",
    name: "SEGURIDAD",
    sectors: [
      {
        code: "F21",
        name: "Asuntos del Exterior",
        subsectors: [
          { code: "F2101", name: "Administración Asuntos del Exterior" },
        ],
      },
      {
        code: "F04",
        name: "Seguridad",
        subsectors: [
          { code: "F0401", name: "Administración Seguridad" },
          { code: "F0402", name: "Rehabilitación" },
          { code: "F0403", name: "Seguridad" },
          { code: "F0421", name: "Intersubsectorial Seguridad" },
        ],
      },
      {
        code: "F05",
        name: "Justicia",
        subsectors: [
          { code: "F0501", name: "Administración Justicia" },
          { code: "F0502", name: "Asistencia Judicial" },
          { code: "F0521", name: "Intersubsectorial Justicia" },
        ],
      },
      {
        code: "F14",
        name: "Defensa",
        subsectors: [
          { code: "F1401", name: "Administración Defensa" },
          { code: "F1402", name: "Defensa" },
          { code: "F1421", name: "Intersubsectorial Defensa" },
        ],
      },
    ],
  },
  {
    code: "E",
    name: "TALENTO HUMANO",
    sectors: [
      {
        code: "E23",
        name: "Educación",
        subsectors: [
          { code: "E2301", name: "Administración Educación" },
          { code: "E2302", name: "Educación Prebásica" },
          { code: "E2303", name: "Educación Básica y Media" },
          { code: "E2304", name: "Educación Media Técnico" },
          { code: "E2305", name: "Educación Superior" },
          { code: "E2306", name: "Educación Diferencial y Especial" },
          { code: "E2307", name: "Educación para Adultos" },
          { code: "E2321", name: "Intersubsectorial Educación" },
        ],
      },
      {
        code: "E17",
        name: "Proyectos de Investigación y Becas",
        subsectors: [
          {
            code: "E1701",
            name: "Administración Proyectos de Investigación y Becas",
          },
          { code: "E1702", name: "Becas" },
          { code: "E1703", name: "Proyecto Investigación" },
          { code: "E1704", name: "Biotecnología" },
          {
            code: "E1705",
            name: "Desarrollo de Tecnología (Hardware y Software)",
          },
        ],
      },
    ],
  },
  {
    code: "B",
    name: "ENERGÍA",
    sectors: [
      {
        code: "B10",
        name: "Energía",
        subsectors: [
          { code: "B1001", name: "Administración Energía" },
          { code: "B1002", name: "Alumbrado Público" },
          { code: "B1003", name: "Distribución y Conexión Final Usuarios" },
          { code: "B1004", name: "Generación" },
          { code: "B1005", name: "Transmisión" },
          { code: "B1006", name: "Energías Renovables" },
          { code: "B1021", name: "Intersubsectorial Energía" },
        ],
      },
    ],
  },
  {
    code: "B",
    name: "MINERÍA E HIDROCARBUROS",
    sectors: [
      {
        code: "B11",
        name: "Minería e Hidrocarburos",
        subsectors: [
          { code: "B1101", name: "Administración Minería e Hidrocarburos" },
          { code: "B1102", name: "Hidrocarburos" },
          { code: "B1103", name: "Minería" },
          { code: "B1121", name: "Intersubsectorial Minería e Hidrocarburos" },
        ],
      },
    ],
  },
  {
    code: "B",
    name: "AMBIENTE",
    sectors: [
      {
        code: "B08",
        name: "Ambiente",
        subsectors: [
          { code: "B0801", name: "Administración Ambiente" },
          { code: "B0802", name: "Conservación y Manejo Ambiental" },
          {
            code: "B0803",
            name: "Prevención, Mitigación y Gestión del Riesgo",
          },
          {
            code: "B0804",
            name: "Cadena Forestal Sustentable y sus Productos Elaborados",
          },
          { code: "B0821", name: "Intersubsectorial Ambiente" },
        ],
      },
    ],
  },
  {
    code: "B",
    name: "TELECOMUNICACIONES",
    sectors: [
      {
        code: "B12",
        name: "Telecomunicaciones",
        subsectors: [
          { code: "B1201", name: "Administración Telecomunicaciones" },
          { code: "B1202", name: "Comunicaciones" },
          { code: "B1221", name: "Intersubsectorial Telecomunicaciones" },
        ],
      },
    ],
  },
];

export const seedAllSectors = async () => {
  try {
    // Insert each macro sector and its related sectors and subsectors
    for (const macroSectorData of macroSectorsData) {
      // Upsert macro sector
      const [insertedMacroSector] = await db
        .insert(macroSector)
        .values({
          code: macroSectorData.code,
          name: macroSectorData.name,
          createdBy: "system", // Assuming system user for seeding
          updatedBy: "system", // Assuming system user for seeding
        })
        .onConflictDoUpdate({
          target: macroSector.code,
          set: {
            name: macroSectorData.name,
            updatedAt: new Date().toISOString(),
          },
        })
        .returning({ id: macroSector.id });

      // Insert sectors for this macro sector
      for (const sectorData of macroSectorData.sectors) {
        const [insertedSector] = await db
          .insert(sector)
          .values({
            code: sectorData.code,
            name: sectorData.name,
            macroSectorId: insertedMacroSector.id,
            createdBy: "system", // Assuming system user for seeding
            updatedBy: "system",
          })
          .onConflictDoUpdate({
            target: sector.code,
            set: {
              name: sectorData.name,
              macroSectorId: insertedMacroSector.id,
              updatedAt: new Date().toISOString(),
            },
          })
          .returning({ id: sector.id });

        // Insert subsectors (micro sectors) for this sector
        for (const subsectorData of sectorData.subsectors) {
          await db
            .insert(microSector)
            .values({
              code: subsectorData.code,
              name: subsectorData.name,
              sectorId: insertedSector.id,
              createdBy: "system", // Assuming system user for seeding
              updatedBy: "system",
            })
            .onConflictDoUpdate({
              target: microSector.code,
              set: {
                name: subsectorData.name,
                sectorId: insertedSector.id,
                updatedAt: new Date().toISOString(),
              },
            });
        }
      }
    }

    console.log("All sectors seeded successfully!");
  } catch (error) {
    console.error("Error seeding sectors:", error);
    throw error;
  }
};
