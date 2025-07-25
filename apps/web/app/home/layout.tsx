import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AppSidebarLayout from "./components/AppSidebar/AppSidebar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin");
  }

  return <AppSidebarLayout>{children}</AppSidebarLayout>;
}
