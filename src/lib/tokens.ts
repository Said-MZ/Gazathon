import { v4 as uuid } from "uuid";
import { getVerificationTokenByEmail } from "./data/verification-token";
import { db } from "@/db";
import {
  passwordResetToken,
  twoFactorToken,
  verificationToken,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { getPasswordResetTokenByEmail } from "./data/password-reset-token";
import crypto from "crypto";
import { getTwoFactorTokenByEmail } from "./data/two-factor-token";

export const generateTwoFactorToken = async (email: string) => {
  const token = crypto.randomInt(100_000, 1_000_000).toString();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getTwoFactorTokenByEmail(email);

  if (existingToken && existingToken.length > 0) {
    await db
      .delete(verificationToken)
      .where(eq(verificationToken.id, existingToken[0].id));
  }

  const TFAToken = await db
    .insert(twoFactorToken)
    .values({
      token,
      email,
      expires,
    })
    .returning({
      token: twoFactorToken.token,
    });

  return TFAToken;
};

export const generateVerificationToken = async (email: string) => {
  const token = uuid();
  // expires after 30 minutes
  const expires = new Date(new Date().getTime() + 30 * 60000);

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await db
      .delete(verificationToken)
      .where(eq(verificationToken.email, email));
  }

  const vToken = await db
    .insert(verificationToken)
    .values({
      email: email,
      token: token,
      expires: expires,
    })
    .returning({
      token: verificationToken.token,
    });

  return vToken;
};

export const generatePasswordResetToken = async (email: string) => {
  const token = uuid();

  // expires after 30 minutes
  const expires = new Date(new Date().getTime() + 30 * 60000);
  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken && existingToken.length > 0) {
    await db
      .delete(verificationToken)
      .where(eq(verificationToken.email, email));
  }

  const pToken = await db
    .insert(passwordResetToken)
    .values({
      token,
      email,
      expires,
    })
    .returning({
      token: passwordResetToken.token,
      email: passwordResetToken.email,
    });

  return pToken;
};
