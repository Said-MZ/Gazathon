import { Suspense } from "react";
import Spinner from "@/components/ui/spinner";
import DashboardClient from "@/components/dashboard/dashboard-client";
import { currentRole } from "@/actions/auth/current-user";
import HospitalsClient from "@/components/dashboard/hospitals-client";
import MedicinesClient from "@/components/dashboard/medicines-client";

export default async function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Dashboard</h1>
      <Suspense fallback={<Spinner />}>
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Overview</h2>
          <DashboardClient />
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Hospitals</h2>
          <HospitalsClient />
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Medicines</h2>
          <MedicinesClient />
        </div>
      </Suspense>
    </div>
  );
}
