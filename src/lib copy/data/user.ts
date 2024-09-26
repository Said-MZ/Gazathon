"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.select().from(users).where(eq(users.email, email));

    if (user.length === 0) {
      return null;
    }

    return user;
  } catch {
    null;
  }
};

export const getUserById = async (id: string) => {
  try {
    return await db.select().from(users).where(eq(users.id, id));
  } catch {
    null;
  }
};
