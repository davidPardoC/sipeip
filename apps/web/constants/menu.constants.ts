import { ROLES } from "./role.constants";
import { Session } from "next-auth";

export const MenuConfig = {
  sections: [
    {
      title: "SIPEiP",
      allowedRoles: [],
      subSections: [
        {
          title: "Planes",
          url: "/home/planes",
          allowedRoles: [
            ROLES.SYS_ADMIN,
            ROLES.PLANIFICATION_TECHNICIAN,
            ROLES.INSTITUTIONAL_REVIEWER,
          ],
        },
        {
          title: "Programas",
          url: "/home/program",
          allowedRoles: [ROLES.SYS_ADMIN, ROLES.PLANIFICATION_TECHNICIAN],
        },

        {
          title: "Reportes",
          url: "/home/reports",
          allowedRoles: [ROLES.SYS_ADMIN, ROLES.PLANIFICATION_TECHNICIAN],
        },
      ],
    },
    {
      allowedRoles: [ROLES.SYS_ADMIN],
      title: "Configuracion",
      subSections: [
        {
          title: "Macro Sectores",
          url: "/home/sectores/macro",
          allowedRoles: [ROLES.SYS_ADMIN],
        },
        {
          title: "Sectores",
          url: "/home/sectores",
          allowedRoles: [ROLES.SYS_ADMIN],
        },
        {
          title: "Sub Sectores",
          url: "/home/sectores/micro",
          allowedRoles: [ROLES.SYS_ADMIN],
        },
        {
          title: "Entidades",
          url: "/home/entidades",
          allowedRoles: [ROLES.SYS_ADMIN],
        },
        {
          title: "ODS",
          url: "/home/ods",
          allowedRoles: [ROLES.SYS_ADMIN],
        },
      ],
    },
  ],
};

export const getFirstAllowedRoute = (session: Session | null) => {
  if (!session) return "/login";

  const userRoles = session?.roles || [];

  for (const section of MenuConfig.sections) {
    for (const subSection of section.subSections) {
      if (subSection.allowedRoles.some((role) => userRoles.includes(role))) {
        return subSection.url;
      }
    }
  }
};
