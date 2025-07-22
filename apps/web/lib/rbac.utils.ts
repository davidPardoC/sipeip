import { Session } from "next-auth";

export function shouldRenderByRole(
  roles: string[],
  session: Session | null
): boolean {
  if (!session) {
    return false;
  }

  if (!roles || roles.length === 0) {
    return true;
  }
  return session.roles.some((role) => roles.includes(role));
}
