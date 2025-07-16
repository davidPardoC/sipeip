import React from "react";
import MacroSectoresTable from "../components/MacroSectoresTable";
import { checkServerAuth } from "@/lib/auth.utils";
import { ROLES } from "@/constants/role.constants";

const MacroSectoresPage = async () => {

  await checkServerAuth(ROLES.SYS_ADMIN);
  
  return <MacroSectoresTable />;
};

export default MacroSectoresPage;
