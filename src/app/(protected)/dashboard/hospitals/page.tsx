import { Suspense } from "react";
import Spinner from "@/components/ui/spinner";
import HospitalsClient from "@/components/dashboard/hospitals-client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { currentRole } from "@/actions/auth/current-user";

export default async function HospitalsPage() {
  const isAdmin = (await currentRole()) === "admin";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Hospitals</h1>
          <p className="text-sm text-muted-foreground">
            Browse approved hospitals participating in the supply network.
          </p>
        </div>
        {isAdmin && (
          <Button asChild>
            <Link href="/dashboard/admin/add-hospital">Add Hospital</Link>
          </Button>
        )}
      </div>
      <Suspense fallback={<Spinner />}>
        <HospitalsClient />
      </Suspense>
    </div>
  );
}
