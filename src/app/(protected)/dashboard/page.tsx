import React, { Suspense } from "react";
import Spinner from "@/components/ui/spinner";
import DashboardClient from "@/components/dashboard/dashboard-client";
import { currentRole } from "@/actions/auth/current-user";
import HospitalsClient from "@/components/dashboard/hospitals-client";
import MedicinesClient from "@/components/dashboard/medicines-client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Upload } from "lucide-react";

const ImportCSVButton = () => (
  <Button variant="outline" className="ml-2">
    <Upload className="mr-2 h-4 w-4" />
    Import CSV
  </Button>
);

export default async function DashboardPage() {
  const role = await currentRole();
  const isAdmin = role === "admin";

  return (
    <div className="container mx-auto px-4 py-24">
      <h1 className="text-2xl font-bold mb-6 text-center">Dashboard</h1>
      <Suspense fallback={<Spinner />}>
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Overview</h2>
          <DashboardClient />
        </div>
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Hospitals</h2>
            <div className="flex">
              {isAdmin && (
                <>
                  <Button variant="outline" asChild>
                    <Link href="/dashboard/admin/add-hospital">
                      Add Hospital
                    </Link>
                  </Button>
                </>
              )}
              <ImportCSVButton />
            </div>
          </div>
          <HospitalsClient />
        </div>
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Medicines</h2>
            {isAdmin && <ImportCSVButton />}
          </div>
          <MedicinesClient />
        </div>
      </Suspense>
    </div>
  );
}
