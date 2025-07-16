import { auth } from "@/auth";

export const checkAuth = async () => {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
};
