"use server";

import { db } from "@/db";
import { Medicine, Hospital } from "@/db/schema";
import { currentUser } from "@/actions/auth/current-user";
import { eq } from "drizzle-orm";

export async function addMedicine(data: {
  name: string;
  description?: string;
  genericName: string;
  dosage: string;
  form: string;
  price: number;
  stock: number;
  minStock: number;
  expirationDate: string;
  batchNumber: string;
  hospitalId: string;
}) {
  const user = await currentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  await db.insert(Medicine).values({
    ...data,
    expirationDate: new Date(data.expirationDate),
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

export async function fetchHospitals() {
  const user = await currentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  return db.select({ id: Hospital.id, name: Hospital.name }).from(Hospital);
}

// actions/dashboard/manage-medicines.ts

export async function fetchMedicine(id: string) {
  const user = await currentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const medicine = await db
    .select()
    .from(Medicine)
    .where(eq(Medicine.id, id))
    .limit(1);

  if (medicine.length === 0) {
    throw new Error("Medicine not found");
  }

  return medicine[0];
}

export async function updateMedicine(data: {
  id: string;
  name: string;
  description?: string | null; // Allow undefined or null
  genericName: string;
  dosage: string;
  form: string;
  price: number;
  stock: number;
  minStock: number;
  expirationDate: string;
  batchNumber: string;
  hospitalId: string;
}) {
  const user = await currentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  await db
    .update(Medicine)
    .set({
      ...data,
      description: data.description ?? null, // Convert undefined to null for the database
      expirationDate: new Date(data.expirationDate),
      updatedAt: new Date(),
    })
    .where(eq(Medicine.id, data.id));
}
