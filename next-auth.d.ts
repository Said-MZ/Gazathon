import NextAuth, { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  id: string;
  role: userRole;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
  role: "admin" | "user";
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}

import { JWT } from "@auth/core/jwt";

declare module "@auth/core/jwt" {
  interface JWT {
    role?: "admin" | "user" | null;
  }
}
