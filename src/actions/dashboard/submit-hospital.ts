"use server";

import { db } from "@/db";
import { Hospital, users } from "@/db/schema";
import { currentUser } from "@/actions/auth/current-user";
import { eq } from "drizzle-orm";
import { z } from "zod";

const hospitalSubmissionSchema = z.object({
  name: z.string().trim().min(1, "Hospital name is required"),
  address: z.string().trim().min(1, "Address is required"),
  phone: z.string().trim().min(1, "Phone number is required"),
  email: z.string().trim().email("Invalid email address"),
  capacity: z.number().int().min(1, "Capacity must be at least 1"),
  specialties: z.string().optional(),
});

type HospitalSubmission = z.infer<typeof hospitalSubmissionSchema>;

export async function submitHospital(data: HospitalSubmission) {
  const user = await currentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  const validatedData = hospitalSubmissionSchema.parse(data);
  const specialties = validatedData.specialties
    ? validatedData.specialties
        .split(",")
        .map((specialty) => specialty.trim())
        .filter(Boolean)
    : [];

  const hospital = await db
    .insert(Hospital)
    .values({
      ...validatedData,
      specialties,
      status: user.role === "admin" ? "approved" : "pending",
      submittedBy: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
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
