import { Suspense } from "react";
import Spinner from "@/components/ui/spinner";
import HospitalsClient from "@/components/dashboard/hospitals-client";
import Link from "next/link";

export default function HospitalsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Hospitals</h1>
        <Link href="/dashboard/hospitals/add" className="btn btn-primary">
          Add Hospital
        </Link>
      </div>
      <Suspense fallback={<Spinner />}>
        <HospitalsClient />
      </Suspense>
    </div>
  );
}
