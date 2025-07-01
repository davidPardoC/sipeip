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
        user: message.user.id,
        user_email: message.user.email,
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
    session: async ({ session, token, user }) => {
      console.log("[session callback] token " + JSON.stringify(token));

      return session;
    },
  },
});
