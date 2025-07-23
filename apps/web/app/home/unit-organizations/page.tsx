import React from "react";
import OrganizationalUnitsTable from "./components/OrganizationalUnitsTable";
import { checkServerAuth } from "@/lib/auth.utils";
import { ROLES } from "@/constants/role.constants";

interface UnitOrganizationsPageProps {
  searchParams: Promise<{
    publicEntity?: string;
  }>;
}

const UnitOrganizationsPage = async ({
  searchParams,
}: UnitOrganizationsPageProps) => {
  await checkServerAuth(ROLES.SYS_ADMIN);

  const { publicEntity } = await searchParams;

  return <OrganizationalUnitsTable publicEntityId={publicEntity} />;
};

export default UnitOrganizationsPage;
