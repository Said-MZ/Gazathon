"use client";

import { useState, useEffect } from "react";
import { fetchMedicines } from "@/actions/dashboard/fetch-medicine";
import { getHospitalById } from "@/actions/dashboard/get-hospital-by-id";
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
  const router = useRouter();

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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">Medicines</h1>
        <Button asChild>
          <Link href="/dashboard/add-medicine">Add Medicine</Link>
        </Button>
      </div>
      <Card className="bg-card text-card-foreground">
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
      {medicines.length > 0 && (
        <Card className="mt-6 bg-card text-card-foreground">
          <CardHeader>
            <CardTitle>Medicine List</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-border">
              {medicines.map((medicine) => (
                <li key={medicine.id} className="py-4">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-primary">{medicine.name}</h3>
                      <p className="text-sm text-muted-foreground">{medicine.genericName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-secondary-foreground">Stock: {medicine.stock}</p>
                      <p className="text-secondary-foreground">Expires: {formatDate(medicine.expirationDate)}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => router.push(`/dashboard/medicines/${medicine.id}`)}
                  >
                    View Details
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
      {hospital && (
        <Card className="mt-6 bg-card text-card-foreground">
          <CardHeader>
            <CardTitle>Hospital Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p><span className="font-semibold text-primary">Name:</span> <span className="text-secondary-foreground">{hospital.name}</span></p>
            <p><span className="font-semibold text-primary">Address:</span> <span className="text-secondary-foreground">{hospital.address}</span></p>
            <p><span className="font-semibold text-primary">Phone:</span> <span className="text-secondary-foreground">{hospital.phone}</span></p>
            <p><span className="font-semibold text-primary">Email:</span> <span className="text-secondary-foreground">{hospital.email}</span></p>
            <p><span className="font-semibold text-primary">Capacity:</span> <span className="text-secondary-foreground">{hospital.capacity || "N/A"}</span></p>
            <p><span className="font-semibold text-primary">Specialties:</span> <span className="text-secondary-foreground">{hospital.specialties?.join(", ") || "N/A"}</span></p>
            <p><span className="font-semibold text-primary">Status:</span> <span className="text-secondary-foreground">{hospital.status}</span></p>
            <p><span className="font-semibold text-primary">Submitted By:</span> <span className="text-secondary-foreground">{hospital.submittedBy}</span></p>
            <p><span className="font-semibold text-primary">Created At:</span> <span className="text-secondary-foreground">{hospital.createdAt ? formatDate(hospital.createdAt) : "N/A"}</span></p>
            <p><span className="font-semibold text-primary">Updated At:</span> <span className="text-secondary-foreground">{hospital.updatedAt ? formatDate(hospital.updatedAt) : "N/A"}</span></p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MedicinesClient;
