// get-hospital-by-medecine-id

"use server";

import { db } from "@/db";
import { Medicine } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getHospitalByMedecineId = async (id: string) => {
  const hospital = await db.select().from(Medicine).where(eq(Medicine.id, id));
  return hospital;
};
