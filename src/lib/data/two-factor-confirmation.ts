import { db } from "@/db";
import { twoFactorConfirmation } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getTwoFactorConfirmationByUserID = async (userId: string) => {
  try {
    const TFAConfirmation = await db
      .select()
      .from(twoFactorConfirmation)
      .where(eq(twoFactorConfirmation.userId, userId));

    return TFAConfirmation;
  } catch {
    return null;
  }
};
