import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";
import { getUserById } from "@/lib/data/user";
import { twoFactorConfirmation, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getTwoFactorConfirmationByUserID } from "@/lib/data/two-factor-confirmation";
import { revalidatePath } from "next/cache";
import { getAccountByUserId } from "@/actions/auth/account";

export const { auth, handlers, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await db
        .update(users)
        .set({ emailVerified: new Date() })
        .where(eq(users.id, user.id as string)); //!
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      //Allow OAuth providers to sign in without email verification
      if (account?.provider !== "credentials") {
        return true;
      }

      const existingUser = await getUserById(user.id as string);

      //Prevent sign in if email is not verified
      if (existingUser && existingUser[0].emailVerified) {
        return true;
      }

      if (existingUser && existingUser[0].isTwoFactorEnabled) {
        const TFAConfirmation = await getTwoFactorConfirmationByUserID(
          existingUser[0].id
        );

        if (!TFAConfirmation) {
          return false;
        }

        await db
          .delete(twoFactorConfirmation)
          .where(eq(twoFactorConfirmation.userId, existingUser[0].id));
      }
      return true;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role;
      }

      if (session.user) {
        console.log("session.user", session.user);
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.isOAuth = token.isOAuth as boolean;
        revalidatePath("/server"); // paths to revalidate
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;

      const existingAccount = await getAccountByUserId(existingUser[0].id);

      token.isOAuth = existingAccount && existingAccount?.length > 0;
      token.name = existingUser[0].name;
      token.email = existingUser[0].email;
      token.role = existingUser[0].role;
      token.isTwoFactorEnabled = existingUser[0].isTwoFactorEnabled;

      return token;
    },
  },
  adapter: DrizzleAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
