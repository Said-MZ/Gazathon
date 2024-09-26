// actions/dashboard/manage-hospitals.ts
"use server";

import { db } from "@/db";
import { Hospital } from "@/db/schema";
import { eq } from "drizzle-orm";
import { currentUser } from "../auth/current-user";

export async function fetchPendingHospitals() {
  const user = await currentUser();
  if (!user || user.role !== "admin") {
    throw new Error("Unauthorized");
  }

  return db.select().from(Hospital).where(eq(Hospital.status, "pending"));
}

export async function approveHospital(id: string) {
  const user = await currentUser();
  if (!user || user.role !== "admin") {
    throw new Error("Unauthorized");
  }

  await db
    .update(Hospital)
    .set({ status: "approved" })
    .where(eq(Hospital.id, id));
}

export async function rejectHospital(id: string) {
  const user = await currentUser();
  if (!user || user.role !== "admin") {
    throw new Error("Unauthorized");
  }

  await db
    .update(Hospital)
    .set({ status: "rejected" })
    .where(eq(Hospital.id, id));
}


export async function fetchHospital(id: string) {
  const user = await currentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

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

export async function updateHospital(data: {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  capacity: number;
  specialties: string[];
}) {
  const user = await currentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  await db
    .update(Hospital)
    .set({
      name: data.name,
      address: data.address,
      phone: data.phone,
      email: data.email,
      capacity: data.capacity,
      specialties: data.specialties,
      updatedAt: new Date(),
    })
    .where(eq(Hospital.id, data.id));
}