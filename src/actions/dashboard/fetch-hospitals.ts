"use server";

import { db } from "@/db";
import { Hospital } from "@/db/schema";
import { eq } from "drizzle-orm";

export const fetchHospitals = async () => {
  const hospitals = await db
    .select()
    .from(Hospital)
    .where(eq(Hospital.status, "approved"));
  return hospitals;
};
