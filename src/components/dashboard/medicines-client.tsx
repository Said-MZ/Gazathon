"use client";

import { useState, useEffect } from "react";
import { fetchMedicines } from "@/actions/dashboard/fetch-medicine";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { getHospitalByMedecineId } from "@/actions/dashboard/get-hospital-by-medecine-id";

// Define the Medicine type
interface Medicine {
  id: string;
  name: string;
  genericName: string;
  stock: number;
  expirationDate: string; // Assuming this is a string in ISO format
}

interface Hospital {
  id: string;
  name: string;
  description: string | null;
  genericName: string | null;
  dosage: string | null;
  form: string | null;
  price: number;
  stock: number;
  minStock: number | null;
  expirationDate: Date;
  batchNumber: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  hospitalId: string;
}
[];

const MedicinesClient = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [hospital, setHospital] = useState<Hospital[] | null>(null);

  useEffect(() => {
    const loadMedicines = async () => {
      const data = await fetchMedicines();
      const formattedData = data.map((medicine: any) => ({
        ...medicine,
        genericName: medicine.genericName || "",
      }));
      const hospital = await getHospitalByMedecineId(data[0]?.id);
      setHospital(hospital);
      setMedicines(formattedData);
    };
    loadMedicines();
  }, []);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Hospital</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Generic Name</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Expiration Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {medicines.map((medicine) => (
          <TableRow key={medicine.id}>
            <TableCell>{hospital?.[0]?.name || "N/A"}</TableCell>
            <TableCell>{medicine.name}</TableCell>
            <TableCell>{medicine.genericName}</TableCell>
            <TableCell>{medicine.stock}</TableCell>
            <TableCell>
              {new Date(medicine.expirationDate).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <Link
                href={`/dashboard/medicines/${medicine.id}`}
                className="btn btn-sm btn-secondary mr-2"
              >
                View
              </Link>
              <Link
                href={`/dashboard/medicines/${medicine.id}/edit`}
                className="btn btn-sm btn-secondary"
              >
                Edit
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default MedicinesClient;
