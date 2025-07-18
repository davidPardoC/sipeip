import {
  Building2,
  Calendar,
  ChartSpline,
  LayoutDashboard,
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
      allowedRoles: [ROLES.SYS_ADMIN, ROLES.PLANIFICATION_TECHNICIAN],
      title: "SIPEiP",
      subSections: [
        {
          title: "Inicio",
          url: "/home",
          icon: LayoutDashboard,
        },
        {
          title: "Indicadores",
          url: "/home/indicadores",
          icon: ChartSpline,
        },
        {
          title: "Planes",
          url: "/home/planes",
          icon: Calendar,
        },
        {
          title: "Proyectos",
          url: "/home/proyectos",
          icon: SquareMousePointer,
        },
        {
          title: "Programas",
          url: "/home/programas",
          icon: SquareMousePointer,
        },
        {
          title: "Objetivos",
          url: "/home/objetivos",
          icon: SquareMousePointer,
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
          icon: SquareMousePointer,
        },
        {
          title: "Sectores",
          url: "/home/sectores",
          icon: SquareMousePointer,
        },
        {
          title: "Micro Sectores",
          url: "/home/sectores/micro",
          icon: SquareMousePointer,
        },
        {
          title: "Entidades",
          url: "/home/entidades",
          icon: Building2,
        },
        {
          title: "Reportes",
          url: "/home/reports",
          icon: Building2,
        }
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
        {MenuConfig.sections.map(({ title, subSections, allowedRoles }) => {
          if (!checkRoles(allowedRoles, session)) {
            return null; // Skip rendering this section if the user does not have the required roles
          }

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
                      {subSections.map((item) => (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton asChild>
                            <Link href={item.url}>
                              <item.icon />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
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
