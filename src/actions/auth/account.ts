"use server";

import { db } from "@/db";
import { accounts } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getAccountByUserId = async (userId: string) => {
  try {
    const account = await db
      .select()
      .from(accounts)
      .where(eq(accounts.userId, userId));

    return account;
  } catch {
    return null;
  }
};
