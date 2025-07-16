import React from "react";
import MicroSectoresTable from "../components/MicroSectoresTable";
import { checkServerAuth } from "@/lib/auth.utils";
import { ROLES } from "@/constants/role.constants";

const MicroSectoresPage = async () => {
  await checkServerAuth(ROLES.SYS_ADMIN);

  return <MicroSectoresTable />;
};

export default MicroSectoresPage;
