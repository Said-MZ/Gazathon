"use server";

import { db } from "@/db";
import { users, verificationToken } from "@/db/schema";
import { getUserByEmail } from "@/lib/data/user";
import { getVerificationTokenByToken } from "@/lib/data/verification-token";
import { eq } from "drizzle-orm";

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);
  if (!existingToken || !existingToken[0]) {
    return { error: "Token doesn't exist" };
  }
  console.log(existingToken[0].expires);

  const hasExpired = new Date() > new Date(existingToken[0].expires!);
  if (hasExpired) {
    return { error: "Token has expired" };
  }

  const existingUser = await getUserByEmail(existingToken[0].email!);

  if (!existingUser) {
    return { error: "User doesn't exist" };
  }

  await db
    .update(users)
    .set({ emailVerified: new Date() })
    .where(eq(users.email, existingToken[0].email!));

  await db
    .delete(verificationToken)
    .where(eq(verificationToken.email, existingToken[0].email!));

  return { success: "Email verified" };
};
