"use server";

import { db } from "@/db";
import { NewPasswordSchema } from "@/zod";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { getPasswordResetTokenByToken } from "@/lib/data/password-reset-token";
import { passwordResetToken, users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token: string | null
) => {
  if (!token) {
    return { error: "missing token" };
  }

  const validatedFields = NewPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { password } = validatedFields.data;

  const pToken = await getPasswordResetTokenByToken(token);

  if (!pToken || pToken.length === 0) {
    return { error: "Invalid or expired token" };
  }

  if (pToken[0]?.expires! < new Date()) {
    return { error: "Token expired" };
  }

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, pToken[0].email!));

  if (!existingUser) {
    return { error: "User not found" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db
    .update(users)
    .set({ password: hashedPassword })
    .where(eq(users.email, pToken[0].email!));

  await db
    .delete(passwordResetToken)
    .where(eq(passwordResetToken.id, pToken[0].id));

  return { success: "Password reset" };
};
