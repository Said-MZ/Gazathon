// actions/dashboard/submit-hospital.ts
"use server";

import { db } from "@/db";
import { Hospital } from "@/db/schema";
import { currentUser } from "@/actions/auth/current-user";

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
  await db.insert(Hospital).values({
    ...data,
    status: "pending",
    submittedBy: user.id,
    specialties: data.specialties
      ? data.specialties.split(",").map((s) => s.trim())
      : [],
  });
}
