import React from "react";
import InstitutionalPlansTable from "./components/InstitutionalPlansTable";
import { checkServerAuth } from "@/lib/auth.utils";
import { ROLES } from "@/constants/role.constants";

const PlanesPage = async () => {
  const session = await checkServerAuth(
    ROLES.SYS_ADMIN,
    ROLES.PLANIFICATION_TECHNICIAN,
    ROLES.INSTITUTIONAL_REVIEWER
  );
  return <InstitutionalPlansTable session={session} />;
};

export default PlanesPage;
