"use server";

import { db } from "@/db";
import { Hospital, Medicine } from "@/db/schema";
import { count, lt } from "drizzle-orm";

export const fetchDashboardData = async () => {
  const totalHospitals = await db.select({ count: count() }).from(Hospital);
  const totalMedicines = await db.select({ count: count() }).from(Medicine);
  const lowStockAlerts = await db
    .select({ count: count() })
    .from(Medicine)
    .where(lt(Medicine.stock, Medicine.minStock));

  return {
    totalHospitals: totalHospitals[0].count,
    totalMedicines: totalMedicines[0].count,
    lowStockAlerts: lowStockAlerts[0].count,
  };
};
