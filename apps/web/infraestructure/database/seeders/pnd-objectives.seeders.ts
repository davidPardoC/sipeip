import { db } from "../connection.ts";
import { pndObjective } from "../schemas";

const pndObjectivesData = [
  {
    code: "1",
    name: "Mejorar las condiciones de vida de la población",
    description:
      "Mejorar las condiciones de vida de la población de forma integral, promoviendo el acceso equitativo a salud, vivienda y bienestar social.",
  },
  {
    code: "2",
    name: "Impulsar las capacidades de la ciudadanía",
    description:
      "Impulsar las capacidades de la ciudadanía con educación equitativa e inclusiva de calidad y promoviendo espacios de intercambio cultural.",
  },
  {
    code: "3",
    name: "Garantizar la seguridad integral y la paz ciudadana",
    description:
      "Garantizar la seguridad integral, la paz ciudadana y transformar el sistema de justicia respetando los derechos humanos.",
  },
  {
    code: "4",
    name: "Estimular el sistema económico y de finanzas públicas",
    description:
      "Estimular el sistema económico y de finanzas públicas para dinamizar la inversión y las relaciones comerciales.",
  },
  {
    code: "5",
    name: "Fomentar la producción de manera sustentable",
    description:
      "Fomentar de manera sustentable la producción mejorando los niveles de productividad.",
  },
  {
    code: "6",
    name: "Incentivar la generación de empleo digno",
    description: "Incentivar la generación de empleo digno.",
  },
  {
    code: "7",
    name: "Precautelar el uso responsable de los recursos naturales",
    description:
      "Precautelar el uso responsable de los recursos naturales con un entorno ambientalmente sostenible.",
  },
  {
    code: "8",
    name: "Impulsar la conectividad como fuente de desarrollo",
    description:
      "Impulsar la conectividad como fuente de desarrollo y crecimiento económico y sostenible.",
  },
  {
    code: "9",
    name: "Promover un Estado eficiente y transparente",
    description:
      "Proponer la construcción de un Estado eficiente, transparente y orientado al bienestar social.",
  },
  {
    code: "10",
    name: "Promover la resiliencia frente a riesgos",
    description:
      "Promover la resiliencia de ciudades y comunidades para enfrentar los riesgos de origen natural y antrópico.",
  },
];

export const seedPndObjectives = async () => {
  console.log("Seeding PND objectives...");

  const mappedData = pndObjectivesData.map((obj) => ({
    ...obj,
    createdBy: "system", // Assuming system user for seeding
    updatedBy: "system",
  }));

  await db
    .insert(pndObjective)
    .values(mappedData)
    .onConflictDoUpdate({
      target: pndObjective.code,
      set: {
        name: pndObjective.name,
        description: pndObjective.description,
        createdBy: pndObjective.createdBy,
        updatedBy: pndObjective.updatedBy,
      },
    })
    .returning();
};
