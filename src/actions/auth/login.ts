"use server";

import { loginSchema } from "@/zod";
import * as z from "zod";
import { signIn } from "../../../auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/lib/data/user";
import {
  generateTwoFactorToken,
  generateVerificationToken,
} from "@/lib/tokens";
import { sendTwoFactorTokenEmail, sendVerificationEmail } from "@/lib/mail";
import { getTwoFactorTokenByEmail } from "@/lib/data/two-factor-token";
import { db } from "@/db";
import { twoFactorConfirmation, twoFactorToken } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getTwoFactorConfirmationByUserID } from "@/lib/data/two-factor-confirmation";

export const login = async (values: z.infer<typeof loginSchema>) => {
  const validatedSchema = loginSchema.safeParse(values);

  if (!validatedSchema.success) {
    return { error: "Invalid fields" };
  }

  const { email, password, code } = validatedSchema.data;

  const existingUser = await getUserByEmail(email);
  if (
    !existingUser ||
    existingUser?.length === 0 ||
    !existingUser[0]?.password ||
    !existingUser[0]?.email
  ) {
    return { error: "Invalid credentials" };
  }

  if (!existingUser[0].emailVerified) {
    const verificationToken = await generateVerificationToken(email);

    if (!verificationToken[0].token) {
      return { error: "Something went wrong" };
    }
    await sendVerificationEmail(email, verificationToken[0].token);

    return { success: "Check your email for verification" };
  }

  if (existingUser[0].isTwoFactorEnabled && existingUser[0].email) {
    if (code) {
      const TFAToken = await getTwoFactorTokenByEmail(existingUser[0].email);

      if (!TFAToken || TFAToken.length === 0) {
        return { error: "Invalid two factor code" };
      }

      if (TFAToken[0].token !== code) {
        return { error: "Invalid two factor code" };
      }

      if (!TFAToken[0].expires) {
        return { error: "Two factor code has expired" };
      }

      const hasCodeExpired = new Date() > TFAToken[0].expires;

      if (hasCodeExpired) {
        return { error: "Two factor code has expired" };
      }

      // console.log(TFAToken[0]);

      await db
        .delete(twoFactorToken)
        .where(eq(twoFactorToken.id, TFAToken[0].id));

      const existingConfirmation = await getTwoFactorConfirmationByUserID(
        existingUser[0].id
      );

      if (existingConfirmation && existingConfirmation.length > 0) {
        await db
          .delete(twoFactorConfirmation)
          .where(eq(twoFactorConfirmation.id, existingConfirmation[0].id));
      }

      await db.insert(twoFactorConfirmation).values({
        userId: existingUser[0].id,
      });
    } else {
      const TFAToken = await generateTwoFactorToken(existingUser[0].email);
      if (!TFAToken[0].token) {
        return { error: "Something went wrong" };
      }
      await sendTwoFactorTokenEmail(existingUser[0].email, TFAToken[0].token);

      return { twoFactor: true };
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin": {
          return { error: "Invalid credentials" };
        }

        default: {
          return { error: "Something went wrong" };
        }
      }
    }

    throw error;
  }
};
