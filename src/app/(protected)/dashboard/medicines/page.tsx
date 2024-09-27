import { Suspense } from "react";
import Spinner from "@/components/ui/spinner";
import MedicinesClient from "@/components/dashboard/medicines-client";
import Link from "next/link";

export default function MedicinesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Medicines</h1>
        <Link href="/dashboard/add-medicine" className="btn btn-primary">
          Add Medicine
        </Link>
      </div>
      <Suspense fallback={<Spinner />}>
        <MedicinesClient />
      </Suspense>
    </div>
  );
}
