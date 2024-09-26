import { db } from "@/db";
import { twoFactorToken } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getTwoFactorTokenByToken = async (token: string) => {
  try {
    const TFAToken = await db
      .select()
      .from(twoFactorToken)
      .where(eq(twoFactorToken.token, token));

    return TFAToken;
  } catch {
    return null;
  }
};

export const getTwoFactorTokenByEmail = async (email: string) => {
  try {
    const TFAToken = await db
      .select()
      .from(twoFactorToken)
      .where(eq(twoFactorToken.email, email));

    return TFAToken;
  } catch {
    return null;
  }
};
