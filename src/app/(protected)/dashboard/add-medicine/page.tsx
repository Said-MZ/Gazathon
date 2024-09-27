import { AddMedicineForm } from "@/components/dashboard/add-medicine-form";

const AddMedicinePage = () => {
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4 mt-28">Add Medicine</h1>
      <AddMedicineForm />
    </main>
  );
};

export default AddMedicinePage;
