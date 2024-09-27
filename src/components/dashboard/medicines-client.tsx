"use client";

import { useState, useEffect } from "react";
import { fetchMedicines } from "@/actions/dashboard/fetch-medicine";
import { fetchHospitals } from "@/actions/dashboard/fetch-hospitals";
import { MedicineSearch } from "./medicine-search";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

type Medicine = {
  id: string;
  name: string;
  genericName: string;
  stock: number;
  expirationDate: Date;
  hospitalId: string;
  minStock: number;
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
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [medicinesData, hospitalsData] = await Promise.all([
          fetchMedicines(),
          fetchHospitals(),
        ]);

        const formattedMedicines = medicinesData.map((medicine: any) => ({
          ...medicine,
          genericName: medicine.genericName || "",
          expirationDate: new Date(medicine.expirationDate),
        }));

        setMedicines(formattedMedicines);
        setHospitals(hospitalsData);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    loadData();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">Medicines</h1>
        <Button asChild>
          <Link href="/dashboard/add-medicine">Add Medicine</Link>
        </Button>
      </div>
      <Card className="bg-card text-card-foreground mb-6">
        <CardHeader>
          <CardTitle>Search Medicines</CardTitle>
        </CardHeader>
        <CardContent>
          <MedicineSearch
            medicines={medicines.map((m) => ({
              ...m,
              expirationDate: m.expirationDate.toISOString(),
            }))}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicinesClient;
