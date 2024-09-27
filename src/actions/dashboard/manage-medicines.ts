// actions/dashboard/manage-medicines.ts
"use server";

import { db } from "@/db";
import { Medicine, Hospital } from "@/db/schema";
import { currentUser } from "@/actions/auth/current-user";

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
