"use server";

import { getUserByEmail, getUserById } from "@/lib/data/user";
import { currentUser } from "./current-user";
import { db } from "@/db";
import { generateVerificationToken } from "@/lib/tokens";
import { SettingsSchema } from "@/zod";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/lib/mail";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const settings = async (data: z.infer<typeof SettingsSchema>) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const existingUser = await getUserById(user?.id);
  if (!existingUser) {
    return { error: "User not found" };
  }

  if (user.isOAuth) {
    data.email = user.email as string;
    data.password = undefined;
    data.newPassword = undefined;
    data.isTwoFactorEnabled = undefined;
  }

  if (data.email && data.email !== user.email) {
    const existingUser = await getUserByEmail(data.email);

    if (existingUser && existingUser[0].id !== user.id) {
      return { error: "Email already in use" };
    }

    const verificationToken = await generateVerificationToken(data.email);

    if (!verificationToken[0].token) {
      return { error: "Something went wrong" };
    }

    await sendVerificationEmail(data.email, verificationToken[0].token);

    return { success: "Confirmation email sent" };
  }

  if (data.password && data.newPassword && existingUser[0].password) {
    const passwordsMatch = await bcrypt.compare(
      data.password,
      existingUser[0].password
    );

    if (!passwordsMatch) {
      return { error: "Incorrect password" };
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);
    data.password = hashedPassword;

    data.newPassword = undefined;

    return { success: "Password Updated!" };
  }

  await db
    .update(users)
    .set({
      name: data.name,
      email: data.email,
      role: data.role,
      isTwoFactorEnabled: data.isTwoFactorEnabled,
      password: data.password,
    })
    .where(eq(users.id, user.id));

  return { success: "Settings Updated!  " };
};
