import { Suspense } from "react";
import { EditHospitalForm } from "@/components/dashboard/edit-hospital-form";
import Spinner from "@/components/ui/spinner";

interface EditHospitalPageProps {
  params: { id: string };
}

export default function EditHospitalPage({ params }: EditHospitalPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Hospital</h1>
      <Suspense fallback={<Spinner />}>
        <EditHospitalForm hospitalId={params.id} />
      </Suspense>
    </div>
  );
}
