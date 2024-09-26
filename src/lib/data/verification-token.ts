import { db } from "@/db";
import { verificationToken } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const vToken = await db
      .select()
      .from(verificationToken)
      .where(eq(verificationToken.email, email));

    return vToken;
  } catch {
    return null;
  }
};

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const vToken = await db
      .select()
      .from(verificationToken)
      .where(eq(verificationToken.token, token));

    return vToken;
  } catch {
    return null;
  }
};
