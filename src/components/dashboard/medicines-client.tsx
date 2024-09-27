"use client";

import { useState, useEffect } from "react";
import { fetchMedicines } from "@/actions/dashboard/fetch-medicine";
import { getHospitalById } from "@/actions/dashboard/get-hospital-by-id";
import { MedicineSearch } from "./medicine-search";
import { useRouter } from "next/navigation";

type Medicine = {
  id: string;
  name: string;
  genericName: string;
  stock: number;
  expirationDate: Date;
};

interface Hospital {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  capacity: number | null;
  specialties: string[] | null;
  status: "pending" | "approved" | "rejected" | null;
  submittedBy: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

const MedicinesClient = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [hospital, setHospital] = useState<Hospital | null>(null);

  useEffect(() => {
    const loadMedicines = async () => {
      const data = await fetchMedicines();
      const formattedData = data.map((medicine: any) => ({
        ...medicine,
        genericName: medicine.genericName || "",
        expirationDate: new Date(medicine.expirationDate),
      }));
      setMedicines(formattedData);
      if (formattedData.length > 0) {
        const hospitalData = await getHospitalById(
          formattedData[0]?.hospitalId
        );
        setHospital(hospitalData[0]);
      }
    };
    loadMedicines();
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };

  return (
    <div>
      <h1>Medicine Client</h1>
      <MedicineSearch
        medicines={medicines.map((m) => ({
          ...m,
          expirationDate: m.expirationDate.toISOString(),
        }))}
      />
    </div>
  );
};

export default MedicinesClient;
