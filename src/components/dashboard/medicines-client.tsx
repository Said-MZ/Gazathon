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

// Define the Medicine type
interface Medicine {
  id: string;
  name: string;
  genericName: string;
  stock: number;
  expirationDate: string; // Assuming this is a string in ISO format
}

const MedicinesClient = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);

  useEffect(() => {
    const loadMedicines = async () => {
      const data = await fetchMedicines();
      const formattedData = data.map((medicine: any) => ({
        ...medicine,
        genericName: medicine.genericName || "",
      }));
      setMedicines(formattedData);
    };
    loadMedicines();
  }, []);

  return (
    <Table>
      <TableHeader>
        <TableRow>
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
