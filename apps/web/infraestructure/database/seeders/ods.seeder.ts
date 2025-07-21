import { db } from "../connection.ts";
import { odsGoal } from "../schemas/index.ts";

const odsGoalsData = [
  {
    code: "1",
    name: "Fin de la pobreza",
    description:
      "Erradicar la pobreza en todas sus formas y dimensiones, incluida la pobreza extrema.",
  },
  {
    code: "2",
    name: "Hambre cero",
    description:
      "Poner fin al hambre, lograr la seguridad alimentaria, mejorar la nutrición y promover una agricultura sostenible.",
  },
  {
    code: "3",
    name: "Salud y bienestar",
    description:
      "Garantizar una vida sana y promover el bienestar para todos en todas las edades.",
  },
  {
    code: "4",
    name: "Educación de calidad",
    description:
      "Garantizar una educación inclusiva, equitativa y de calidad, y promover oportunidades de aprendizaje permanente para todos.",
  },
  {
    code: "5",
    name: "Igualdad de género",
    description:
      "Lograr la igualdad de género y empoderar a todas las mujeres y niñas.",
  },
  {
    code: "6",
    name: "Agua limpia y saneamiento",
    description:
      "Garantizar la disponibilidad y la gestión sostenible del agua y el saneamiento para todos.",
  },
  {
    code: "7",
    name: "Energía asequible y no contaminante",
    description:
      "Garantizar el acceso a una energía asequible, segura, sostenible y moderna para todos.",
  },
  {
    code: "8",
    name: "Trabajo decente y crecimiento económico",
    description:
      "Promover el crecimiento económico sostenido, inclusivo y sostenible, el empleo pleno y productivo, y el trabajo decente para todos.",
  },
  {
    code: "9",
    name: "Industria, innovación e infraestructura",
    description:
      "Construir infraestructuras resilientes, promover la industrialización inclusiva y sostenible, y fomentar la innovación.",
  },
  {
    code: "10",
    name: "Reducción de las desigualdades",
    description: "Reducir la desigualdad en y entre los países.",
  },
  {
    code: "11",
    name: "Ciudades y comunidades sostenibles",
    description:
      "Lograr que las ciudades y los asentamientos humanos sean inclusivos, seguros, resilientes y sostenibles.",
  },
  {
    code: "12",
    name: "Producción y consumo responsables",
    description: "Garantizar modalidades de consumo y producción sostenibles.",
  },
  {
    code: "13",
    name: "Acción por el clima",
    description:
      "Adoptar medidas urgentes para combatir el cambio climático y sus efectos.",
  },
  {
    code: "14",
    name: "Vida submarina",
    description:
      "Conservar y utilizar sosteniblemente los océanos, los mares y los recursos marinos para el desarrollo sostenible.",
  },
  {
    code: "15",
    name: "Vida de ecosistemas terrestres",
    description:
      "Gestionar sosteniblemente los bosques, luchar contra la desertificación, detener e invertir la degradación de la tierra y detener la pérdida de biodiversidad.",
  },
  {
    code: "16",
    name: "Paz, justicia e instituciones sólidas",
    description:
      "Promover sociedades pacíficas e inclusivas para el desarrollo sostenible, facilitar el acceso a la justicia para todos y construir instituciones eficaces, responsables e inclusivas.",
  },
  {
    code: "17",
    name: "Alianzas para lograr los objetivos",
    description:
      "Fortalecer los medios de implementación y revitalizar la Alianza Mundial para el Desarrollo Sostenible.",
  },
];

export const seedOds = async () => {
  console.log("Seeding ODS...");

  const mappedData = odsGoalsData.map((goal) => ({
    ...goal,
    createdBy: "system",
    updatedBy: "system",
  }));

  await db
    .insert(odsGoal)
    .values(mappedData)
    .onConflictDoUpdate({
      target: odsGoal.code,
      set: {
        name: odsGoal.name,
        description: odsGoal.description,
        updatedBy: odsGoal.updatedBy,
        updatedAt: odsGoal.updatedAt,
        deletedAt: odsGoal.deletedAt, // Assuming you want to keep this field updated as well
        createdBy: odsGoal.createdBy, // Keep createdBy unchanged
        createdAt: odsGoal.createdAt, // Keep createdAt unchanged
      },
    })
    .returning();
};
