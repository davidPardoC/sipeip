import {
  Building2,
  Calendar,
  ChartSpline,
  FolderKanban,
  Goal,
  LayoutDashboard,
  Notebook,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ChevronDown, SquareMousePointer } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { ROLES } from "@/constants/role.constants";
import { Session } from "next-auth";

function checkRoles(roles: string[], session: Session | null): boolean {
  if (!roles || roles.length === 0) {
    return true;
  }
  return !!session?.roles?.some((role: string) => roles.includes(role));
}

const MenuConfig = {
  sections: [
    {
      title: "SIPEiP",
      subSections: [
        {
          title: "Inicio",
          url: "/home",
          icon: <LayoutDashboard />,
          allowedRoles: [ROLES.SYS_ADMIN, ROLES.PLANIFICATION_TECHNICIAN],
        },
        {
          title: "Indicadores",
          url: "/home/indicadores",
          icon: <ChartSpline />,
          allowedRoles: [ROLES.SYS_ADMIN, ROLES.PLANIFICATION_TECHNICIAN],
        },
        {
          title: "Planes",
          url: "/home/planes",
          icon: <Calendar />,
          allowedRoles: [ROLES.SYS_ADMIN, ROLES.PLANIFICATION_TECHNICIAN],
        },
        {
          title: "Proyectos",
          url: "/home/proyectos",
          icon: <FolderKanban />,
          allowedRoles: [ROLES.SYS_ADMIN, ROLES.PLANIFICATION_TECHNICIAN],
        },
        {
          title: "Programas",
          url: "/home/program",
          icon: <Notebook />,
          allowedRoles: [ROLES.SYS_ADMIN, ROLES.PLANIFICATION_TECHNICIAN],
        },
        {
          title: "Objetivos",
          url: "/home/objetivos",
          icon: <Goal />,
          allowedRoles: [ROLES.SYS_ADMIN, ROLES.PLANIFICATION_TECHNICIAN],
        },
        {
          title: "Reportes",
          url: "/home/reports",
          icon: <Building2 />,
          allowedRoles: [ROLES.SYS_ADMIN, ROLES.PLANIFICATION_TECHNICIAN],
        },
      ],
    },
    {
      allowedRoles: [ROLES.SYS_ADMIN],
      title: "Sectores",
      subSections: [
        {
          title: "Macro Sectores",
          url: "/home/sectores/macro",
          icon: <SquareMousePointer />,
          allowedRoles: [ROLES.SYS_ADMIN, ROLES.PLANIFICATION_TECHNICIAN],
        },
        {
          title: "Sectores",
          url: "/home/sectores",
          icon: <SquareMousePointer />,
          allowedRoles: [ROLES.SYS_ADMIN, ROLES.PLANIFICATION_TECHNICIAN],
        },
        {
          title: "Sub Sectores",
          url: "/home/sectores/micro",
          icon: <SquareMousePointer />,
          allowedRoles: [ROLES.SYS_ADMIN, ROLES.PLANIFICATION_TECHNICIAN],
        },
        {
          title: "Entidades",
          url: "/home/entidades",
          icon: <Building2 />,
          allowedRoles: [ROLES.SYS_ADMIN, ROLES.PLANIFICATION_TECHNICIAN],
        },
      ],
    },
  ],
};

export function AppSidebar() {
  const { data: session } = useSession();
  console.log(session?.roles);

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroupContent>
          <div className="flex items-center p-2">
            <span className="text-xs">
              Bienvenido{" "}
              <span className="font-bold">{session?.user?.name}</span>
            </span>
          </div>
        </SidebarGroupContent>
        {MenuConfig.sections.map(({ title, subSections }) => {
          return (
            <Collapsible key={title} defaultOpen className="group/collapsible">
              <SidebarGroup>
                <SidebarGroupLabel asChild>
                  <CollapsibleTrigger>
                    {title}
                    <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {subSections.map(({ title, url, allowedRoles, icon }) => {
                        if (!checkRoles(allowedRoles, session)) {
                          return null; // Skip rendering this section if the user does not have the required roles
                        }
                        return (
                          <SidebarMenuItem key={title}>
                            <SidebarMenuButton asChild>
                              <Link href={url}>
                                {icon}
                                <span>{title}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          );
        })}
      </SidebarContent>
    </Sidebar>
  );
}
