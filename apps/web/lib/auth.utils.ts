import { auth } from "@/auth";
import { UnauthorizedException } from "@/constants/error.constants";
import { Session } from "next-auth";
import { redirect } from "next/navigation";

export const checkAuth = async (...roles: string[]) => {
  const session = await auth();
  if (!session) {
    throw new UnauthorizedException();
  }

  if (!checkRoles(roles, session)) {
    throw new UnauthorizedException("Forbidden");
  }

  return session;
};

export function checkRoles(roles: string[], session: Session): boolean {
  if (!roles || roles.length === 0) {
    return true;
  }
  return session.roles.some((role) => roles.includes(role));
}

export async function checkServerAuth(...roles: string[]) {
  try {
    const session = await checkAuth(...roles);
    return session;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    redirect("/unauthorized");
    // This line will never be reached, but is needed to satisfy TypeScript
  }
}
