import { type DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    roles: string[];
    user: DefaultSession["user"];
  }
}
