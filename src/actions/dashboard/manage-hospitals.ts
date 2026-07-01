"use server";

import { db } from "@/db";
import { Hospital } from "@/db/schema";
import { eq } from "drizzle-orm";
import { currentUser } from "../auth/current-user";
import { z } from "zod";

const hospitalUpdateSchema = z.object({
  id: z.string().trim().min(1, "Hospital id is required"),
  name: z.string().trim().min(1, "Hospital name is required"),
  address: z.string().trim().min(1, "Address is required"),
  phone: z.string().trim().min(1, "Phone number is required"),
  email: z.string().trim().email("Invalid email address"),
  capacity: z.number().int().min(1, "Capacity must be at least 1"),
  specialties: z.array(z.string().trim().min(1)).default([]),
});

async function requireAdmin() {
  const user = await currentUser();
  if (!user || user.role !== "admin") {
    throw new Error("Unauthorized");
  }

  return user;
}

async function requireUser() {
  const user = await currentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  return user;
}

export async function fetchPendingHospitals() {
  await requireAdmin();

  return db.select().from(Hospital).where(eq(Hospital.status, "pending"));
}

export async function approveHospital(id: string) {
  await requireAdmin();

  await db
    .update(Hospital)
    .set({ status: "approved", updatedAt: new Date() })
    .where(eq(Hospital.id, id));
}

export async function rejectHospital(id: string) {
  await requireAdmin();

  await db
    .update(Hospital)
    .set({ status: "rejected", updatedAt: new Date() })
    .where(eq(Hospital.id, id));
}

export async function fetchHospital(id: string) {
  await requireUser();

  const hospital = await db
    .select()
    .from(Hospital)
    .where(eq(Hospital.id, id))
    .limit(1);

  if (hospital.length === 0) {
    throw new Error("Hospital not found");
  }

  return hospital[0];
}

export async function updateHospital(
  data: z.infer<typeof hospitalUpdateSchema>
) {
  const user = await requireUser();
  const validatedData = hospitalUpdateSchema.parse(data);
  const existingHospital = await fetchHospital(validatedData.id);

  if (user.role !== "admin" && existingHospital.submittedBy !== user.id) {
    throw new Error("Unauthorized");
  }

  await db
    .update(Hospital)
    .set({
      name: validatedData.name,
      address: validatedData.address,
      phone: validatedData.phone,
      email: validatedData.email,
      capacity: validatedData.capacity,
      specialties: validatedData.specialties,
      updatedAt: new Date(),
    })
    .where(eq(Hospital.id, validatedData.id));
}
