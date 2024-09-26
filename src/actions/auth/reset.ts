"use server";

import * as z from "zod";
import { getUserByEmail } from "@/lib/data/user";
// import { sendPasswordResetEmail } from "@/lib/mail";
// import { generatePasswordResetToken } from "@/lib/tokens";
import { ResetSchema } from "@/zod";
import { generatePasswordResetToken } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/lib/mail";

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid email!" };
  }

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || existingUser.length === 0) {
    return { error: "Email not found" };
  }

  const passwordResetToken = await generatePasswordResetToken(email);
  if (!passwordResetToken[0].token || !passwordResetToken[0].email) {
    return { error: "Something went wrong" };
  }

  await sendPasswordResetEmail(
    passwordResetToken[0].email,
    passwordResetToken[0].token
  );

  return { success: "Reset Email Sent" };
};
