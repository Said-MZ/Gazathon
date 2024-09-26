import { Suspense } from "react";
import Spinner from "@/components/ui/spinner";
import DashboardClient from "@/components/dashboard/dashboard-client";
import { currentRole } from "@/actions/auth/current-user";
import HospitalsClient from "@/components/dashboard/hospitals-client";
import MedicinesClient from "@/components/dashboard/medicines-client";

export default async function DashboardPage() {
  const role = await currentRole();
  return role !== "ADMIN" ? (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <Suspense fallback={<Spinner />}>
        <div className="mb-6">
          <DashboardClient />
        </div>
        <div className="mb-6">
          <HospitalsClient />
        </div>
        <div className="mb-6">
          <MedicinesClient />
        </div>
      </Suspense>
    </div>
  ) : (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <Suspense fallback={<Spinner />}>
        {/* //! TODO: Add dashboard for hospital */}
      </Suspense>
    </div>
  );
}
