import GitHub from "next-auth/providers/github";
import type { NextAuthConfig } from "next-auth";
import google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { loginSchema } from "@/zod";
import { getUserByEmail } from "@/lib/data/user";

// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [
    google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        const validatedFields = loginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;
          const user = await getUserByEmail(email);

          if (!user || !user[0].password) {
            return null;
          }

          const passwordsMatch = await bcrypt.compare(
            password,
            user[0].password
          );

          if (passwordsMatch) {
            return user[0];
          }
        }
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
