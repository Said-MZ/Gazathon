import { db } from "@/db";
import { passwordResetToken } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const pToken = await db
      .select()
      .from(passwordResetToken)
      .where(eq(passwordResetToken.token, token));

    return pToken;
  } catch {
    return null;
  }
};

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const pToken = await db
      .select()
      .from(passwordResetToken)
      .where(eq(passwordResetToken.email, email));

    return pToken;
  } catch {
    return null;
  }
};
