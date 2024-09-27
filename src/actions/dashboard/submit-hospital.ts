// actions/dashboard/submit-hospital.ts
"use server";

import { db } from "@/db";
import { Hospital, users } from "@/db/schema";
import { currentUser } from "@/actions/auth/current-user";
import { eq } from "drizzle-orm";

interface HospitalSubmission {
  name: string;
  address: string;
  phone: string;
  email: string;
  capacity: number;
  specialties?: string;
}

export async function submitHospital(data: HospitalSubmission) {
  const user = await currentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  // Insert the hospital with a pending status
  const hospital = await db
    .insert(Hospital)
    .values({
      ...data,
      status: "pending",
      submittedBy: user.id,
      specialties: data.specialties
        ? data.specialties.split(",").map((s) => s.trim())
        : [],
    })
    .returning({
      id: Hospital.id,
    });

  await db
    .update(users)
    .set({
      hospitalId: hospital[0].id,
    })
    .where(eq(users.id, user.id));
}
