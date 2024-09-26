"use server";

import { db } from "@/db";
import { Hospital, Medicine } from "@/db/schema";
import { count, eq, lt, ne } from "drizzle-orm";

export const fetchDashboardData = async () => {
  // only count hospitals that are not pending
  const totalHospitals = await db
    .select({ count: count() })
    .from(Hospital)
    .where(eq(Hospital.status, "approved"));
  const totalMedicines = await db.select({ count: count() }).from(Medicine);
  const lowStockAlerts = await db
    .select({ count: count() })
    .from(Medicine)
    .where(lt(Medicine.stock, Medicine.minStock));

  // anything not approved
  const unapprovedHospitals = await db
    .select({ count: count() })
    .from(Hospital)
    .where(ne(Hospital.status, "approved"));

  return {
    totalHospitals: totalHospitals[0].count,
    totalMedicines: totalMedicines[0].count,
    lowStockAlerts: lowStockAlerts[0].count,
    unapprovedHospitals: unapprovedHospitals[0].count,
  };
};
