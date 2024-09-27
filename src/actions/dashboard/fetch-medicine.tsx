"use server";

import { db } from "@/db";
import { Medicine } from "@/db/schema";

export const fetchMedicines = async () => {
  const medicines = await db.select().from(Medicine);
  return medicines;
};
