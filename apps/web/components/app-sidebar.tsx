import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";
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

// Menu items.
const items = [
  {
    title: "Inicio",
    url: "/home",
    icon: Home,
  },
  {
    title: "Indicadores",
    url: "/home/indicadores",
    icon: Inbox,
  },
  {
    title: "Planes",
    url: "/home/planes",
    icon: Calendar,
  },
  {
    title: "Entidades",
    url: "/home/entidades",
    icon: Search,
  },
];

const sectorsMenu = [
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
];

export function AppSidebar() {
  const { data: session } = useSession();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="flex items-center p-2">
              <span className="text-xs">
                Bienvenido{" "}
                <span className="font-bold">{session?.user?.name}</span>
              </span>
            </div>
          </SidebarGroupContent>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
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
        </SidebarGroup>
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger>
                Sectores
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {sectorsMenu.map((item) => (
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
      </SidebarContent>
    </Sidebar>
  );
}
