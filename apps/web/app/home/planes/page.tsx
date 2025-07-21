import React from "react";
import InstitutionalPlansTable from "./components/InstitutionalPlansTable";
import { checkServerAuth } from "@/lib/auth.utils";
import { ROLES } from "@/constants/role.constants";

const PlanesPage = async () => {
  await checkServerAuth(ROLES.SYS_ADMIN);
  
  return <InstitutionalPlansTable />;
};

export default PlanesPage;