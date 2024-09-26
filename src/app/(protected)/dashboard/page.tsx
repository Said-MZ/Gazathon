import { Suspense } from "react";
import Spinner from "@/components/ui/spinner";
import DashboardClient from "@/components/dashboard/dashboard-client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <Suspense fallback={<Spinner />}>
        <DashboardClient />
        <div className="flex gap-4 mt-4 mx-auto">
          <Button asChild>
            <Link href="/dashboard/hospitals">Hospitals</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/medicines">Medicines</Link>
          </Button>
        </div>
      </Suspense>
    </div>
  );
}
