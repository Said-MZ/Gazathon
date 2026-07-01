"use server";

import { db } from "@/db";
import { Hospital, Medicine } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getHospitalByMedicineId = async (id: string) => {
  const [hospital] = await db
    .select({
      id: Hospital.id,
      name: Hospital.name,
      address: Hospital.address,
      phone: Hospital.phone,
      email: Hospital.email,
      capacity: Hospital.capacity,
      specialties: Hospital.specialties,
      status: Hospital.status,
      submittedBy: Hospital.submittedBy,
      createdAt: Hospital.createdAt,
      updatedAt: Hospital.updatedAt,
    })
    .from(Medicine)
    .innerJoin(Hospital, eq(Medicine.hospitalId, Hospital.id))
    .where(eq(Medicine.id, id))
    .limit(1);

  return hospital ?? null;
};
