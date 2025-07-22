import NextAuth from "next-auth";
import Keycloak from "next-auth/providers/keycloak";
import { publishLogEvent } from "./infraestructure/kafka/kafka.publisher";
import { LOG_EVENTS } from "./types/event.types";
import jwt from "jsonwebtoken";
import { TokenPayload } from "./types/domain/token.entity";
import { db } from "./infraestructure/database/connection";
import { usersMapping } from "./infraestructure/database/schemas/users_mapping";

export const { handlers, auth, signIn, signOut } = NextAuth({
  events: {
    signIn: async (message) => {
      Promise.all([
        db.insert(usersMapping).values({
          keycloakId: message.user.id as string,
          userName: message.user.name as string,
        }),
        publishLogEvent({
          event: LOG_EVENTS.AUTH.SIGN_IN,
          userId: message.user.id,
        }),
      ]);
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
        const decoded = jwt.decode(account.access_token) as TokenPayload;
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
      return { ...session, roles: token.roles || [] };
    },
  },
});
