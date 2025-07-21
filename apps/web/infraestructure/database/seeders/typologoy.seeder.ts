import { db } from "../connection.ts";
import { typology } from "../schemas/index.ts";

const data = [
  {
    name: "Infraestructura",
    code: "INF",
    description:
      "Construcción o mejoramiento de activos físicos (vías, puentes, edificaciones, redes, equipamiento).",
  },
  {
    name: "Servicios",
    code: "SRV",
    description:
      "Contratación de servicios profesionales o tecnológicos (consultorías, software, mantenimiento, etc.).",
  },
  {
    name: "Social",
    code: "SOC",
    description:
      "Intervenciones con impacto directo en la calidad de vida: salud, educación, inclusión, cultura.",
  },
  {
    name: "Público-Privado",
    code: "PP",
    description:
      "Iniciativas bajo esquemas de Asociación Público-Privada (APP) u otras modalidades de co-financiamiento.",
  },
  {
    name: "Emergencia",
    code: "EMG",
    description:
      "Proyectos de respuesta y reconstrucción ante desastres naturales o situaciones declaradas de emergencia.",
  },
  {
    name: "Seguridad Nacional",
    code: "SEC",
    description:
      "Proyectos destinados a la defensa y seguridad nacional (equipamiento, infraestructura estratégica, ciber-seguridad).",
  },
];

export const seedTypologies = async () => {
  console.log("Seeding typologies...");

  const mappedData = data.map((data) => ({
    ...data,
    createdBy: "system",
    updatedBy: "system",
  }));

  await db
    .insert(typology)
    .values(mappedData)
    .onConflictDoUpdate({
      target: typology.code,
      set: {
        name: typology.name,
        description: typology.description,
      },
    })
    .returning();
};
