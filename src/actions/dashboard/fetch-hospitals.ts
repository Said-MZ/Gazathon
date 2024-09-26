"use server";

import { db } from "@/db";
import { Hospital } from "@/db/schema";

export const fetchHospitals = async () => {
  const hospitals = await db.select().from(Hospital);
  return hospitals;
};
