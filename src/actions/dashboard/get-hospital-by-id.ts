"use server";

import { db } from "@/db";
import { Hospital } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getHospitalById = async (id: string) => {
  const hospital = await db.select().from(Hospital).where(eq(Hospital.id, id));
  return hospital;
};
