// actions/dashboard/manage-hospitals.ts
"use server";

import { db } from "@/db";
import { Hospital } from "@/db/schema";
import { eq } from "drizzle-orm";
import { currentUser } from "../auth/current-user";

export async function fetchPendingHospitals() {
  const user = await currentUser();
//   if (!user || user.role !== "ADMIN") {
//     throw new Error("Unauthorized");
//   }

  return db.select().from(Hospital).where(eq(Hospital.status, "pending"));
}

export async function approveHospital(id: string) {
  const user = await currentUser();
//   if (!user || user.role !== "ADMIN") {
//     throw new Error("Unauthorized");
//   }

  await db
    .update(Hospital)
    .set({ status: "approved" })
    .where(eq(Hospital.id, id));
}

export async function rejectHospital(id: string) {
  const user = await currentUser();
//   if (!user || user.role !== "ADMIN") {
//     throw new Error("Unauthorized");
//   }

  await db
    .update(Hospital)
    .set({ status: "rejected" })
    .where(eq(Hospital.id, id));
}
