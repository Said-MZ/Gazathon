import { Suspense } from "react";
import { EditMedicineForm } from "@/components/dashboard/edit-medicine-form";
import Spinner from "@/components/ui/spinner";

interface EditMedicinePageProps {
  params: { id: string };
}

export default function EditMedicinePage({ params }: EditMedicinePageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Medicine</h1>
      <Suspense fallback={<Spinner />}>
        <EditMedicineForm medicineId={params.id} />
      </Suspense>
    </div>
  );
}
