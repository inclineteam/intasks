import { Lucia } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { qwikLuciaConfig } from "qwik-lucia";
import { PrismaClient, User } from "@prisma/client";

const client = new PrismaClient();
const adapter = new PrismaAdapter(client.session, client.user);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    name: "intasks_cookie",
    attributes: {
      // set to `true` when using HTTPS
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      email: attributes.email,
      password: attributes.password,
      isNew: attributes.isNew,
      username: attributes.username,
      email_verified: attributes.email_verified,
    };
  },
});

export const { handleRequest } = qwikLuciaConfig(lucia);

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: Omit<User, "id">;
  }
}
