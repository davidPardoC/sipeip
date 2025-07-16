import React from "react";
import SectoresTable from "./components/SectoresTable";
import { checkServerAuth } from "@/lib/auth.utils";
import { ROLES } from "@/constants/role.constants";

const Page = async () => {
  await checkServerAuth(ROLES.SYS_ADMIN);

  return <SectoresTable />;
};

export default Page;
