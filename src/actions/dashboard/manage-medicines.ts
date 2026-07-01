"use server";

import { db } from "@/db";
import { Medicine, Hospital } from "@/db/schema";
import { currentUser } from "@/actions/auth/current-user";
import { eq } from "drizzle-orm";
import { z } from "zod";

const medicinePayloadSchema = z.object({
  name: z.string().trim().min(1, "Medicine name is required"),
  description: z.string().trim().optional(),
  genericName: z.string().trim().min(1, "Generic name is required"),
  dosage: z.string().trim().min(1, "Dosage is required"),
  form: z.string().trim().min(1, "Form is required"),
  price: z.number().finite().min(0, "Price must be non-negative"),
  stock: z.number().int().min(0, "Stock must be non-negative"),
  minStock: z.number().int().min(0, "Minimum stock must be non-negative"),
  expirationDate: z
    .string()
    .min(1, "Expiration date is required")
    .refine((value) => !Number.isNaN(Date.parse(value)), {
      message: "Expiration date is invalid",
    }),
  batchNumber: z.string().trim().min(1, "Batch number is required"),
  hospitalId: z.string().trim().min(1, "Hospital is required"),
});

const updateMedicinePayloadSchema = medicinePayloadSchema.extend({
  id: z.string().trim().min(1, "Medicine id is required"),
  description: z.string().trim().nullable().optional(),
});

async function assertAuthenticated() {
  const user = await currentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  return user;
}

async function assertHospitalExists(hospitalId: string) {
  const [hospital] = await db
    .select({ id: Hospital.id })
    .from(Hospital)
    .where(eq(Hospital.id, hospitalId))
    .limit(1);

  if (!hospital) {
    throw new Error("Selected hospital does not exist");
  }
}

export async function addMedicine(data: z.infer<typeof medicinePayloadSchema>) {
  await assertAuthenticated();
  const validatedData = medicinePayloadSchema.parse(data);
  await assertHospitalExists(validatedData.hospitalId);

  await db.insert(Medicine).values({
    ...validatedData,
    description: validatedData.description || null,
    expirationDate: new Date(validatedData.expirationDate),
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

export async function fetchHospitals() {
  await assertAuthenticated();

  return db
    .select({ id: Hospital.id, name: Hospital.name })
    .from(Hospital)
    .where(eq(Hospital.status, "approved"));
}

export async function fetchMedicine(id: string) {
  await assertAuthenticated();

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

export async function updateMedicine(
  data: z.infer<typeof updateMedicinePayloadSchema>
) {
  await assertAuthenticated();
  const validatedData = updateMedicinePayloadSchema.parse(data);
  await assertHospitalExists(validatedData.hospitalId);

  await db
    .update(Medicine)
    .set({
      ...validatedData,
      description: validatedData.description || null,
      expirationDate: new Date(validatedData.expirationDate),
      updatedAt: new Date(),
    })
    .where(eq(Medicine.id, validatedData.id));
}
