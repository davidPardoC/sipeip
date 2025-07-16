import NextAuth from "next-auth";
import Keycloak from "next-auth/providers/keycloak";
import { publishLogEvent } from "./infraestructure/kafka/kafka.publisher";
import { LOG_EVENTS } from "./types/event.types";
import jwt from "jsonwebtoken";

export const { handlers, auth, signIn, signOut } = NextAuth({
  events: {
    signIn: async (message) => {
      publishLogEvent({
        event: LOG_EVENTS.AUTH.SIGN_IN,
        userId: message.user.id,
      });
    },
  },
  providers: [Keycloak({})],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account }) {
      let roles: string[] = [];
      if (account?.access_token) {
        const decoded = jwt.decode(account.access_token) as Record<string, any>;
        roles = decoded?.realm_access?.roles || [];
      } else {
        return token;
      }

      const newToken = { ...token, roles };
      return newToken;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub || "";
      }
      return session;
    },
  },
});
