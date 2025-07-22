import { shouldRenderByRole } from "@/lib/rbac.utils";
import { Session } from "next-auth";
import React from "react";

type Props = {
  roles: string[];
  session: Session | null;
  children?: React.ReactNode;
};

const RBACComponent = ({ roles, session, children }: Props) => {
  if (shouldRenderByRole(roles, session)) {
    return <>{children}</>;
  }

  return null;
};

export default RBACComponent;
