"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SessionProvider } from "next-auth/react";

export default function AppSidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarTrigger />

        <main className="container flex h-screen w-full flex-col items-center justify-start gap-4 p-4">
          {children}
        </main>
      </SidebarProvider>
    </SessionProvider>
  );
}
