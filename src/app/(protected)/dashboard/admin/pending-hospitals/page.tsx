import { Suspense } from "react";
import { PendingHospitalsClient } from "@/components/dashboard/pending-hospitals-client";
import Spinner from "@/components/ui/spinner";

export default function PendingHospitalsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Pending Hospital Requests</h1>
      <Suspense fallback={<Spinner />}>
        <PendingHospitalsClient />
      </Suspense>
    </div>
  );
}
